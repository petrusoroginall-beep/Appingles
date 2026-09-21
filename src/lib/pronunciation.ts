function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
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

/** Returns a 0-100 similarity score between a spoken transcript and the target phrase. */
export function scorePronunciation(target: string, spoken: string): number {
  const a = normalize(target)
  const b = normalize(spoken)
  if (!a || !b) return 0
  const distance = levenshtein(a, b)
  const maxLen = Math.max(a.length, b.length)
  const similarity = 1 - distance / maxLen
  return Math.round(Math.max(0, similarity) * 100)
}

export function feedbackForScore(score: number): { label: string; tone: 'great' | 'good' | 'retry' } {
  if (score >= 85) return { label: 'Excelente pronúncia! 🎉', tone: 'great' }
  if (score >= 60) return { label: 'Muito bem! Quase perfeito.', tone: 'good' }
  return { label: 'Vamos tentar de novo. Ouça e repita.', tone: 'retry' }
}
