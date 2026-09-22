import { vocabulary, allWords } from '../data/vocabulary'
import type { ProgressState } from '../types'

interface ProgressPageProps {
  progress: ProgressState
}

export function ProgressPage({ progress }: ProgressPageProps) {
  const totalWords = allWords.length
  const learned = progress.learnedWordIds.length
  const pct = totalWords === 0 ? 0 : Math.round((learned / totalWords) * 100)

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
