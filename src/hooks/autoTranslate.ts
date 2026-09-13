import type { CollectionAfterChangeHook, CollectionSlug, Payload, PayloadRequest } from 'payload'
import { translateArToEn, translationEnabled, type TextMap } from '@/lib/translate'

/**
 * After a document is saved in Arabic, fill any EMPTY English fields with a
 * machine translation. Fields the editor has already written in English are
 * never touched, so a human translation always wins — and editors can still
 * correct the machine's draft from the locale switcher in the admin.
 *
 * Plain text and textarea fields, plus text fields inside array rows, are
 * covered. Rich text (Lexical JSON) is intentionally skipped: translating it
 * safely means walking the node tree, and there is no rich text on the
 * public site yet.
 *
 * `spec.arrays` lists array fields and the text sub-fields inside each row.
 */
export type TranslateSpec = {
  fields: string[]
  arrays?: Record<string, string[]>
}

/** Which localized text each collection carries. Shared with the backfill script. */
export const TRANSLATE_SPECS: Record<'categories' | 'products' | 'services', TranslateSpec> = {
  categories: { fields: ['title', 'description'] },
  products: {
    fields: ['title', 'shortDescription', 'metaTitle', 'metaDescription'],
    arrays: { specs: ['key', 'value'] },
  },
  services: { fields: ['title', 'summary'], arrays: { tiers: ['name', 'summary'] } },
}

const CONTEXT_FLAG = 'autoTranslate'

const isFilled = (v: unknown) => typeof v === 'string' && v.trim().length > 0

export const autoTranslate =
  (spec: TranslateSpec): CollectionAfterChangeHook =>
  async ({ doc, req, collection, context }) => {
    if (!translationEnabled()) return doc
    if (context?.[CONTEXT_FLAG]) return doc // our own write — do not loop
    if (req.locale && req.locale !== 'ar') return doc // only Arabic saves seed English

    try {
      const done = await fillEnglish(req.payload, collection.slug, doc, spec, req)
      if (done.length) {
        req.payload.logger.info(`auto-translated ${collection.slug}/${doc.id}: ${done.join(', ')}`)
      }
    } catch (err) {
      // Never fail the editor's save because translation failed.
      req.payload.logger.warn(
        `auto-translate failed for ${collection.slug}/${doc.id}: ${String(err)}`,
      )
    }

    return doc
  }

/**
 * Translate the empty English fields of one Arabic document and write them.
 * Returns the list of field paths that were filled.
 */
export async function fillEnglish(
  payload: Payload,
  collectionSlug: CollectionSlug,
  doc: Record<string, unknown>,
  spec: TranslateSpec,
  req?: PayloadRequest,
): Promise<string[]> {
  {
    {
      // Read the English document WITHOUT fallback, so untranslated fields
      // come back empty rather than echoing the Arabic.
      const en = (await payload.findByID({
        collection: collectionSlug,
        id: doc.id as string | number,
        locale: 'en',
        fallbackLocale: false,
        depth: 0,
        req,
      })) as unknown as Record<string, unknown>

      const pending: TextMap = {}

      for (const f of spec.fields) {
        const ar = doc[f]
        if (isFilled(ar) && !isFilled(en[f])) pending[f] = ar as string
      }

      for (const [arrayName, subFields] of Object.entries(spec.arrays ?? {})) {
        const arRows = (doc[arrayName] ?? []) as Record<string, unknown>[]
        const enRows = (en[arrayName] ?? []) as Record<string, unknown>[]
        arRows.forEach((row, i) => {
          for (const sf of subFields) {
            const ar = row[sf]
            if (isFilled(ar) && !isFilled(enRows[i]?.[sf])) {
              pending[`${arrayName}.${i}.${sf}`] = ar as string
            }
          }
        })
      }

      if (!Object.keys(pending).length) return []

      const translated = await translateArToEn(pending)
      if (!translated || !Object.keys(translated).length) return []

      const data: Record<string, unknown> = {}
      for (const f of spec.fields) if (translated[f]) data[f] = translated[f]

      for (const [arrayName, subFields] of Object.entries(spec.arrays ?? {})) {
        const arRows = (doc[arrayName] ?? []) as Record<string, unknown>[]
        if (!arRows.length) continue
        // Array rows are shared across locales (same ids); only the localized
        // sub-fields differ. Rebuild every row so nothing is dropped.
        const enRows = (en[arrayName] ?? []) as Record<string, unknown>[]
        data[arrayName] = arRows.map((row, i) => {
          const out: Record<string, unknown> = { ...row }
          for (const sf of subFields) {
            const existing = enRows[i]?.[sf]
            out[sf] = isFilled(existing)
              ? existing
              : (translated[`${arrayName}.${i}.${sf}`] ?? row[sf])
          }
          return out
        })
      }

      await payload.update({
        collection: collectionSlug,
        id: doc.id as string | number,
        locale: 'en',
        data,
        depth: 0,
        req,
        context: { [CONTEXT_FLAG]: true },
      })
      return Object.keys(translated)
    }
  }
}
