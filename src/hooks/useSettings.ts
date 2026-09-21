import { useLocalStorage } from './useLocalStorage'
import type { Settings } from '../types'

const defaultSettings: Settings = {
  level: 'A1',
  voiceRate: 0.95,
  autoSpeak: true,
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('appingles.settings', defaultSettings)
  return { settings, setSettings }
}
