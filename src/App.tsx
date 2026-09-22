import type { Tab } from './types'
import { TabBar } from './components/TabBar'
import { VocabularyPage } from './pages/VocabularyPage'
import { DialoguesPage } from './pages/DialoguesPage'
import { GrammarPage } from './pages/GrammarPage'
import { ProgressPage } from './pages/ProgressPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useProgress } from './hooks/useProgress'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const [tab, setTab] = useLocalStorage<Tab>('appingles.activeTab', 'vocabulario')
  const { progress, recordScore, restoreProgress } = useProgress()
  const { theme, toggleTheme } = useTheme()

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
