import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Service } from '@/payload-types'
import { getClient } from '@/lib/payload'
import { formatEGP, waLink } from '@/lib/format'

type Args = { params: Promise<{ slug: string }> }

async function getService(slug: string): Promise<Service | null> {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    locale: 'ar',
  })
  return (res.docs[0] as Service) ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}
  return { title: service.title, description: service.summary ?? undefined }
}

export default async function ServicePage({ params }: Args) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  const urgent = service.recurringMonths === 12

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="مسار التصفح" className="text-sm text-[var(--e-text-muted)]">
        <Link href="/services" className="hover:text-[var(--e-primary)]">
          الخدمات
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
          الطفايات لازم تتفحص وتتعبأ كل ١٢ شهر حسب اشتراطات الدفاع المدني. احجز بدري عشان تفضل
          منشأتك مطابقة.
        </p>
      )}

      {service.tiers && service.tiers.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">الباقات</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {service.tiers.map((t, i) => (
              <div
                key={i}
                className="rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-5"
              >
                <h3 className="font-bold">{t.name}</h3>
                {t.summary && (
                  <p className="mt-1.5 text-sm text-[var(--e-text-muted)]">{t.summary}</p>
                )}
                {t.priceFrom && (
                  <p className="num mt-3 font-extrabold text-[var(--e-primary)]">
                    من {formatEGP(t.priceFrom)} ج.م
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/quote?category=${service.slug}`}
          className="rounded-full px-6 py-3 font-bold text-white"
          style={{ background: urgent ? 'var(--e-urgent)' : 'var(--e-primary)' }}
        >
          {urgent ? 'احجز موعد' : 'اطلب عرض سعر'}
        </Link>
        <a
          href={waLink(`السلام عليكم، عايز أحجز ${service.title}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-[var(--e-primary)] px-6 py-3 font-bold text-[var(--e-primary)]"
        >
          احجز على واتساب
        </a>
      </div>
    </div>
  )
}
