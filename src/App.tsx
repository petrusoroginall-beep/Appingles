import type { Tab } from './types'
import { TabBar } from './components/TabBar'
import { VocabularyPage } from './pages/VocabularyPage'
import { ProgressPage } from './pages/ProgressPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useProgress } from './hooks/useProgress'

export default function App() {
  const [tab, setTab] = useLocalStorage<Tab>('appingles.activeTab', 'vocabulario')
  const { progress, recordScore } = useProgress()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="safe-top border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <span className="text-2xl">🗽</span>
          <span className="text-lg font-extrabold tracking-tight">Appingles</span>
        </div>
      </header>

      <main className="flex-1 pb-4">
        {tab === 'vocabulario' && <VocabularyPage progress={progress} onScored={recordScore} />}
        {tab === 'progresso' && <ProgressPage progress={progress} />}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
