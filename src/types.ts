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

export interface DialogueLine {
  speaker: string
  en: string
  pt: string
  phonetic: string
}

export interface DialogueScene {
  id: string
  title: string
  emoji: string
  description: string
  lines: DialogueLine[]
}

export type Tab = 'vocabulario' | 'dialogos' | 'progresso'

export type Theme = 'dark' | 'light'

export interface ProgressState {
  learnedWordIds: string[]
  bestScoreByWordId: Record<string, number>
  streakDays: number
  lastActiveDate: string | null
}
