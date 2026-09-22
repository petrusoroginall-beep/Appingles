import { allWords } from '../data/vocabulary'
import { instantPhrases } from '../data/instantPhrases'

// Strip accents, lowercase, drop punctuation — so "Não", "nao" and "não?" all match the same key.
function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[?!.,;:'"]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

const byPt = new Map<string, string>()
const byEn = new Map<string, string>()

for (const { pt, en } of instantPhrases) {
  byPt.set(normalize(pt), en)
}
for (const w of allWords) {
  byPt.set(normalize(w.pt), w.en)
  byEn.set(normalize(w.en), w.en)
}
// allWords' `pt` fields carry parenthetical notes like "Tchau / Adeus" — also index each
// slash-separated piece on its own so a match works even without the full label.
for (const w of allWords) {
  const cleanPt = w.pt.replace(/\([^)]*\)/g, '').trim()
  for (const piece of cleanPt.split('/')) {
    const key = normalize(piece)
    if (key) byPt.set(key, w.en)
  }
}

// Trigger phrases that ask "how do you say X" in either language, capturing X.
const TRIGGER_PATTERNS: RegExp[] = [
  /^como (?:se|eu) fal[ao] (.+?)(?: em ingl[eê]s)?$/i,
  /^como (?:se )?diz (.+?)(?: em ingl[eê]s)?$/i,
  /^como fica (.+?)(?: em ingl[eê]s)?$/i,
  /^o que (?:significa|quer dizer) (.+?)(?: em ingl[eê]s)?$/i,
  /^how do (?:you|i) say (.+?)(?: in english)?$/i,
  /^what does (.+?) mean$/i,
  /^what is (.+?) in english$/i,
]

/**
 * Checks whether a chat message is a "how do you say X" style question with a known
 * answer, and if so returns the English answer directly — no AI call needed.
 * Returns null when there's no confident match, so the caller falls back to the AI.
 */
export function findInstantTranslation(message: string): string | null {
  const normalized = normalize(message)
  if (!normalized) return null

  // Whole-message match: the user just said/typed the phrase itself (most common case
  // when practicing vocabulary, e.g. typing "eu te amo" or "obrigado").
  const direct = byPt.get(normalized) ?? byEn.get(normalized)
  if (direct) return direct

  for (const pattern of TRIGGER_PATTERNS) {
    const match = normalized.match(pattern)
    const captured = match?.[1]?.trim()
    if (!captured) continue
    const found = byPt.get(captured) ?? byEn.get(captured)
    if (found) return found
  }

  return null
}
