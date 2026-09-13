import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Category, Media, Product } from '@/payload-types'
import { getClient } from '@/lib/payload'
import { formatEGPWithUnit } from '@/lib/format'
import { StockBadge } from '@/components/StockBadge'
import { getDict, isLocale, localePath } from '@/i18n'
import { notFound } from 'next/navigation'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) ? { title: getDict(locale).search.title } : {}
}

/**
 * Search results for the header search box, which previously pointed at a
 * route that did not exist — every search 404'd.
 *
 * Uses Payload's `like` operator (SQL LIKE) rather than a search engine. That
 * is adequate for a catalogue this size but does NOT handle Arabic
 * normalisation — "طفاية" will not match "طفايه", and alef/hamza variants miss.
 * Meilisearch remains the plan in ARCHITECTURE.md; this is the smallest thing
 * that makes the feature work.
 */
export default async function SearchPage({ params, searchParams }: Args) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const lp = (path: string) => localePath(locale, path)
  const { q } = await searchParams
  const term = (q ?? '').trim().slice(0, 80)

  if (!term) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-2xl font-extrabold">{t.search.emptyTitle}</h1>
        <p className="mt-2 text-[var(--e-text-muted)]">
          {t.search.emptyHint}
        </p>
      </div>
    )
  }

  const payload = await getClient()

  const [products, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      where: {
        or: [
          { title: { like: term } },
          { shortDescription: { like: term } },
          { sku: { like: term } },
        ],
      },
      limit: 24,
      depth: 2,
      locale,
    }),
    payload.find({
      collection: 'categories',
      where: { title: { like: term } },
      limit: 8,
      depth: 0,
      locale,
    }),
  ])

  const empty = products.docs.length === 0 && categories.docs.length === 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-extrabold">
        {t.search.resultsFor(term)}
      </h1>
      <p className="mt-1 text-sm text-[var(--e-text-muted)]">
        {t.search.count(products.totalDocs, categories.totalDocs)}
      </p>

      {empty && (
        <div className="mt-8 rounded-[var(--e-radius-lg)] border border-dashed border-[var(--e-border)] bg-white p-10 text-center">
          <p className="font-semibold">{t.search.noResults}</p>
          <p className="mt-1 text-sm text-[var(--e-text-muted)]">
            {t.search.tryShorter}
          </p>
          <Link
            href={lp('/quote')}
            className="mt-5 inline-block rounded-full bg-[var(--e-primary)] px-5 py-2.5 text-sm font-bold text-white"
          >
            {t.common.requestQuote}
          </Link>
        </div>
      )}

      {categories.docs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">{t.search.categories}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(categories.docs as Category[]).map((c) => (
              <Link
                key={c.id}
                href={lp(`/c/${c.slug}`)}
                className="rounded-full border border-[var(--e-border)] bg-white px-4 py-2 text-sm font-semibold hover:border-[var(--e-primary)] hover:text-[var(--e-primary)]"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.docs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">{t.search.products}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(products.docs as Product[]).map((p, i) => {
              const img = p.gallery?.[0] as Media | undefined
              return (
                <Link
                  key={p.id}
                  href={lp(`/p/${p.slug}`)}
                  className="card-lift overflow-hidden rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white"
                >
                  <span className="relative block aspect-4/3 bg-white">
                    {img?.url && (
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        priority={i < 4}
                        sizes="280px"
                        className="object-contain p-3"
                      />
                    )}
                  </span>
                  <div className="p-4">
                    <h3 className="font-bold leading-snug">{p.title}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      {p.price ? (
                        <span className="num font-extrabold text-[var(--e-primary)]">
                          {formatEGPWithUnit(p.price, t.common.currency)}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-[var(--e-primary)]">{t.common.byQuote}</span>
                      )}
                      <StockBadge locale={locale} status={p.stockStatus} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
