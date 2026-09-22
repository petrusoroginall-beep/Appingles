let audioContext: AudioContext | null = null

function getContext() {
  if (!audioContext) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new Ctor()
  }
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number, peakGain: number) {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  gain.connect(ctx.destination)

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startTime)
  osc.connect(gain)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

// iOS Safari only lets an AudioContext produce sound once it has been created or resumed
// synchronously inside a real user-gesture handler (tap). Calling this once inside the mic
// button's onClick — before the async recognition result comes back — unlocks it for the
// playFeedbackSound() call that follows later in the same session.
export function unlockFeedbackSound() {
  if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) return
  getContext()
}

/** Short confirmation chime played right when a pronunciation score/percentage appears. */
export function playFeedbackSound(tone: 'great' | 'good' | 'retry') {
  if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) return
  const ctx = getContext()
  const now = ctx.currentTime

  if (tone === 'great') {
    playTone(ctx, 880, now, 0.15, 0.18)
    playTone(ctx, 1318.5, now + 0.1, 0.25, 0.18)
  } else if (tone === 'good') {
    playTone(ctx, 784, now, 0.2, 0.16)
  } else {
    playTone(ctx, 392, now, 0.18, 0.12)
  }
}
