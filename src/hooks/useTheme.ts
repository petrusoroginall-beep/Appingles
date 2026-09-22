import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Theme } from '../types'

const THEME_COLOR: Record<Theme, string> = {
  dark: '#020617',
  light: '#1c6fed',
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('appingles.theme', 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  return { theme, toggleTheme }
}
