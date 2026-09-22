function detectPlatform(): 'ios' | 'android' | 'mac-safari' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  if (/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|CriOS/.test(ua)) return 'mac-safari'
  return 'desktop'
}

/** Step-by-step instructions to re-enable a microphone permission the user (or the browser) already blocked — the one case a website can never fix with code, since no page can re-open a permission prompt once it's been denied. */
export function micPermissionInstructions(): string {
  switch (detectPlatform()) {
    case 'ios':
      return 'Vá em Ajustes > Safari > Microfone e escolha "Permitir". Se estiver usando o Chrome no iPhone, vá em Ajustes > Chrome > Microfone.'
    case 'android':
      return 'Toque no ícone de cadeado ou "ⓘ" ao lado do endereço do site, abra "Permissões" e ative o microfone.'
    case 'mac-safari':
      return 'Vá em Safari > Configurações > Sites > Microfone e escolha "Permitir" para este site.'
    default:
      return 'Clique no ícone de cadeado ao lado do endereço do site, abra "Configurações do site" e ative o microfone.'
  }
}

export function friendlySpeechError(code: string | null): string | null {
  switch (code) {
    case null:
      return null
    case 'not-allowed':
    case 'service-not-allowed':
      return `Permissão do microfone negada. ${micPermissionInstructions()}`
    case 'no-speech':
      return 'Não detectei nenhuma fala. Aproxime-se do microfone e tente novamente.'
    case 'audio-capture':
      return 'Nenhum microfone encontrado neste dispositivo.'
    case 'network':
      return 'Falha de rede no reconhecimento de voz. Verifique sua conexão.'
    case 'aborted':
      return null
    default:
      return `Erro no microfone (${code}). Tente novamente ou digite sua mensagem.`
  }
}
