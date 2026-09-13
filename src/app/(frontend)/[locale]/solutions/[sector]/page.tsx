import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Category, Media, Product } from '@/payload-types'
import { getClient } from '@/lib/payload'
import { formatEGPWithUnit, waLink } from '@/lib/format'
import { getSolution, SOLUTIONS } from '@/lib/solutions'
import { getDict, isLocale, localePath } from '@/i18n'

type Args = { params: Promise<{ locale: string; sector: string }> }

// Queries Payload for every category in the bundle, so render per request
// rather than at build time.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, sector } = await params
  if (!isLocale(locale)) return {}
  const solution = getSolution(sector)
  if (!solution) return {}
  const copy = getDict(locale).solutions.sectors[solution.key]
  return { title: copy.title, description: copy.intro }
}

/** Up to this many example products are shown under each bundle item. */
const EXAMPLES_PER_ITEM = 3

export default async function SolutionPage({ params }: Args) {
  const { locale, sector } = await params
  if (!isLocale(locale)) notFound()
  const solution = getSolution(sector)
  if (!solution) notFound()

  const t = getDict(locale)
  const copy = t.solutions.sectors[solution.key]
  const lp = (path: string) => localePath(locale, path)
  const arrow = locale === 'ar' ? '←' : '→'

  const payload = await getClient()

  // One query for all bundle categories, then a second for example products.
  // A slug missing from the taxonomy is simply skipped.
  const categoryRes = await payload.find({
    collection: 'categories',
    where: { slug: { in: solution.categories } },
    limit: solution.categories.length,
    depth: 0,
    locale,
  })
  const bySlug = new Map((categoryRes.docs as Category[]).map((c) => [c.slug, c]))
  const items = solution.categories.map((slug) => bySlug.get(slug)).filter(Boolean) as Category[]

  const productRes = items.length
    ? await payload.find({
        collection: 'products',
        where: { category: { in: items.map((c) => c.id) } },
        limit: 100,
        depth: 2,
        locale,
      })
    : { docs: [] as Product[] }

  const examples = new Map<number | string, Product[]>()
  for (const p of productRes.docs as Product[]) {
    const catId = typeof p.category === 'object' ? p.category.id : p.category
    const list = examples.get(catId) ?? []
    if (list.length < EXAMPLES_PER_ITEM) examples.set(catId, [...list, p])
  }

  const others = SOLUTIONS.filter((s) => s.key !== solution.key)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label={t.common.breadcrumb} className="text-sm text-[var(--e-text-muted)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href={lp('/')} className="hover:text-[var(--e-primary)]">
              {t.common.home}
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            <Link href={lp('/solutions')} className="hover:text-[var(--e-primary)]">
              {t.solutions.title}
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            <span className="font-semibold text-[var(--e-text)]">{copy.title}</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <span aria-hidden className="block h-1.5 w-14 rounded-full" style={{ background: solution.color }} />
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{copy.title}</h1>
          <p className="mt-2 text-lg font-semibold" style={{ color: solution.color }}>
            {copy.tagline}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--e-text-muted)]">{copy.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={lp(`/quote?category=solution-${solution.key}`)}
              className="rounded-full bg-[var(--e-primary)] px-6 py-3 font-bold text-white shadow-[var(--e-shadow)]"
            >
              {t.solutions.requestBundle}
            </Link>
            <a
              href={waLink(t.solutions.waMessage(copy.title))}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[var(--e-primary)] px-6 py-3 font-bold text-[var(--e-primary)] transition-colors hover:bg-[var(--e-primary)] hover:text-white"
            >
              {t.common.askWhatsApp}
            </a>
          </div>
          <p className="mt-3 text-sm text-[var(--e-text-muted)]">{t.solutions.quoteHint}</p>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-[var(--e-radius-lg)] shadow-[var(--e-shadow-lg)] ring-4" style={{ ['--tw-ring-color' as string]: solution.color }}>
          <Image src={solution.image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
        </div>
      </header>

      {/* Compliance checklist */}
      <section className="mt-12 rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-[var(--e-steel-50)] p-6 sm:p-8">
        <h2 className="text-xl font-extrabold">{t.solutions.checklist}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {copy.checklist.map((line) => (
            <li key={line} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                style={{ background: solution.color }}
              >
                ✓
              </span>
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Bundle items */}
      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-extrabold">{t.solutions.includes}</h2>
          <span className="text-sm text-[var(--e-text-muted)]">{t.solutions.itemsCount(items.length)}</span>
        </div>

        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          {items.map((cat, i) => {
            const ex = examples.get(cat.id) ?? []
            return (
              <li
                key={cat.id}
                className="rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="num grid size-9 shrink-0 place-items-center rounded-full bg-[var(--e-steel-100)] text-sm font-extrabold text-[var(--e-text-muted)]">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold leading-snug">{cat.title}</h3>
                    {copy.items[cat.slug] && (
                      <p className="mt-1 text-sm leading-relaxed text-[var(--e-text-muted)]">
                        {copy.items[cat.slug]}
                      </p>
                    )}

                    {ex.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {ex.map((p) => {
                          const img = p.gallery?.[0] as Media | undefined
                          return (
                            <li key={p.id}>
                              <Link
                                href={lp(`/p/${p.slug}`)}
                                className="flex items-center gap-2 rounded-full border border-[var(--e-border)] bg-[var(--e-steel-50)] py-1 pe-3 ps-1 text-xs font-semibold hover:border-[var(--e-primary)]"
                              >
                                <span className="relative block size-7 overflow-hidden rounded-full bg-white">
                                  {img?.url && <Image src={img.url} alt="" fill sizes="28px" className="object-contain p-0.5" />}
                                </span>
                                <span className="max-w-[12rem] truncate">{p.title}</span>
                                {p.price ? (
                                  <span className="num text-[var(--e-primary)]">{formatEGPWithUnit(p.price, t.common.currency)}</span>
                                ) : null}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}

                    <Link
                      href={lp(`/c/${cat.slug}`)}
                      className="mt-3 inline-block text-sm font-bold text-[var(--e-primary)]"
                    >
                      {t.solutions.browseCategory} {arrow}
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="mt-6 text-xs text-[var(--e-text-muted)]">{t.solutions.disclaimer}</p>
      </section>

      {/* CTA band */}
      <section className="mt-12 rounded-[var(--e-radius-lg)] bg-[var(--e-blue-900)] p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold">{t.solutions.requestBundle}</h2>
            <p className="mt-1 text-sm text-white/75">{t.solutions.quoteHint}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={lp(`/quote?category=solution-${solution.key}`)}
              className="rounded-full bg-[var(--e-orange-500)] px-6 py-3 font-bold text-white"
            >
              {t.common.requestQuote}
            </Link>
            <a
              href={waLink(t.solutions.waMessage(copy.title))}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/60 px-6 py-3 font-bold hover:bg-white hover:text-[var(--e-blue-900)]"
            >
              {t.common.askWhatsApp}
            </a>
          </div>
        </div>
      </section>

      {/* Other sectors */}
      <section className="mt-12">
        <h2 className="text-lg font-bold">{t.solutions.otherSectors}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {others.map((s) => (
            <Link
              key={s.key}
              href={lp(`/solutions/${s.key}`)}
              className="rounded-full border border-[var(--e-border)] bg-white px-4 py-2 text-sm font-semibold hover:border-[var(--e-primary)] hover:text-[var(--e-primary)]"
            >
              {t.solutions.sectors[s.key].title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
