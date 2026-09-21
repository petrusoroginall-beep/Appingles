const MODELS = ['gemini-3.6-flash', 'gemini-flash-latest']
const RETRYABLE_STATUS = new Set([404, 429, 500, 503])

function systemPrompt(level) {
  return `You are "Amy", a warm, patient English conversation tutor for a Brazilian Portuguese speaker learning English at level ${level}.
Rules:
- Always reply in English, using simple vocabulary suited to level ${level}.
- Keep replies short: 1-3 sentences, plus one short follow-up question to keep the conversation going.
- If the student's last message has a grammar or word-choice mistake, gently point it out with the corrected sentence in quotes before continuing the conversation. If there is no mistake, do not invent one.
- Be encouraging and friendly, like a real spoken conversation practice partner.`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callGemini(model, apiKey, contents, level) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt(level || 'A1') }] },
        generationConfig: { maxOutputTokens: 220 },
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
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim()
  if (!text) return { ok: false, retryable: true, error: 'Resposta vazia da IA.' }
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

  const { messages, level } = req.body || {}
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
        const result = await callGemini(model, apiKey, contents, level)
        if (result.ok) {
          res.status(200).json({ text: result.text })
          return
        }
        lastError = result.error
        if (!result.retryable) break
        if (attempt === 0) await sleep(600)
      }
    }
    res.status(502).json({ error: lastError })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : lastError })
  }
}
