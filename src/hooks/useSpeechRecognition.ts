import { useCallback, useEffect, useRef, useState } from 'react'

export type RecognitionStatus = 'idle' | 'listening' | 'processing' | 'unsupported' | 'error'

interface UseSpeechRecognitionOptions {
  lang?: string
  /** Keep listening across pauses instead of stopping after the first detected pause. */
  continuous?: boolean
  onResult?: (transcript: string, isFinal: boolean) => void
  /** Fires once recognition actually ends (manual stop), with everything captured. */
  onFinish?: (transcript: string) => void
}

export function useSpeechRecognition({ lang = 'en-US', continuous = false, onResult, onFinish }: UseSpeechRecognitionOptions = {}) {
  const [status, setStatus] = useState<RecognitionStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const finalTextRef = useRef('')
  // Some engines (notably mobile Safari/WebKit) end a recognition session on their own short
  // internal pause-detection regardless of the `continuous` flag. This tracks whether an `onend`
  // was actually requested by us (real stop) vs. the engine ending on its own (in which case we
  // silently restart so the user never feels a cutoff mid-sentence).
  const manualStopRef = useRef(false)
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
      const benign = event.error === 'no-speech' || event.error === 'aborted'
      if (continuous && !manualStopRef.current && benign) {
        // The engine gave up on this stretch of silence on its own — onend follows and will
        // restart us. Not a real error from the user's point of view.
        return
      }
      manualStopRef.current = true
      setError(event.error)
      setStatus('error')
    }
    recognition.onend = () => {
      if (continuous && !manualStopRef.current) {
        // The engine ended this stretch on its own, but the user hasn't tapped stop — resume
        // listening without losing what's been said so far.
        setTimeout(() => {
          try {
            recognitionRef.current?.start()
          } catch {
            // couldn't resume — fall through to finishing with whatever we have
            manualStopRef.current = true
            setStatus('idle')
            const finished = finalTextRef.current.trim()
            finalTextRef.current = ''
            if (finished) onFinishRef.current?.(finished)
          }
        }, 0)
        return
      }
      setStatus((current) => (current === 'listening' ? 'idle' : current))
      const finished = finalTextRef.current.trim()
      finalTextRef.current = ''
      if (finished) onFinishRef.current?.(finished)
    }

    recognitionRef.current = recognition
    return () => {
      manualStopRef.current = true
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.onstart = null
      recognition.abort()
    }
  }, [lang, continuous, supported])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    manualStopRef.current = false
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
    manualStopRef.current = true
    recognitionRef.current?.stop()
  }, [])

  return { status, transcript, error, supported, start, stop }
}
