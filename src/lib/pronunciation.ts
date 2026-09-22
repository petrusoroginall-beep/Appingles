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

function tokenize(text: string): string[] {
  const words = normalize(text).split(' ').filter(Boolean)
  return words.flatMap((w) => CONTRACTION_EXPANSIONS[w]?.split(' ') ?? [w])
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

// Two words "match" if identical, or close enough that the difference is just a mis-heard
// letter or a missing plural/verb ending — not a real pronunciation mistake.
function wordsMatch(a: string, b: string): boolean {
  if (a === b) return true
  if (!a || !b) return false
  const dist = levenshtein(a, b)
  return dist <= 1 || dist / Math.max(a.length, b.length) <= 0.25
}

/** Returns a 0-100 similarity score between a spoken transcript and the target phrase. */
export function scorePronunciation(target: string, spoken: string): number {
  const targetWords = tokenize(target)
  const spokenWords = tokenize(spoken)
  if (targetWords.length === 0 || spokenWords.length === 0) return 0

  // Word-level alignment (not character-level): a single mis-heard word in a long phrase
  // should cost a fraction of the score, not tank the whole thing the way a raw
  // character-by-character diff would.
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
  const score = Math.round(Math.max(0, similarity) * 100)
  // A near-perfect attempt should read as a full 100%, not linger at 90-something.
  return score >= 90 ? 100 : score
}

export function feedbackForScore(score: number): { label: string; tone: 'great' | 'good' | 'retry' } {
  if (score >= 85) return { label: 'Excelente pronúncia! 🎉', tone: 'great' }
  if (score >= 60) return { label: 'Muito bem! Quase perfeito.', tone: 'good' }
  return { label: 'Vamos tentar de novo. Ouça e repita.', tone: 'retry' }
}
