function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

// The speech engine often transcribes a contraction as its full form (or vice versa) even
// when it heard the word perfectly — "gonna" comes back as "going to", "y'all" as "yall".
// Expanding both the target and what was heard to the same full form before comparing means
// a correctly spoken contraction is never penalized just because of how it got transcribed.
const CONTRACTION_EXPANSIONS: Record<string, string> = {
  wanna: 'want to',
  gonna: 'going to',
  gotta: 'got to',
  kinda: 'kind of',
  sorta: 'sort of',
  lemme: 'let me',
  gimme: 'give me',
  dunno: 'do not know',
  aint: 'is not',
  yall: 'you all',
  outta: 'out of',
  gotcha: 'got you',
  cmon: 'come on',
  whatcha: 'what are you',
  needa: 'need to',
  hafta: 'have to',
  finna: 'fixing to',
  tryna: 'trying to',
  gon: 'going to',
  ima: 'i am going to',
}

function tokenizeRaw(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean)
}

function tokenizeExpanded(text: string): string[] {
  return tokenizeRaw(text).flatMap((w) => CONTRACTION_EXPANSIONS[w]?.split(' ') ?? [w])
}

function levenshtein(a: string, b: string) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = temp
    }
  }
  return dp[n]
}

// Collapses a word down to how it *sounds*, not how it's spelled, so that a speech-recognition
// engine picking one of several equally-valid homophone spellings for the same sound ("lemme" vs
// "lemmy", "nite" vs "night") never gets penalized. Every rule here only folds together letter
// patterns that are genuine alternate spellings of the same sound — it never merges sounds that
// are actually different, so it can't make a real mispronunciation score higher than it should.
function phoneticFold(word: string): string {
  let w = word
  // A doubled consonant almost never changes the sound ("lemme"/"lemmy", "gonna"/"gunna").
  w = w.replace(/([a-z])\1+/g, '$1')
  w = w.replace(/ck/g, 'k')
  w = w.replace(/qu/g, 'kw')
  w = w.replace(/ph/g, 'f')
  w = w.replace(/wr/g, 'r')
  w = w.replace(/^kn/, 'n')
  w = w.replace(/gh/g, '')
  w = w.replace(/x/g, 'ks')
  // A word-final y/ee/ea/ie is the same trailing "ih" sound recognizers often spell as a plain e.
  w = w.replace(/(ie|ee|ea|y)$/, 'i')
  // A silent trailing e after a consonant (once the sound above is already captured) carries no sound.
  w = w.replace(/([^aeiou])e$/, '$1')
  return w
}

// Two words "match" if identical, close enough that the difference is just a mis-heard
// letter or a missing plural/verb ending, or — critically — spelled differently but
// pronounced the same way, which is what a speech-recognition engine actually judges.
function wordsMatch(a: string, b: string): boolean {
  if (a === b) return true
  if (!a || !b) return false
  const closeEnough = (x: string, y: string) => {
    const dist = levenshtein(x, y)
    return dist <= 1 || dist / Math.max(x.length, y.length) <= 0.25
  }
  if (closeEnough(a, b)) return true
  const fa = phoneticFold(a)
  const fb = phoneticFold(b)
  return fa === fb || closeEnough(fa, fb)
}

// Word-level alignment (not character-level): a single mis-heard word in a long phrase
// should cost a fraction of the score, not tank the whole thing the way a raw
// character-by-character diff would.
function alignmentScore(targetWords: string[], spokenWords: string[]): number {
  if (targetWords.length === 0 || spokenWords.length === 0) return 0

  const m = targetWords.length
  const n = spokenWords.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = wordsMatch(targetWords[i - 1], spokenWords[j - 1]) ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }

  const distance = dp[m][n]
  const maxLen = Math.max(m, n)
  const similarity = 1 - distance / maxLen
  return Math.round(Math.max(0, similarity) * 100)
}

/**
 * Returns a 0-100 similarity score between a spoken transcript and the target phrase.
 *
 * `phonetic` is the app's own Portuguese-readable respelling of how the word actually sounds
 * (e.g. "gara" for "Gotta" — the double "t" is a flap that sounds like a light "r"). A speech
 * recognizer judges what it *heard*, not what's written, so it sometimes transcribes that real
 * sound as an unrelated-looking English word ("Gotta" heard as "Gaara"). Comparing the spoken
 * text against that expected sound — not just against the target's literal spelling — catches
 * exactly this case: someone pronounced the word correctly, but the recognizer's spelling for
 * that sound doesn't resemble the target's spelling at all. Since the final score is always the
 * best of every pass, this can only rescue an unfairly low score, never lower a fair one.
 */
export function scorePronunciation(target: string, spoken: string, phonetic?: string): number {
  // Expanding a contraction ("gonna" -> "going to") only helps when *both* sides end up with
  // the same word count; when the recognizer instead heard the contraction as a same-sounding
  // single word ("lemme" heard as "lemmy"), forcing the expansion would break the alignment
  // even though the raw, unexpanded words already sound identical. Scoring both ways and
  // keeping the best result means neither case ever gets unfairly penalized by the other.
  const rawScore = alignmentScore(tokenizeRaw(target), tokenizeRaw(spoken))
  const expandedScore = alignmentScore(tokenizeExpanded(target), tokenizeExpanded(spoken))
  const phoneticScore = phonetic ? alignmentScore(tokenizeRaw(phonetic), tokenizeRaw(spoken)) : 0
  const score = Math.max(rawScore, expandedScore, phoneticScore)
  // A near-perfect attempt should read as a full 100%, not linger at 90-something.
  return score >= 90 ? 100 : score
}

export function feedbackForScore(score: number): { label: string; tone: 'great' | 'good' | 'retry' } {
  if (score >= 85) return { label: 'Excelente pronúncia! 🎉', tone: 'great' }
  if (score >= 60) return { label: 'Muito bem! Quase perfeito.', tone: 'good' }
  return { label: 'Vamos tentar de novo. Ouça e repita.', tone: 'retry' }
}
