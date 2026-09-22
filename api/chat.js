const MODELS = ['gemini-3.6-flash', 'gemini-flash-latest']
const RETRYABLE_STATUS = new Set([404, 429, 500, 503])

function systemPrompt() {
  return `You are "Amy", an English tutor for a Brazilian Portuguese speaker learning English, chatting by voice.
Top priority: answer ONLY what was asked, then stop. No extra explanation, no extra example, no filler, no "feel free to ask" padding, never restate these rules.
Hard limit: at most 2 short sentences total, ever.
- If the student asks how to say/translate something (e.g. "como se fala X em inglês", "how do you say X", "what does X mean"), reply with JUST the translation in quotes. No follow-up question. Example: student asks "how do you say eu amo", full reply is exactly: "Eu amo" is "I love".
- If the student's message has a grammar mistake, give ONLY the corrected sentence in quotes. No follow-up question.
- Only when the student is making small talk / chatting freely (not asking a direct question) may you add ONE short follow-up question — otherwise never add one.
- Use casual native contractions naturally when they fit (wanna, gonna, gotta, kinda, dunno, lemme) — gloss an unfamiliar one in parentheses the first time only.`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchGemini(model, apiKey, contents, useThinkingBudget) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt() }] },
      generationConfig: {
        // Some Gemini models spend hidden "thinking" tokens out of this same budget before
        // writing the visible reply, so keep this high enough that a normal short answer
        // never gets cut off with finishReason=MAX_TOKENS.
        maxOutputTokens: 1024,
        // thinkingBudget: 0 skips that hidden reasoning pass entirely — replies here are
        // simple translations/short chat, not something that benefits from "thinking", and
        // skipping it is the single biggest lever on response latency.
        ...(useThinkingBudget ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
      },
    }),
  })
}

async function callGemini(model, apiKey, contents) {
  let response = await fetchGemini(model, apiKey, contents, true)
  if (response.status === 400) {
    // This model may not support thinkingConfig at all — retry once without it.
    response = await fetchGemini(model, apiKey, contents, false)
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    return {
      ok: false,
      retryable: RETRYABLE_STATUS.has(response.status),
      error: `Gemini API (${model}) respondeu ${response.status}: ${body.slice(0, 300)}`,
    }
  }

  const data = await response.json()
  const candidate = data.candidates?.[0]
  const text = candidate?.content?.parts?.map((p) => p.text || '').join('').trim()
  const finishReason = candidate?.finishReason

  if (!text) return { ok: false, retryable: true, error: 'Resposta vazia da IA.' }
  // MAX_TOKENS/SAFETY/RECITATION mean the reply was cut short or blocked mid-sentence — treat as
  // a failure so we retry with the next model instead of showing the user a broken fragment.
  if (finishReason && finishReason !== 'STOP') {
    return { ok: false, retryable: true, error: `Gemini (${model}) finishReason=${finishReason}: "${text}"` }
  }
  return { ok: true, text }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY não está configurada no servidor.' })
    return
  }

  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'É necessário enviar um array de mensagens.' })
    return
  }

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.text ?? '') }],
  }))

  let lastError = 'Erro desconhecido ao chamar a IA.'
  try {
    // Try each model, with one short-delay retry per model for transient (503/429) overload errors.
    for (const model of MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = await callGemini(model, apiKey, contents)
        if (result.ok) {
          res.status(200).json({ text: result.text })
          return
        }
        lastError = result.error
        if (!result.retryable) break
        if (attempt === 0) await sleep(350)
      }
    }
    res.status(502).json({ error: lastError })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : lastError })
  }
}
