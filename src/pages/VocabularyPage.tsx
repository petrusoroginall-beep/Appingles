import { useMemo, useState } from 'react'
import { vocabulary } from '../data/vocabulary'
import { PronunciationCard } from '../components/PronunciationCard'
import type { ProgressState } from '../types'

interface VocabularyPageProps {
  progress: ProgressState
  onScored: (wordId: string, score: number) => void
}

export function VocabularyPage({ progress, onScored }: VocabularyPageProps) {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [wordIndex, setWordIndex] = useState(0)

  const category = useMemo(() => vocabulary.find((c) => c.id === categoryId) ?? null, [categoryId])

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold">Vocabulário e pronúncia</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Escolha uma categoria, ouça a pronúncia correta e pratique falando no microfone.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {vocabulary.map((cat) => {
            const learnedCount = cat.words.filter((w) => progress.learnedWordIds.includes(w.id)).length
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryId(cat.id)
                  setWordIndex(0)
                }}
                className="flex flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="font-semibold">{cat.title}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</span>
                <span className="mt-2 text-xs font-medium text-brand-600 dark:text-brand-400">
                  {learnedCount}/{cat.words.length} aprendidas
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const word = category.words[wordIndex]
  const isLast = wordIndex === category.words.length - 1
  const isFirst = wordIndex === 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        onClick={() => setCategoryId(null)}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        ← Categorias
      </button>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {category.emoji} {category.title}
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {wordIndex + 1}/{category.words.length}
        </span>
      </div>

      <PronunciationCard
        key={word.id}
        word={word}
        bestScore={progress.bestScoreByWordId[word.id]}
        onScored={(score) => onScored(word.id, score)}
      />

      <div className="mt-4 flex justify-between gap-3">
        <button
          onClick={() => setWordIndex((i) => Math.max(0, i - 1))}
          disabled={isFirst}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-40 dark:border-slate-700"
        >
          ← Anterior
        </button>
        <button
          onClick={() => setWordIndex((i) => Math.min(category.words.length - 1, i + 1))}
          disabled={isLast}
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Próxima →
        </button>
      </div>
    </div>
  )
}
