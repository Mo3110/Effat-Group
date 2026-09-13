import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Category, Media, Product } from '@/payload-types'
import {
  buildBreadcrumbs,
  collectDescendantIds,
  FAMILY_COLOR,
  SALE_MODE_LABEL,
  getClient,
} from '@/lib/payload'
import { formatEGPWithUnit, waLink } from '@/lib/format'
import { StockBadge } from '@/components/StockBadge'

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

/** Products per category page. */
const PAGE_SIZE = 24

async function getCategory(slug: string): Promise<Category | null> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    locale: 'ar',
  })
  return (res.docs[0] as Category) ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}

  const keywords = (category.seoKeywords ?? []) as string[]
  return {
    title: category.title,
    description:
      category.description ||
      `${category.title} — توريد وتركيب وصيانة من Effat Group. ${keywords.slice(0, 3).join('، ')}`,
    keywords,
  }
}

export default async function CategoryPage({ params, searchParams }: Args) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const category = await getCategory(slug)
  if (!category) notFound()

  const payload = await getClient()

  // Include descendants so a parent category shows its children's stock.
  const scopeIds = await collectDescendantIds(category.id)

  const [children, products, crumbs] = await Promise.all([
    payload.find({
      collection: 'categories',
      where: { parent: { equals: category.id } },
      limit: 100,
      sort: 'order',
      depth: 0,
      locale: 'ar',
    }),
    payload.find({
      collection: 'products',
      where: { category: { in: scopeIds } },
      limit: PAGE_SIZE,
      page,
      depth: 2,
      locale: 'ar',
    }),
    buildBreadcrumbs(category),
  ])

  const color = FAMILY_COLOR[category.family] ?? 'var(--e-primary)'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="مسار التصفح" className="text-sm text-[var(--e-text-muted)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[var(--e-primary)]">
              الرئيسية
            </Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={c.slug} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {i === crumbs.length - 1 ? (
                <span className="font-semibold text-[var(--e-text)]">{c.title}</span>
              ) : (
                <Link href={`/c/${c.slug}`} className="hover:text-[var(--e-primary)]">
                  {c.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Header */}
      <header className="mt-6 border-b border-[var(--e-border)] pb-6">
        <span aria-hidden className="block h-1.5 w-14 rounded-full" style={{ background: color }} />
        <h1 className="mt-4 text-3xl font-extrabold">{category.title}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl leading-relaxed text-[var(--e-text-muted)]">
            {category.description}
          </p>
        )}
        <span
          className="mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: 'var(--e-steel-100)', color: 'var(--e-text-muted)' }}
        >
          {SALE_MODE_LABEL[category.saleMode ?? 'quote']}
        </span>
      </header>

      {/* Subcategories */}
      {children.docs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">الأقسام الفرعية</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(children.docs as Category[]).map((child) => (
              <Link
                key={child.id}
                href={`/c/${child.slug}`}
                className="card-lift flex items-center gap-3 rounded-[var(--e-radius)] border border-[var(--e-border)] bg-white p-4"
              >
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <span className="font-semibold">{child.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="mt-12">
        <h2 className="text-lg font-bold">المنتجات</h2>

        {products.docs.length === 0 ? (
          <div className="mt-4 rounded-[var(--e-radius-lg)] border border-dashed border-[var(--e-border-strong,var(--e-border))] bg-white p-10 text-center">
            <p className="font-semibold">لسه مفيش منتجات مضافة في القسم ده.</p>
            <p className="mt-1 text-sm text-[var(--e-text-muted)]">
              اطلب عرض سعر وهنرجع لك بالتوفر والأسعار خلال يوم عمل.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={`/quote?category=${category.slug}`}
                className="rounded-full bg-[var(--e-primary)] px-5 py-2.5 text-sm font-bold text-white"
              >
                اطلب عرض سعر
              </Link>
              <a
                href={waLink(`السلام عليكم، عايز أستفسر عن ${category.title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-[var(--e-primary)] px-5 py-2.5 text-sm font-bold text-[var(--e-primary)]"
              >
                اسأل على واتساب
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(products.docs as Product[]).map((p, i) => {
              const img = p.gallery?.[0] as Media | undefined
              return (
              <Link
                key={p.id}
                href={`/p/${p.slug}`}
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
                {p.shortDescription && (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--e-text-muted)]">
                    {p.shortDescription}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  {p.price ? (
                    <span className="num font-extrabold text-[var(--e-primary)]">
                      {formatEGPWithUnit(p.price)}
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-[var(--e-primary)]">بعرض سعر</span>
                  )}
                  <StockBadge status={p.stockStatus} />
                </div>
                </div>
              </Link>
              )
            })}
          </div>
        )}

        {/* Pager — the list previously truncated at 24 with no way to see the rest */}
        {products.totalPages > 1 && (
          <nav
            aria-label="تصفّح الصفحات"
            className="mt-8 flex items-center justify-center gap-2"
          >
            {products.hasPrevPage && (
              <Link
                href={`/c/${category.slug}?page=${page - 1}`}
                className="rounded-full border border-[var(--e-border)] bg-white px-4 py-2 text-sm font-bold hover:border-[var(--e-primary)]"
              >
                السابق
              </Link>
            )}
            <span className="px-3 text-sm text-[var(--e-text-muted)]">
              صفحة <span className="num">{page}</span> من{' '}
              <span className="num">{products.totalPages}</span>
            </span>
            {products.hasNextPage && (
              <Link
                href={`/c/${category.slug}?page=${page + 1}`}
                className="rounded-full border border-[var(--e-border)] bg-white px-4 py-2 text-sm font-bold hover:border-[var(--e-primary)]"
              >
                التالي
              </Link>
            )}
          </nav>
        )}
      </section>
    </div>
  )
}

