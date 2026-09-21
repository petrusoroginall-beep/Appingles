import type { Level, Settings } from '../types'

interface SettingsPageProps {
  settings: Settings
  onChange: (next: Settings) => void
}

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2']

export function SettingsPage({ settings, onChange }: SettingsPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Personalize sua experiência de aprendizado.</p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Seu nível de inglês</h2>
        <div className="mt-3 flex gap-2">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => onChange({ ...settings, level })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                settings.level === level
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Chat com IA (opcional)</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Sem uma chave de API, o chat funciona em modo de prática offline com respostas automáticas. Para conversar
          com uma IA real (Claude), cole sua própria chave da API da Anthropic abaixo. A chave fica salva apenas no
          seu navegador (localStorage) e é usada apenas para chamar a API diretamente do seu dispositivo — nunca é
          enviada a nenhum outro servidor.
        </p>
        <input
          type="password"
          value={settings.apiKey}
          onChange={(e) => onChange({ ...settings, apiKey: e.target.value })}
          placeholder="sk-ant-..."
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800"
        />
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
        <label className="mt-4 block text-sm">
          Velocidade da voz: {settings.voiceRate.toFixed(2)}x
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={settings.voiceRate}
            onChange={(e) => onChange({ ...settings, voiceRate: Number(e.target.value) })}
            className="mt-2 w-full accent-brand-600"
          />
        </label>
      </section>
    </div>
  )
}
