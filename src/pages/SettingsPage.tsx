import type { Settings } from '../types'

interface SettingsPageProps {
  settings: Settings
  onChange: (next: Settings) => void
}

export function SettingsPage({ settings, onChange }: SettingsPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Personalize sua experiência de aprendizado.</p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Voz</h2>
        <label className="mt-3 flex items-center justify-between text-sm">
          <span>Ler respostas da IA automaticamente</span>
          <input
            type="checkbox"
            checked={settings.autoSpeak}
            onChange={(e) => onChange({ ...settings, autoSpeak: e.target.checked })}
            className="h-5 w-5 accent-brand-600"
          />
        </label>
      </section>
    </div>
  )
}
