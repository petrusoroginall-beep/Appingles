# Appingles

Inglêsparainiciante

App web para aprender inglês praticando **vocabulário**, **pronúncia** e **conversação por voz com IA**.

## Funcionalidades

- **📚 Vocabulário e pronúncia** — categorias de palavras e frases (saudações, comida, viagem, trabalho, rotina, emoções) com tradução, exemplo de uso, áudio (texto-para-fala) e prática de pronúncia pelo microfone com pontuação automática.
- **🎙️ Chat de voz com IA** — converse em inglês por voz ou texto com "Amy", uma tutora de IA. As respostas são lidas em voz alta. O chat chama uma função serverless (`/api/chat`) que usa a API gratuita do Google Gemini com uma chave configurada no servidor — quem usa o app não precisa de nenhuma chave própria. Se a IA estiver indisponível, o chat cai automaticamente em um modo de prática offline com respostas roteirizadas.
- **📈 Progresso** — acompanhe palavras aprendidas, sequência de dias de prática e conversas realizadas.
- **⚙️ Ajustes** — escolha seu nível (A1–B2) e ajuste a velocidade da voz.

Reconhecimento e síntese de voz usam a Web Speech API do navegador (funciona melhor no Chrome/Edge).

## Rodando localmente

```bash
npm install
npm run dev
```

Sem a variável `GEMINI_API_KEY` configurada (o que só acontece rodando via `vercel dev` ou em produção na Vercel), o chat funciona no modo de prática offline.

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy na Vercel

1. Importe o repositório na Vercel (framework Vite é detectado automaticamente via `vercel.json`).
2. Crie uma chave gratuita em https://aistudio.google.com/apikey (Google AI Studio — não exige cartão de crédito).
3. Em **Project Settings → Environment Variables** na Vercel, adicione:
   - `GEMINI_API_KEY` = a chave copiada no passo anterior.
4. Faça o deploy (ou redeploy, se a variável foi adicionada depois). O chat passa a responder com IA real para todos os usuários, sem exigir nenhuma configuração deles.
