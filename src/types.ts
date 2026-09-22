export interface VocabWord {
  id: string
  en: string
  pt: string
  phonetic: string
  exampleEn: string
  examplePt: string
}

export interface VocabCategory {
  id: string
  title: string
  emoji: string
  description: string
  words: VocabWord[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: number
  corrected?: string
}

export type Tab = 'vocabulario' | 'chat' | 'progresso' | 'config'

export interface ProgressState {
  learnedWordIds: string[]
  bestScoreByWordId: Record<string, number>
  chatTurns: number
  streakDays: number
  lastActiveDate: string | null
}

export type ChatVoiceLang = 'en-US' | 'pt-BR'

export interface Settings {
  voiceRate: number
  autoSpeak: boolean
  chatVoiceLang: ChatVoiceLang
}
