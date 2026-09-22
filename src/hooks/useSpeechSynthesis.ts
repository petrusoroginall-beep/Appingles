import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const unlockedRef = useRef(false)

  useEffect(() => {
    if (!supported) return
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [supported])

  const speak = useCallback(
    (text: string, opts: { rate?: number; lang?: string } = {}) => {
      if (!supported || !text) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = opts.lang ?? 'en-US'
      utterance.rate = opts.rate ?? 0.95
      const englishVoice = voices.find((v) => v.lang.startsWith('en'))
      if (englishVoice) utterance.voice = englishVoice
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [supported, voices],
  )

  const stop = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  // iOS Safari only allows speechSynthesis.speak() to actually produce sound when it is called
  // synchronously inside a real user-gesture handler (tap/click). A speak() call issued later,
  // after an `await` (e.g. once an API response comes back), is silently ignored. Calling this
  // once, synchronously, inside a button's onClick — before any async work — "unlocks" audio for
  // the rest of the page, so later programmatic speak() calls (including after awaits) work too.
  const unlock = useCallback(() => {
    if (!supported || unlockedRef.current) return
    unlockedRef.current = true
    const utterance = new SpeechSynthesisUtterance(' ')
    utterance.volume = 0
    window.speechSynthesis.speak(utterance)
  }, [supported])

  return { speak, stop, speaking, supported, unlock }
}
