# Speakly

Speakly — Fale inglês de verdade.

App web para aprender inglês de verdade praticando **vocabulário**, **pronúncia**, **diálogos reais** e **gramática**.

## Funcionalidades

- **📚 Vocabulário** — categorias de palavras e frases (saudações, inglês informal, frases do dia a dia, palavras essenciais, phrasal verbs, inglês no trabalho, sentimentos e opiniões, reações rápidas) com tradução, exemplo de uso, áudio (texto-para-fala) e prática de pronúncia pelo microfone com pontuação automática.
- **🗣️ Diálogos** — conversas reais do dia a dia (restaurante, trabalho, festa, parque, aeroporto, compras, Uber, mensagens de texto) com tradução, pronúncia guiada e áudio linha por linha ou do diálogo completo.
- **📖 Gramática** — tópicos que focam nos erros mais comuns de quem fala português aprendendo inglês, com explicação, exemplos e o clássico "errou aqui, é assim que se diz".
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
