export function friendlySpeechError(code: string | null): string | null {
  switch (code) {
    case null:
      return null
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Permissão do microfone negada. No iPhone: Ajustes > Safari > Microfone, e permita para este site.'
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
