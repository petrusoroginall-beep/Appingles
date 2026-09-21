const MODEL = 'gemini-2.0-flash'

function systemPrompt(level) {
  return `You are "Amy", a warm, patient English conversation tutor for a Brazilian Portuguese speaker learning English at level ${level}.
Rules:
- Always reply in English, using simple vocabulary suited to level ${level}.
- Keep replies short: 1-3 sentences, plus one short follow-up question to keep the conversation going.
- If the student's last message has a grammar or word-choice mistake, gently point it out with the corrected sentence in quotes before continuing the conversation. If there is no mistake, do not invent one.
- Be encouraging and friendly, like a real spoken conversation practice partner.`
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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
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
      res.status(502).json({ error: `Gemini API respondeu ${response.status}: ${body.slice(0, 300)}` })
      return
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim()
    if (!text) {
      res.status(502).json({ error: 'Resposta vazia da IA.' })
      return
    }

    res.status(200).json({ text })
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Erro desconhecido ao chamar a IA.' })
  }
}
