import { useEffect, useState } from 'react'
import type { VocabWord } from '../types'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { feedbackForScore, scorePronunciation } from '../lib/pronunciation'
import { playFeedbackSound, unlockFeedbackSound } from '../lib/feedbackSound'
import { friendlySpeechError } from '../lib/speechErrors'
import { MicButton } from './MicButton'

interface PronunciationCardProps {
  word: VocabWord
  bestScore?: number
  onScored: (score: number) => void
}

export function PronunciationCard({ word, bestScore, onScored }: PronunciationCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [result, setResult] = useState<{ score: number; heard: string } | null>(null)
  const { speak, speaking } = useSpeechSynthesis()
  const { status, transcript, start, stop, supported, error } = useSpeechRecognition({
    lang: 'en-US',
    onResult: (text, isFinal) => {
      if (isFinal && text) {
        const score = scorePronunciation(word.en, text)
        setResult({ score, heard: text })
        onScored(score)
        playFeedbackSound(feedbackForScore(score).tone)
      }
    },
  })

  useEffect(() => {
    setFlipped(false)
    setResult(null)
  }, [word.id])

  const listening = status === 'listening'
  const feedback = result ? feedbackForScore(result.score) : null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold">{word.en}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">/{word.phonetic}/</p>
        </div>
        {typeof bestScore === 'number' && bestScore > 0 && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            Melhor: {bestScore}%
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-3 text-sm font-medium text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
      >
        {flipped ? 'Ocultar tradução' : 'Ver tradução'}
      </button>
      {flipped && (
        <div className="mt-2 animate-flipIn rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
          <p className="font-semibold">{word.pt}</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">"{word.exampleEn}"</p>
          <p className="text-slate-500 dark:text-slate-400">{word.examplePt}</p>
        </div>
      )}

      <div className="mt-5 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => speak(word.en, { lang: 'en-US' })}
            disabled={speaking}
            className="flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            🔊 Ouvir
          </button>
          {supported ? (
            <MicButton
              listening={listening}
              onClick={() => {
                unlockFeedbackSound()
                if (listening) stop()
                else start()
              }}
              size="sm"
            />
          ) : null}
        </div>

        {!supported && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Reconhecimento de voz não é suportado neste navegador. Use o Chrome para praticar a pronúncia por voz.
          </p>
        )}
        {friendlySpeechError(error) && <p className="text-xs text-red-500">{friendlySpeechError(error)}</p>}
        {listening && <p className="text-xs text-slate-500 dark:text-slate-400">Ouvindo... diga: "{word.en}"</p>}
        {!listening && transcript && !result && <p className="text-xs text-slate-400">Você disse: {transcript}</p>}

        {result && feedback && (
          <div
            className={`w-full rounded-xl p-3 text-center text-sm font-medium ${
              feedback.tone === 'great'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : feedback.tone === 'good'
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
            }`}
          >
            <p>{feedback.label}</p>
            <p className="mt-1 text-xs opacity-80">
              Você disse "{result.heard}" — pontuação: {result.score}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
