import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { ProgressState } from '../types'

const defaultProgress: ProgressState = {
  learnedWordIds: [],
  bestScoreByWordId: {},
  streakDays: 1,
  lastActiveDate: null,
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressState>('appingles.progress', defaultProgress)

  const touchStreak = useCallback(() => {
    setProgress((prev) => {
      const today = todayKey()
      if (prev.lastActiveDate === today) return prev
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streakDays = prev.lastActiveDate === yesterday ? prev.streakDays + 1 : 1
      return { ...prev, lastActiveDate: today, streakDays }
    })
  }, [setProgress])

  const recordScore = useCallback(
    (wordId: string, score: number) => {
      touchStreak()
      setProgress((prev) => {
        const best = Math.max(prev.bestScoreByWordId[wordId] ?? 0, score)
        const learned = score >= 70 && !prev.learnedWordIds.includes(wordId)
        return {
          ...prev,
          bestScoreByWordId: { ...prev.bestScoreByWordId, [wordId]: best },
          learnedWordIds: learned ? [...prev.learnedWordIds, wordId] : prev.learnedWordIds,
        }
      })
    },
    [setProgress, touchStreak],
  )

  const markLearned = useCallback(
    (wordId: string) => {
      touchStreak()
      setProgress((prev) =>
        prev.learnedWordIds.includes(wordId) ? prev : { ...prev, learnedWordIds: [...prev.learnedWordIds, wordId] },
      )
    },
    [setProgress, touchStreak],
  )

  const restoreProgress = useCallback(
    (data: ProgressState) => {
      setProgress(data)
    },
    [setProgress],
  )

  return { progress, recordScore, markLearned, restoreProgress }
}
