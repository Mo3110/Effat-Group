import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Category, Media, Product } from '@/payload-types'
import { buildBreadcrumbs, FAMILY_COLOR, getClient } from '@/lib/payload'
import { formatEGP, formatEGPWithUnit, priceExVat, waLink } from '@/lib/format'
import { StockBadge } from '@/components/StockBadge'
import { getDict, isLocale, localePath, type Locale } from '@/i18n'

type Args = { params: Promise<{ locale: string; slug: string }> }

async function getProduct(slug: string, locale: Locale): Promise<Product | null> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    locale,
  })
  return (res.docs[0] as Product) ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale } = await params
  if (!isLocale(locale)) return {}
  const p = await getProduct(slug, locale)
  if (!p) return {}
  return {
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.shortDescription || undefined,
  }
}


export default async function ProductPage({ params }: Args) {
  const { slug, locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const lp = (path: string) => localePath(locale, path)
  const product = await getProduct(slug, locale)
  if (!product) notFound()

  const payload = await getClient()
  const category = (typeof product.category === 'object' ? product.category : null) as Category | null

  const crumbs = category ? await buildBreadcrumbs(category, locale) : []
  const color = category ? (FAMILY_COLOR[category.family] ?? 'var(--e-primary)') : 'var(--e-primary)'

  // Resolve the effective sale mode: 'inherit' falls back to the category.
  const mode =
    !product.saleMode || product.saleMode === 'inherit'
      ? (category?.saleMode ?? 'quote')
      : product.saleMode

  const image = (product.gallery?.[0] as Media | undefined) ?? undefined

  // Siblings for the "related" rail
  const related = category
    ? await payload.find({
        collection: 'products',
        where: { category: { equals: category.id }, slug: { not_equals: product.slug } },
        limit: 4,
        depth: 2,
        locale,
      })
    : { docs: [] as Product[] }

  const priceStr = product.price ? formatEGP(product.price) : null

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
          {crumbs.map((c) => (
            <li key={c.slug} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              <Link href={lp(`/c/${c.slug}`)} className="hover:text-[var(--e-primary)]">
                {c.title}
              </Link>
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            <span className="font-semibold text-[var(--e-text)]">{product.title}</span>
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-contain p-6"
            />
          ) : (
            <div className="grid h-full place-items-center text-[var(--e-text-muted)]">
              {t.product.noImage}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div>
          <span aria-hidden className="block h-1.5 w-12 rounded-full" style={{ background: color }} />
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{product.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {product.sku && (
              <span className="text-[var(--e-text-muted)]">
                {t.product.sku}: <span className="num font-semibold">{product.sku}</span>
              </span>
            )}
            <StockBadge locale={locale} status={product.stockStatus} withDot />
          </div>

          {product.shortDescription && (
            <p className="mt-4 leading-relaxed text-[var(--e-text-muted)]">
              {product.shortDescription}
            </p>
          )}

          {/* Price / quote */}
          <div className="mt-6 rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-5">
            {mode === 'quote' || !priceStr ? (
              <>
                <p className="text-lg font-extrabold">{t.product.quoteTitle}</p>
                <p className="mt-1 text-sm text-[var(--e-text-muted)]">
                  {t.product.quoteBody}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-end gap-3">
                  <span className="num text-3xl font-extrabold text-[var(--e-primary)]">
                    {formatEGPWithUnit(product.price!, t.common.currency)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="num text-lg text-[var(--e-text-muted)] line-through">
                      {formatEGP(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--e-text-muted)]">
                  {t.product.vatIncl} · {t.product.vatExcl}{' '}
                  <span className="num">{formatEGPWithUnit(priceExVat(product.price!), t.common.currency)}</span>
                </p>
              </>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={lp(`/quote?product=${product.slug}`)}
                className="rounded-full px-6 py-3 font-bold text-white"
                style={{ background: 'var(--e-primary)' }}
              >
                {mode === 'quote' ? t.common.requestQuote : t.product.orderProduct}
              </Link>
              <a
                href={waLink(t.product.waMessage(product.title, product.sku))}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-[var(--e-primary)] px-6 py-3 font-bold text-[var(--e-primary)] transition-colors hover:bg-[var(--e-primary)] hover:text-white"
              >
                {t.common.askWhatsApp}
              </a>
            </div>

            {mode === 'hybrid' && (
              <p className="mt-3 text-xs text-[var(--e-text-muted)]">
                {t.product.hybridNote}
              </p>
            )}
          </div>

          {/* Trust row */}
          <ul className="mt-5 grid gap-2 text-sm text-[var(--e-text-muted)] sm:grid-cols-2">
            <li>✔ {t.product.trustCod}</li>
            <li>✔ {t.product.trustDelivery}</li>
            <li>✔ {t.product.trustInstall}</li>
            {product.warrantyMonths ? (
              <li>
                ✔ <span className="num">{t.product.warranty(product.warrantyMonths)}</span>
              </li>
            ) : (
              <li>✔ {t.product.invoice}</li>
            )}
          </ul>

          {product.certifications && product.certifications.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.certifications.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--e-border)] bg-[var(--e-steel-50)] px-3 py-1 text-xs font-bold"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Specs */}
      {product.specs && product.specs.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-extrabold">{t.product.specs}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <tbody>
                {product.specs.map((s, i) => (
                  <tr key={i} className="border-b border-[var(--e-border)]">
                    <th
                      scope="row"
                      className="w-1/3 bg-[var(--e-steel-50)] p-3 text-start font-bold"
                    >
                      {s.key}
                    </th>
                    <td className="p-3">{s.value}</td>
                  </tr>
                ))}
                {product.refillDueMonths ? (
                  <tr className="border-b border-[var(--e-border)]">
                    <th scope="row" className="bg-[var(--e-steel-50)] p-3 text-start font-bold">
                      {t.product.refill}
                    </th>
                    <td className="p-3">
                      <span className="num">{t.product.refillEvery(product.refillDueMonths)}</span> —{' '}
                      <Link
                        href={lp('/services/extinguisher-refill')}
                        className="font-bold text-[var(--e-primary)]"
                      >
                        {t.product.bookMaintenance}
                      </Link>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related */}
      {related.docs.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-extrabold">{t.product.related}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(related.docs as Product[]).map((r) => {
              const img = r.gallery?.[0] as Media | undefined
              return (
                <Link
                  key={r.id}
                  href={lp(`/p/${r.slug}`)}
                  className="card-lift overflow-hidden rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white"
                >
                  <span className="relative block aspect-4/3 bg-white">
                    {img?.url && (
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        sizes="260px"
                        className="object-contain p-3"
                      />
                    )}
                  </span>
                  <span className="block p-3">
                    <span className="block text-sm font-bold leading-snug">{r.title}</span>
                    <span className="mt-1 block text-sm font-extrabold text-[var(--e-primary)]">
                      {r.price ? formatEGPWithUnit(r.price, t.common.currency) : t.common.byQuote}
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
