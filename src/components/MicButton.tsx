interface MicButtonProps {
  listening: boolean
  disabled?: boolean
  onClick: () => void
  size?: 'sm' | 'lg'
}

export function MicButton({ listening, disabled, onClick, size = 'lg' }: MicButtonProps) {
  const dims = size === 'lg' ? 'h-20 w-20' : 'h-12 w-12'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={listening}
      aria-label={listening ? 'Parar de ouvir' : 'Falar'}
      className={`relative flex ${dims} items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-40 ${
        listening
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
          : 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700'
      }`}
    >
      {listening && <span className="absolute inset-0 rounded-full bg-red-400 animate-pulseRing" />}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={size === 'lg' ? 'relative h-8 w-8' : 'relative h-5 w-5'}
      >
        <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
        <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.08A7 7 0 0 0 19 11Z" />
      </svg>
    </button>
  )
}
