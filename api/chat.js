const MODELS = ['gemini-3.6-flash', 'gemini-flash-latest']
const RETRYABLE_STATUS = new Set([404, 429, 500, 503])

function systemPrompt() {
  return `You are "Amy", a warm English conversation tutor for a Brazilian Portuguese speaker learning English.
Be extremely concise. Answer exactly what was asked and nothing more — no extra explanations, no extra examples, no filler.
Hard limit: at most 2 short sentences total, ever. That includes any follow-up question.
- If the student asks how to say or translate something (e.g. "como se fala X em inglês", "how do you say X", "what does X mean"), reply with ONLY the translation in quotes, optionally a 3-5 word follow-up question. Nothing else. Example: student asks "how do you say eu amo", you reply: "Eu amo" is "I love". — one short question at most.
- If the student's message has a grammar mistake, give the corrected sentence in quotes, nothing else added, then stop (no follow-up question needed on corrections).
- Otherwise, have a short natural back-and-forth: one brief reaction or answer, then at most one short question.
- Use casual native contractions naturally when they fit (wanna, gonna, gotta, kinda, dunno, lemme) — gloss an unfamiliar one in parentheses the first time only.
- Never restate the rules, never explain why you're being short, never add "feel free to ask" style padding.`
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
