import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, Settings } from '../types'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import { getAIReply } from '../lib/ai'
import { friendlySpeechError } from '../lib/speechErrors'
import { MicButton } from '../components/MicButton'

interface ChatPageProps {
  settings: Settings
  onSettingsChange: (next: Settings) => void
  onTurn: () => void
}

export function ChatPage({ settings, onSettingsChange, onTurn }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [aiOnline, setAiOnline] = useState<boolean | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { speak, stop: stopSpeaking, speaking, supported: ttsSupported, unlock: unlockSpeech } = useSpeechSynthesis()
  const voiceLang = settings.chatVoiceLang

  const { status, start, stop, supported, error: micError } = useSpeechRecognition({
    lang: voiceLang,
    onResult: (text, isFinal) => {
      if (isFinal && text) {
        setDraft(text)
        void handleSend(text)
      }
    },
  })
  const listening = status === 'listening'
  const micErrorMessage = friendlySpeechError(micError)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  async function handleSend(textOverride?: string) {
    const text = (textOverride ?? draft).trim()
    if (!text || thinking) return
    unlockSpeech()
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text, createdAt: Date.now() }
    const nextHistory = [...messages, userMessage]
    setMessages(nextHistory)
    setDraft('')
    setThinking(true)
    onTurn()

    const { text: reply, usedRealAI, errorMessage } = await getAIReply(nextHistory, settings)
    setAiOnline(usedRealAI)
    setNotice(!usedRealAI ? `IA indisponível agora (${errorMessage ?? 'erro'}). Usando modo de prática offline.` : null)
    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: reply, createdAt: Date.now() }
    setMessages((prev) => [...prev, assistantMessage])
    setThinking(false)
    if (settings.autoSpeak) speak(reply, { rate: settings.voiceRate })
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-4 py-6">
      <div className="mb-3">
        <h1 className="text-2xl font-bold">Chat de voz com a IA</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {aiOnline === null
            ? 'Fale ou digite para começar a conversar com a Amy.'
            : aiOnline
              ? 'Conectado à IA. ✨'
              : 'Modo de prática offline (a IA está indisponível agora).'}
        </p>
      </div>

      {notice && (
        <div className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          {notice}
        </div>
      )}

      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        style={{ minHeight: '40vh', maxHeight: '55vh' }}
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              {m.text}
              {m.role === 'assistant' && ttsSupported && (
                <button
                  onClick={() => (speaking ? stopSpeaking() : speak(m.text, { rate: settings.voiceRate }))}
                  className="ml-2 opacity-60 hover:opacity-100"
                  aria-label="Ouvir mensagem"
                >
                  🔊
                </button>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Amy está digitando...
            </div>
          </div>
        )}
      </div>

      {supported && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Microfone entende:</span>
          <div className="flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => onSettingsChange({ ...settings, chatVoiceLang: 'en-US' })}
              disabled={listening}
              className={`px-3 py-1 text-xs font-medium transition ${
                voiceLang === 'en-US' ? 'bg-brand-600 text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              🇺🇸 Inglês
            </button>
            <button
              onClick={() => onSettingsChange({ ...settings, chatVoiceLang: 'pt-BR' })}
              disabled={listening}
              className={`px-3 py-1 text-xs font-medium transition ${
                voiceLang === 'pt-BR' ? 'bg-brand-600 text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              🇧🇷 Português
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3">
        <MicButton
          listening={listening}
          onClick={() => {
            unlockSpeech()
            if (listening) stop()
            else start()
          }}
          disabled={!supported || thinking}
          size="sm"
        />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={supported ? 'Fale ou digite em inglês ou português...' : 'Digite em inglês ou português...'}
          className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          onClick={() => handleSend()}
          disabled={!draft.trim() || thinking}
          className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
      {listening && (
        <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Ouvindo em {voiceLang === 'en-US' ? 'inglês' : 'português'}... fale agora.
        </p>
      )}
      {micErrorMessage && (
        <p className="mt-2 text-center text-xs text-amber-600 dark:text-amber-400">{micErrorMessage}</p>
      )}
      {!supported && (
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          Este navegador não suporta reconhecimento de voz. Use o Chrome/Edge para conversar por voz, ou digite sua mensagem.
        </p>
      )}
    </div>
  )
}
