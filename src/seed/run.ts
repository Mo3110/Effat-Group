/**
 * Seeds the category tree and services from ./taxonomy.json (a copy of
 * ../../catalog/taxonomy.json, kept in-repo so the seed can run on Vercel).
 * Idempotent — re-running updates existing records by slug.
 *
 *   npm run seed
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const TAXONOMY = path.resolve(dirname, 'taxonomy.json')

type Node = {
  slug: string
  ar: string
  en?: string
  sale_mode?: 'cart' | 'quote' | 'hybrid'
  featured?: boolean
  hero?: boolean
  seo_ar?: string[]
  children?: Node[]
}

const FAMILY_BY_ROOT: Record<string, 'fire' | 'alarm' | 'security' | 'ppe'> = {
  'fire-fighting': 'fire',
  'fire-alarm': 'alarm',
  'security-systems': 'security',
  'industrial-safety': 'ppe',
}

async function main() {
  const payload = await getPayload({ config })
  const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY, 'utf8'))

  let created = 0
  let updated = 0

  async function upsertCategory(
    node: Node,
    family: 'fire' | 'alarm' | 'security' | 'ppe',
    parentId: number | null,
    order: number,
    inheritedMode: 'cart' | 'quote' | 'hybrid',
  ) {
    const saleMode = node.sale_mode ?? inheritedMode

    const data = {
      title: node.ar,
      slug: node.slug,
      family,
      saleMode,
      parent: parentId ?? undefined,
      featured: Boolean(node.hero ?? node.featured),
      seoKeywords: node.seo_ar ?? [],
      order,
    }

    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: node.slug } },
      limit: 1,
      locale: 'ar',
    })

    let id: number
    if (existing.docs.length) {
      const doc = await payload.update({
        collection: 'categories',
        id: existing.docs[0].id,
        data,
        locale: 'ar',
      })
      id = doc.id
      updated++
    } else {
      const doc = await payload.create({ collection: 'categories', data, locale: 'ar' })
      id = doc.id
      created++
    }

    // English label as the secondary locale
    if (node.en) {
      await payload.update({
        collection: 'categories',
        id,
        data: { title: node.en },
        locale: 'en',
      })
    }

    let i = 0
    for (const child of node.children ?? []) {
      await upsertCategory(child, family, id, i++, saleMode)
    }
  }

  for (const [rootIndex, root] of (taxonomy.categories as Node[]).entries()) {
    const family = FAMILY_BY_ROOT[root.slug]
    if (!family) {
      payload.logger.warn(`Unknown root category "${root.slug}" — skipped`)
      continue
    }
    await upsertCategory(root, family, null, rootIndex, 'quote')
  }

  // Services
  for (const svc of taxonomy.services ?? []) {
    const existing = await payload.find({
      collection: 'services',
      where: { slug: { equals: svc.slug } },
      limit: 1,
    })
    const data = {
      title: svc.ar,
      slug: svc.slug,
      model: svc.model,
      recurringMonths: svc.recurring_months ?? undefined,
    }
    if (existing.docs.length) {
      await payload.update({ collection: 'services', id: existing.docs[0].id, data, locale: 'ar' })
    } else {
      await payload.create({ collection: 'services', data, locale: 'ar' })
    }
    if (svc.en) {
      const found = await payload.find({
        collection: 'services',
        where: { slug: { equals: svc.slug } },
        limit: 1,
      })
      if (found.docs.length) {
        await payload.update({
          collection: 'services',
          id: found.docs[0].id,
          data: { title: svc.en },
          locale: 'en',
        })
      }
    }
  }

  payload.logger.info(`✅ categories: ${created} created, ${updated} updated`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
