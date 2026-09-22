import { useState } from 'react'
import { vocabulary, allWords } from '../data/vocabulary'
import type { ProgressState } from '../types'

interface ProgressPageProps {
  progress: ProgressState
  onRestore: (data: ProgressState) => void
}

function isProgressState(data: unknown): data is ProgressState {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return (
    Array.isArray(d.learnedWordIds) &&
    typeof d.bestScoreByWordId === 'object' &&
    d.bestScoreByWordId !== null &&
    typeof d.streakDays === 'number' &&
    (typeof d.lastActiveDate === 'string' || d.lastActiveDate === null)
  )
}

export function ProgressPage({ progress, onRestore }: ProgressPageProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const totalWords = allWords.length
  const learned = progress.learnedWordIds.length
  const pct = totalWords === 0 ? 0 : Math.round((learned / totalWords) * 100)

  function handleExport() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appingles-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      input.value = ''
      try {
        const data = JSON.parse(String(reader.result))
        if (!isProgressState(data)) {
          setMessage({ type: 'error', text: 'Esse arquivo não é um backup válido do Appingles.' })
          return
        }
        const confirmed = window.confirm('Isso vai substituir seu progresso atual por este backup. Continuar?')
        if (!confirmed) return
        onRestore(data)
        setMessage({ type: 'success', text: 'Progresso importado com sucesso!' })
      } catch {
        setMessage({ type: 'error', text: 'Não foi possível ler esse arquivo.' })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">Seu progresso</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Continue praticando todos os dias para melhorar sua fluência.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatTile label="Palavras aprendidas" value={`${learned}/${totalWords}`} />
        <StatTile label="Sequência de dias" value={`🔥 ${progress.streakDays}`} />
      </div>

      <div className="mt-6">
        <div className="mb-1 flex justify-between text-sm font-medium">
          <span>Progresso geral</span>
          <span>{pct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {vocabulary.map((cat) => {
          const learnedInCat = cat.words.filter((w) => progress.learnedWordIds.includes(w.id)).length
          const catPct = Math.round((learnedInCat / cat.words.length) * 100)
          return (
            <div key={cat.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {cat.emoji} {cat.title}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {learnedInCat}/{cat.words.length}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-accent-500" style={{ width: `${catPct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Backup do progresso</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Seu progresso fica salvo só neste aparelho. Exporte um backup para não perder tudo se trocar de celular ou limpar o
          navegador.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            ⬇️ Exportar backup
          </button>
          <label className="cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-700">
            ⬆️ Importar backup
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
        </div>
        {message && (
          <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}
      </section>
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}
