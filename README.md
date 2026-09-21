# Appingles

Inglêsparainiciante

App web para aprender inglês praticando **vocabulário**, **pronúncia** e **conversação por voz com IA**.

## Funcionalidades

- **📚 Vocabulário e pronúncia** — categorias de palavras e frases (saudações, comida, viagem, trabalho, rotina, emoções) com tradução, exemplo de uso, áudio (texto-para-fala) e prática de pronúncia pelo microfone com pontuação automática.
- **🎙️ Chat de voz com IA** — converse em inglês por voz ou texto com "Amy", uma tutora de IA. As respostas são lidas em voz alta. Funciona em modo de prática offline por padrão; ao configurar sua própria chave da API da Anthropic em Ajustes, o chat passa a usar IA real (Claude) para respostas e correções personalizadas.
- **📈 Progresso** — acompanhe palavras aprendidas, sequência de dias de prática e conversas realizadas.
- **⚙️ Ajustes** — escolha seu nível (A1–B2), configure a chave de API opcional e ajuste a velocidade da voz.

Reconhecimento e síntese de voz usam a Web Speech API do navegador (funciona melhor no Chrome/Edge).

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```
