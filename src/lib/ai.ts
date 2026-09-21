import type { ChatMessage, Level, Settings } from '../types'

export interface AIReplyResult {
  text: string
  usedRealAI: boolean
  errorMessage?: string
}

export async function getAIReply(history: ChatMessage[], settings: Settings): Promise<AIReplyResult> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        level: settings.level,
        messages: history.map((m) => ({ role: m.role, text: m.text })),
      }),
    })

    const data = (await response.json().catch(() => null)) as { text?: string; error?: string } | null
    if (!response.ok || !data?.text) {
      throw new Error(data?.error ?? `Servidor respondeu ${response.status}`)
    }
    return { text: data.text, usedRealAI: true }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao chamar a IA.'
    return { text: fallbackReply(history), usedRealAI: false, errorMessage }
  }
}

const COMMON_FIXES: { pattern: RegExp; fix: string }[] = [
  { pattern: /\bi have \d+ years\b/i, fix: 'Tip: say "I am 25 years old", not "I have 25 years".' },
  { pattern: /\bi no \w+/i, fix: 'Tip: use "I don\'t" instead of "I no" — e.g. "I don\'t like coffee".' },
  { pattern: /\bi am agree\b/i, fix: 'Tip: just say "I agree", not "I am agree".' },
  { pattern: /\bmake a party\b/i, fix: 'Tip: we usually say "have a party", not "make a party".' },
  { pattern: /\bi am like\b/i, fix: 'Tip: say "I like...", not "I am like...".' },
]

const FOLLOW_UPS = [
  "That's interesting! Can you tell me more about that?",
  'Nice! What do you usually do on weekends?',
  'Cool! What is your favorite food?',
  'I see! How was your day today?',
  'Great! Do you like traveling? Where would you like to go?',
  'Awesome! What are you learning English for — work, travel, or fun?',
]

function pickFollowUp(seed: number) {
  return FOLLOW_UPS[seed % FOLLOW_UPS.length]
}

export function fallbackReply(history: ChatMessage[], _level?: Level): string {
  const lastUser = [...history].reverse().find((m) => m.role === 'user')
  const text = (lastUser?.text ?? '').trim()
  const lower = text.toLowerCase()
  const seed = history.length

  if (!text) {
    return "Hi! I'm Amy, your English practice partner. How are you today?"
  }

  const correction = COMMON_FIXES.find((c) => c.pattern.test(lower))
  const prefix = correction ? `${correction.fix} ` : ''

  if (/\b(hi|hello|hey)\b/.test(lower)) {
    return `${prefix}Hello! It's nice to talk with you. ${pickFollowUp(seed)}`
  }
  if (/how are you/.test(lower)) {
    return `${prefix}I'm doing great, thanks for asking! And you — what have you been up to today?`
  }
  if (/\b(bye|goodbye|see you)\b/.test(lower)) {
    return `${prefix}Goodbye! Great job practicing today. See you next time!`
  }
  if (/\b(thank|thanks)\b/.test(lower)) {
    return `${prefix}You're welcome! ${pickFollowUp(seed)}`
  }

  return `${prefix}Got it — thanks for sharing! ${pickFollowUp(seed)}`
}
