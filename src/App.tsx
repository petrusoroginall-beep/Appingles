import { useEffect } from 'react'
import type { Tab } from './types'
import { TabBar } from './components/TabBar'
import { VocabularyPage } from './pages/VocabularyPage'
import { DialoguesPage } from './pages/DialoguesPage'
import { GrammarPage } from './pages/GrammarPage'
import { ProgressPage } from './pages/ProgressPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useProgress } from './hooks/useProgress'
import { useTheme } from './hooks/useTheme'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'
import { unlockFeedbackSound } from './lib/feedbackSound'

export default function App() {
  const [tab, setTab] = useLocalStorage<Tab>('appingles.activeTab', 'vocabulario')
  const { progress, recordScore, restoreProgress } = useProgress()
  const { theme, toggleTheme } = useTheme()
  const { unlock } = useSpeechSynthesis()

  // iOS Safari won't play any audio (speech synthesis or feedback tones) until it's been
  // triggered inside a real user tap. Priming on every tap — not just the first one — means
  // it also self-heals if the audio engine gets suspended mid-session (e.g. after the
  // microphone takes over the audio hardware for speech recognition and gives it back), not
  // just on the very first tap of a fresh visit. Both calls are cheap no-ops once already
  // unlocked/running, so doing this on every tap costs nothing.
  useEffect(() => {
    function primeAudio() {
      unlock()
      unlockFeedbackSound()
    }
    document.addEventListener('pointerdown', primeAudio)
    return () => document.removeEventListener('pointerdown', primeAudio)
  }, [unlock])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="safe-top border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <div className="leading-tight">
              <p className="text-lg font-extrabold tracking-tight">Speakly</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Fale inglês de verdade</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-lg transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="flex-1 pb-4">
        {tab === 'vocabulario' && <VocabularyPage progress={progress} onScored={recordScore} />}
        {tab === 'dialogos' && <DialoguesPage />}
        {tab === 'gramatica' && <GrammarPage />}
        {tab === 'progresso' && <ProgressPage progress={progress} onRestore={restoreProgress} />}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
