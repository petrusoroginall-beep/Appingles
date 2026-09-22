import { useEffect, useState } from 'react'
import type { VocabWord } from '../types'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { playFeedbackSound } from '../lib/feedbackSound'

interface ListeningQuizProps {
  words: VocabWord[]
  onExit: () => void
}

const QUESTION_COUNT = 10

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestions(words: VocabWord[]) {
  const size = Math.min(QUESTION_COUNT, words.length)
  const chosen = shuffle(words).slice(0, size)
  return chosen.map((word) => {
    const distractors = shuffle(words.filter((w) => w.id !== word.id)).slice(0, Math.min(3, words.length - 1))
    return { word, options: shuffle([word, ...distractors]) }
  })
}

export function ListeningQuiz({ words, onExit }: ListeningQuizProps) {
  const { speak, unlock } = useSpeechSynthesis()
  const [questions] = useState(() => buildQuestions(words))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)

  const current = questions[index]

  useEffect(() => {
    if (finished || !current) return
    const timer = setTimeout(() => speak(current.word.en, { lang: 'en-US' }), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, finished])

  if (questions.length === 0 || !current) return null

  function handleAnswer(optionId: string) {
    if (selectedId) return
    unlock()
    setSelectedId(optionId)
    const correct = optionId === current.word.id
    if (correct) setScore((s) => s + 1)
    playFeedbackSound(correct ? 'great' : 'retry')
    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1)
        setSelectedId(null)
      } else {
        setFinished(true)
      }
    }, 1100)
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-4xl">🎧</p>
        <h3 className="mt-2 text-xl font-bold">
          Você acertou {score} de {questions.length}!
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {score === questions.length ? 'Perfeito! 🎉' : score >= questions.length * 0.6 ? 'Muito bem!' : 'Continue praticando!'}
        </p>
        <button
          onClick={onExit}
          className="mt-4 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white"
        >
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <button onClick={onExit} className="font-medium hover:text-brand-600 dark:hover:text-brand-400">
          ← Sair
        </button>
        <span>
          {index + 1}/{questions.length}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => {
            unlock()
            speak(current.word.en, { lang: 'en-US' })
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-lg shadow-brand-600/30"
          aria-label="Ouvir de novo"
        >
          🔊
        </button>
        <p className="text-sm text-slate-500 dark:text-slate-400">Toque para ouvir de novo. O que você ouviu?</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2">
        {current.options.map((option) => {
          const isSelected = selectedId === option.id
          const isCorrectOption = option.id === current.word.id
          const revealed = selectedId !== null
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleAnswer(option.id)}
              disabled={revealed}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                revealed && isCorrectOption
                  ? 'border-emerald-400 bg-emerald-100 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : revealed && isSelected
                    ? 'border-red-400 bg-red-100 text-red-700 dark:border-red-600 dark:bg-red-900/40 dark:text-red-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
              }`}
            >
              {option.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
