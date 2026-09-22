import type { ProgressState } from '../types'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function StreakReminder({ progress }: { progress: ProgressState }) {
  const practicedToday = progress.lastActiveDate === todayKey()
  if (practicedToday) return null

  const hasStreak = progress.lastActiveDate !== null && progress.streakDays > 0

  return (
    <div className="mx-auto mt-3 max-w-3xl px-4">
      <div className="flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
        <span aria-hidden="true">🔥</span>
        <span>
          {hasStreak
            ? `Você ainda não praticou hoje! Continue sua sequência de ${progress.streakDays} dia${progress.streakDays === 1 ? '' : 's'}.`
            : 'Que tal praticar um pouquinho de inglês hoje?'}
        </span>
      </div>
    </div>
  )
}
