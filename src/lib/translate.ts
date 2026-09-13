import Anthropic from '@anthropic-ai/sdk'

/**
 * Arabic → English translation for CMS copy.
 *
 * Runs only when ANTHROPIC_API_KEY is set; without it the site behaves as
 * before (English pages fall back to Arabic for untranslated fields). Uses
 * Haiku: the strings are short product/category copy, and it is the cheapest
 * model that handles Egyptian technical Arabic reliably.
 */
export const TRANSLATION_MODEL = 'claude-haiku-4-5-20251001'

export const translationEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY)

/** Strings to translate, keyed by a path the caller understands. */
export type TextMap = Record<string, string>

const SYSTEM = `You translate Arabic e-commerce copy for an Egyptian supplier of fire fighting, fire alarm, security and industrial-safety equipment into concise, natural B2B English.
Rules:
- Keep product names, standards (EN3, NFPA, UL), model numbers, units and figures exactly as written.
- Convert Arabic-Indic digits to Western digits.
- Use industry terms: "fire extinguisher", "hose reel", "landing valve", "addressable panel", "call point", "coverall", "safety boots".
- Do not add or drop information. No quotes around values. No trailing full stop on short labels.
Respond with ONLY a JSON object mapping each input key to its English translation.`

export async function translateArToEn(input: TextMap): Promise<TextMap | null> {
  const entries = Object.entries(input).filter(([, v]) => typeof v === 'string' && v.trim())
  if (!entries.length) return {}
  if (!translationEnabled()) return null

  const client = new Anthropic()
  const res = await client.messages.create({
    model: TRANSLATION_MODEL,
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: 'user', content: JSON.stringify(Object.fromEntries(entries)) }],
  })

  const text = res.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('')
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
  const parsed = JSON.parse(json) as Record<string, unknown>

  const out: TextMap = {}
  for (const [k] of entries) {
    const v = parsed[k]
    if (typeof v === 'string' && v.trim()) out[k] = v.trim()
  }
  return out
}
