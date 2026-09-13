import { getPayload } from 'payload'
import config from '../payload.config'
import { fillEnglish, TRANSLATE_SPECS } from '../hooks/autoTranslate'
import { translationEnabled } from '../lib/translate'

/**
 * One-off backfill: translate every empty English field across the catalogue.
 * Safe to re-run — fields that already have English are skipped.
 *
 *   ANTHROPIC_API_KEY=… npm run translate:missing
 */
async function main() {
  if (!translationEnabled()) {
    console.error('ANTHROPIC_API_KEY is not set — nothing to do.')
    process.exit(1)
  }
  const payload = await getPayload({ config })
  let filled = 0

  for (const slug of ['categories', 'services', 'products'] as const) {
    const spec = TRANSLATE_SPECS[slug]
    let page = 1
    for (;;) {
      const res = await payload.find({ collection: slug, locale: 'ar', depth: 0, limit: 50, page })
      for (const doc of res.docs) {
        const done = await fillEnglish(payload, slug, doc as unknown as Record<string, unknown>, spec)
        if (done.length) {
          filled += done.length
          payload.logger.info(`${slug}/${doc.id}: ${done.join(', ')}`)
        }
      }
      if (!res.hasNextPage) break
      page++
    }
  }

  payload.logger.info(`✅ translated ${filled} fields`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
