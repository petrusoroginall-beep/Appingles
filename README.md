# Appingles

Inglêsparainiciante

App web para aprender inglês praticando **vocabulário** e **pronúncia**.

## Funcionalidades

- **📚 Vocabulário e pronúncia** — categorias de palavras e frases (saudações, inglês informal, frases do dia a dia, palavras essenciais) com tradução, exemplo de uso, áudio (texto-para-fala) e prática de pronúncia pelo microfone com pontuação automática.
- **📈 Progresso** — acompanhe palavras aprendidas e sua sequência de dias de prática.

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

## Deploy na Vercel

Importe o repositório na Vercel (framework Vite é detectado automaticamente via `vercel.json`) e faça o deploy — não é necessária nenhuma variável de ambiente.
