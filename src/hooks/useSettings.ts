import { useLocalStorage } from './useLocalStorage'
import type { Settings } from '../types'

const defaultSettings: Settings = {
  level: 'A1',
  voiceRate: 0.95,
  autoSpeak: true,
  chatVoiceLang: 'en-US',
}

export function useSettings() {
  const [stored, setSettings] = useLocalStorage<Settings>('appingles.settings', defaultSettings)
  const settings: Settings = { ...defaultSettings, ...stored }
  return { settings, setSettings }
}
