import Link from 'next/link'
import type { Metadata } from 'next'
import type { Service } from '@/payload-types'
import { getClient } from '@/lib/payload'
import { getDict, isLocale, localePath } from '@/i18n'
import { notFound } from 'next/navigation'

// Rendered per request: this page queries Payload, and a static prerender
// would make `next build` depend on a live database connection.
export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDict(locale)
  return { title: t.services.title, description: t.services.description }
}

export default async function ServicesPage({ params }: Args) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const payload = await getClient()
  const services = await payload.find({
    collection: 'services',
    limit: 50,
    depth: 0,
    locale,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t.services.title}</h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-[var(--e-text-muted)]">
        {t.services.intro}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(services.docs as Service[]).map((s) => (
          <Link
            key={s.id}
            href={localePath(locale, `/services/${s.slug}`)}
            className="card-lift rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-6"
          >
            <h2 className="text-lg font-bold leading-snug">{s.title}</h2>
            {s.summary && (
              <p className="mt-2 text-sm leading-relaxed text-[var(--e-text-muted)]">{s.summary}</p>
            )}
            {s.recurringMonths === 12 && (
              <span className="mt-3 inline-block rounded-full bg-[var(--e-orange-50)] px-3 py-1 text-xs font-bold text-[var(--e-orange-700)]">
                {t.services.annual}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
