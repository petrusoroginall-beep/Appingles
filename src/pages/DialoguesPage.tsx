import { useRef, useState } from 'react'
import { dialogues } from '../data/dialogues'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import type { DialogueLine } from '../types'

export function DialoguesPage() {
  const [sceneId, setSceneId] = useState<string | null>(null)
  const { speak, stop, speaking, unlock, supported } = useSpeechSynthesis()
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const sessionRef = useRef(0)

  const scene = dialogues.find((s) => s.id === sceneId) ?? null

  function playLine(index: number, lines: DialogueLine[]) {
    const session = sessionRef.current
    setPlayingIndex(index)
    speak(lines[index].en, {
      lang: 'en-US',
      onEnd: () => {
        if (sessionRef.current !== session) return
        if (index + 1 < lines.length) {
          setTimeout(() => {
            if (sessionRef.current !== session) return
            playLine(index + 1, lines)
          }, 400)
        } else {
          setPlayingIndex(null)
        }
      },
    })
  }

  function playAll() {
    if (!scene) return
    unlock()
    sessionRef.current += 1
    playLine(0, scene.lines)
  }

  function stopAll() {
    sessionRef.current += 1
    stop()
    setPlayingIndex(null)
  }

  function openScene(id: string) {
    stopAll()
    setSceneId(id)
  }

  function closeScene() {
    stopAll()
    setSceneId(null)
  }

  if (!scene) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold">Diálogos reais</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Conversas completas do jeito que os americanos realmente falam, em situações do dia a dia.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {dialogues.map((d) => (
            <button
              key={d.id}
              onClick={() => openScene(d.id)}
              className="flex flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-3xl">{d.emoji}</span>
              <span className="font-semibold">{d.title}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{d.description}</span>
              <span className="mt-2 text-xs font-medium text-brand-600 dark:text-brand-400">{d.lines.length} falas</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        onClick={closeScene}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        ← Diálogos
      </button>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">
          {scene.emoji} {scene.title}
        </h2>
        {supported && (
          <button
            onClick={playingIndex !== null ? stopAll : playAll}
            className="flex items-center gap-1 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            {playingIndex !== null ? '⏹ Parar' : '▶️ Ouvir diálogo completo'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {scene.lines.map((line, index) => {
          const isYou = line.speaker === 'Você'
          const isPlaying = playingIndex === index
          return (
            <div key={index} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition ${
                  isYou
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                } ${isPlaying ? 'ring-2 ring-accent-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-semibold ${isYou ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                    {line.speaker}
                  </span>
                  {supported && (
                    <button
                      onClick={() => {
                        unlock()
                        sessionRef.current += 1
                        setPlayingIndex(null)
                        speak(line.en, { lang: 'en-US' })
                      }}
                      aria-label="Ouvir essa fala"
                      className={`text-sm ${isYou ? 'opacity-80 hover:opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    >
                      🔊
                    </button>
                  )}
                </div>
                <p className="mt-1 font-medium leading-relaxed">{line.en}</p>
                <p className={`mt-0.5 text-xs ${isYou ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>/{line.phonetic}/</p>
                <p className={`mt-1 text-sm ${isYou ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>{line.pt}</p>
              </div>
            </div>
          )
        })}
      </div>

      {speaking && playingIndex === null && (
        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">🔊 Ouvindo...</p>
      )}
    </div>
  )
}
