import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Service } from '@/payload-types'
import { getClient } from '@/lib/payload'
import { formatEGPWithUnit, waLink } from '@/lib/format'
import { getDict, isLocale, localePath, type Locale } from '@/i18n'

type Args = { params: Promise<{ locale: string; slug: string }> }

async function getService(slug: string, locale: Locale): Promise<Service | null> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    locale,
  })
  return (res.docs[0] as Service) ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale } = await params
  if (!isLocale(locale)) return {}
  const service = await getService(slug, locale)
  if (!service) return {}
  return { title: service.title, description: service.summary ?? undefined }
}

export default async function ServicePage({ params }: Args) {
  const { slug, locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const lp = (path: string) => localePath(locale, path)
  const service = await getService(slug, locale)
  if (!service) notFound()

  const urgent = service.recurringMonths === 12

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label={t.common.breadcrumb} className="text-sm text-[var(--e-text-muted)]">
        <Link href={lp('/services')} className="hover:text-[var(--e-primary)]">
          {t.services.title}
        </Link>
        <span aria-hidden className="mx-1.5">
          /
        </span>
        <span className="font-semibold text-[var(--e-text)]">{service.title}</span>
      </nav>

      <h1 className="mt-5 text-3xl font-extrabold">{service.title}</h1>
      {service.summary && (
        <p className="mt-3 leading-relaxed text-[var(--e-text-muted)]">{service.summary}</p>
      )}

      {urgent && (
        <p className="mt-6 rounded-[var(--e-radius)] border-s-4 border-[var(--e-urgent)] bg-[var(--e-red-50)] p-4 text-sm font-semibold">
          {t.services.urgentNote}
        </p>
      )}

      {service.tiers && service.tiers.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">{t.services.tiers}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {service.tiers.map((tier, i) => (
              <div
                key={i}
                className="rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-5"
              >
                <h3 className="font-bold">{tier.name}</h3>
                {tier.summary && (
                  <p className="mt-1.5 text-sm text-[var(--e-text-muted)]">{tier.summary}</p>
                )}
                {tier.priceFrom && (
                  <p className="num mt-3 font-extrabold text-[var(--e-primary)]">
                    {t.services.from} {formatEGPWithUnit(tier.priceFrom, t.common.currency)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={lp(`/quote?category=${service.slug}`)}
          className="rounded-full px-6 py-3 font-bold text-white"
          style={{ background: urgent ? 'var(--e-urgent)' : 'var(--e-primary)' }}
        >
          {urgent ? t.services.bookAppointment : t.common.requestQuote}
        </Link>
        <a
          href={waLink(t.services.waMessage(service.title))}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-[var(--e-primary)] px-6 py-3 font-bold text-[var(--e-primary)]"
        >
          {t.services.bookWhatsApp}
        </a>
      </div>
    </div>
  )
}
