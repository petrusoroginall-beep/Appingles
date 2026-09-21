import type { Tab } from '../types'

interface TabBarProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'vocabulario', label: 'Vocabulário', icon: '📚' },
  { id: 'chat', label: 'Chat IA', icon: '🎙️' },
  { id: 'progresso', label: 'Progresso', icon: '📈' },
  { id: 'config', label: 'Ajustes', icon: '⚙️' },
]

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="safe-bottom sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-3xl justify-between px-4 py-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-xs font-medium transition ${
              active === tab.id ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
