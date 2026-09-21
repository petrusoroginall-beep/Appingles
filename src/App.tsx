import type { Tab } from './types'
import { TabBar } from './components/TabBar'
import { VocabularyPage } from './pages/VocabularyPage'
import { ChatPage } from './pages/ChatPage'
import { ProgressPage } from './pages/ProgressPage'
import { SettingsPage } from './pages/SettingsPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useProgress } from './hooks/useProgress'
import { useSettings } from './hooks/useSettings'

export default function App() {
  const [tab, setTab] = useLocalStorage<Tab>('appingles.activeTab', 'chat')
  const { progress, recordScore, incrementChatTurns } = useProgress()
  const { settings, setSettings } = useSettings()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="safe-top border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <span className="text-2xl">🗽</span>
          <span className="text-lg font-extrabold tracking-tight">Appingles</span>
          <span className="ml-auto rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            Nível {settings.level}
          </span>
        </div>
      </header>

      <main className="flex-1 pb-4">
        {tab === 'vocabulario' && <VocabularyPage progress={progress} onScored={recordScore} />}
        {tab === 'chat' && <ChatPage settings={settings} onSettingsChange={setSettings} onTurn={incrementChatTurns} />}
        {tab === 'progresso' && <ProgressPage progress={progress} />}
        {tab === 'config' && <SettingsPage settings={settings} onChange={setSettings} />}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
