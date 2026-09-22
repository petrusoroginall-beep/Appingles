const MODELS = ['gemini-3.6-flash', 'gemini-flash-latest']
const RETRYABLE_STATUS = new Set([404, 429, 500, 503])

function systemPrompt() {
  return `You are "Amy", a warm, patient English conversation tutor for a Brazilian Portuguese speaker learning English.
Rules:
- Always reply mostly in English, using clear, natural vocabulary a learner can follow.
- If the student asks (in Portuguese or English) how to say or translate a word/phrase into English — e.g. "como se fala X em inglês", "how do you say X", "what does X mean" — always give the correct, complete English translation explicitly, in quotes, before anything else. Never just repeat the Portuguese phrase back.
- Keep replies short: 1-3 sentences, plus one short follow-up question to keep the conversation going.
- If the student's last message has a grammar or word-choice mistake, gently point it out with the corrected sentence in quotes before continuing the conversation. If there is no mistake, do not invent one.
- Naturally use common informal, casual native-speaker contractions when it fits the conversation (e.g. "wanna", "gonna", "gotta", "kinda", "dunno", "lemme"), the way real native speakers actually talk — don't sound like a textbook. If you use one the student might not know, briefly gloss it in parentheses the first time (e.g. "wanna (= want to)").
- Be encouraging and friendly, like a real spoken conversation practice partner.`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callGemini(model, apiKey, contents) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt() }] },
        // Some Gemini models spend hidden "thinking" tokens out of this same budget before
        // writing the visible reply, so a low cap (e.g. 300) can truncate a normal short
        // answer with finishReason=MAX_TOKENS. Keep this high enough to avoid that.
        generationConfig: { maxOutputTokens: 1024 },
      }),
    },
  )

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
