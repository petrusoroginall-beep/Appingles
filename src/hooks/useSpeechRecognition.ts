import { useCallback, useEffect, useRef, useState } from 'react'

export type RecognitionStatus = 'idle' | 'listening' | 'processing' | 'unsupported' | 'error'

interface UseSpeechRecognitionOptions {
  lang?: string
  /** Keep listening across pauses instead of stopping after the first detected pause. */
  continuous?: boolean
  onResult?: (transcript: string, isFinal: boolean) => void
  /** Fires once recognition actually ends (manual stop or timeout), with everything captured. */
  onFinish?: (transcript: string) => void
}

export function useSpeechRecognition({ lang = 'en-US', continuous = false, onResult, onFinish }: UseSpeechRecognitionOptions = {}) {
  const [status, setStatus] = useState<RecognitionStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const finalTextRef = useRef('')
  const onResultRef = useRef(onResult)
  onResultRef.current = onResult
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  const supported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    if (!supported) {
      setStatus('unsupported')
      return
    }
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition!
    const recognition = new Ctor()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setStatus('listening')
    recognition.onresult = (event) => {
      let interimText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const alt = result[0]
        if (!alt) continue
        if (result.isFinal) finalTextRef.current = `${finalTextRef.current} ${alt.transcript}`.trim()
        else interimText += alt.transcript
      }
      const combined = `${finalTextRef.current} ${interimText}`.trim()
      setTranscript(combined)
      onResultRef.current?.(combined, Boolean(finalTextRef.current) && !interimText)
    }
    recognition.onerror = (event) => {
      setError(event.error)
      setStatus('error')
    }
    recognition.onend = () => {
      setStatus((current) => (current === 'listening' ? 'idle' : current))
      const finished = finalTextRef.current.trim()
      finalTextRef.current = ''
      if (finished) onFinishRef.current?.(finished)
    }

    recognitionRef.current = recognition
    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.onstart = null
      recognition.abort()
    }
  }, [lang, continuous, supported])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    setError(null)
    setTranscript('')
    finalTextRef.current = ''
    // Flip the UI to "listening" immediately on tap instead of waiting for the
    // browser's onstart event, which can lag noticeably behind the actual tap.
    setStatus('listening')
    try {
      recognitionRef.current.start()
    } catch {
      // already started — ignore
    }
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  return { status, transcript, error, supported, start, stop }
}
