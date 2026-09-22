import type { ChatMessage } from '../types'

export interface AIReplyResult {
  text: string
  usedRealAI: boolean
  errorMessage?: string
}

// Keep only the most recent turns: a shorter payload means less for the model to read before
// it can start replying, which keeps response time roughly constant instead of growing as the
// conversation gets longer.
const MAX_HISTORY_MESSAGES = 12

async function callChatEndpoint(history: ChatMessage[]): Promise<string> {
  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES)
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: recentHistory.map((m) => ({ role: m.role, text: m.text })),
    }),
  })

  const data = (await response.json().catch(() => null)) as { text?: string; error?: string } | null
  if (!response.ok || !data?.text) {
    throw new Error(data?.error ?? `Servidor respondeu ${response.status}`)
  }
  return data.text
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getAIReply(history: ChatMessage[]): Promise<AIReplyResult> {
  let lastError: unknown
  // A "Load failed" / network-level error can be a one-off blip on mobile connections,
  // so retry once before giving up and falling back to the offline tutor.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callChatEndpoint(history)
      return { text, usedRealAI: true }
    } catch (err) {
      lastError = err
      if (attempt === 0) await sleep(300)
    }
  }
  const errorMessage = lastError instanceof Error ? lastError.message : 'Erro desconhecido ao chamar a IA.'
  return { text: fallbackReply(history), usedRealAI: false, errorMessage }
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

export function fallbackReply(history: ChatMessage[]): string {
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
