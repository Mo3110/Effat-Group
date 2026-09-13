import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category } from '@/payload-types'
import { defaultLocale, type Locale } from '@/i18n'

export const getClient = () => getPayload({ config })

export type Crumb = { title: string; slug: string }

/** Walks `parent` up to the root so the page can render a breadcrumb. */
export async function buildBreadcrumbs(
  category: Category,
  locale: Locale = defaultLocale,
): Promise<Crumb[]> {
  const payload = await getClient()
  const crumbs: Crumb[] = [{ title: category.title, slug: category.slug }]

  let parentId = typeof category.parent === 'object' ? category.parent?.id : category.parent
  let guard = 0

  while (parentId && guard++ < 10) {
    const parent = (await payload.findByID({
      collection: 'categories',
      id: parentId,
      depth: 0,
      locale,
    })) as Category | null
    if (!parent) break
    crumbs.unshift({ title: parent.title, slug: parent.slug })
    parentId = typeof parent.parent === 'object' ? parent.parent?.id : parent.parent
  }

  return crumbs
}

/**
 * Every category id at or below `rootId`.
 *
 * Products are attached to leaf categories, so a parent page like
 * /c/fire-extinguishers would otherwise show "no products" while its children
 * are full. Browsing from the nav has to land on stock.
 */
export async function collectDescendantIds(
  rootId: string | number,
  maxDepth = 4,
): Promise<(string | number)[]> {
  const payload = await getClient()
  const ids: (string | number)[] = [rootId]
  let frontier: (string | number)[] = [rootId]

  for (let d = 0; d < maxDepth && frontier.length; d++) {
    const res = await payload.find({
      collection: 'categories',
      where: { parent: { in: frontier } },
      limit: 500,
      depth: 0,
      pagination: false,
    })
    frontier = res.docs.map((c) => c.id)
    ids.push(...frontier)
  }

  return ids
}

export const FAMILY_COLOR: Record<string, string> = {
  fire: 'var(--e-cat-fire)',
  alarm: 'var(--e-cat-alarm)',
  security: 'var(--e-cat-security)',
  ppe: 'var(--e-cat-ppe)',
}

export type SaleMode = 'cart' | 'quote' | 'hybrid'

/** Narrow a stored sale mode to a known key so dictionary lookups are typed. */
export const saleModeKey = (mode?: string | null): SaleMode =>
  mode === 'cart' || mode === 'hybrid' ? mode : 'quote'
