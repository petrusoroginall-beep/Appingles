import { useState } from 'react'
import { grammarTopics } from '../data/grammar'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'

export function GrammarPage() {
  const [topicId, setTopicId] = useState<string | null>(null)
  const { speak, unlock, supported } = useSpeechSynthesis()

  const topic = grammarTopics.find((t) => t.id === topicId) ?? null

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold">Gramática</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Os pontos de gramática em que brasileiros mais se confundem — focados nos erros reais, não em regras genéricas.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {grammarTopics.map((t) => (
            <button
              key={t.id}
              onClick={() => setTopicId(t.id)}
              className="flex flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-3xl">{t.emoji}</span>
              <span className="font-semibold">{t.title}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t.summary}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        onClick={() => setTopicId(null)}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        ← Gramática
      </button>

      <h2 className="text-xl font-bold">
        {topic.emoji} {topic.title}
      </h2>

      <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{topic.explanation}</p>

      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">⚠️ Erro comum de quem fala português</p>
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
          <span aria-hidden="true">❌ </span>
          {topic.mistake.wrong}
        </p>
        <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          <span aria-hidden="true">✅ </span>
          {topic.mistake.right}
        </p>
        <p className="mt-2 text-sm text-red-700/90 dark:text-red-300/90">{topic.mistake.explanation}</p>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Exemplos</h3>
        {topic.examples.map((ex, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{ex.en}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">/{ex.phonetic}/</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{ex.pt}</p>
              </div>
              {supported && (
                <button
                  onClick={() => {
                    unlock()
                    speak(ex.en, { lang: 'en-US' })
                  }}
                  aria-label="Ouvir exemplo"
                  className="shrink-0 opacity-60 hover:opacity-100"
                >
                  🔊
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
