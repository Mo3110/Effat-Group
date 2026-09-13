import Link from 'next/link'
import type { Metadata } from 'next'
import type { Service } from '@/payload-types'
import { getClient } from '@/lib/payload'

// Rendered per request: this page queries Payload, and a static prerender
// would make `next build` depend on a live database connection.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'الخدمات',
  description:
    'إعادة تعبئة واختبار الطفايات، الفحص الدوري وشهادة الدفاع المدني، عقود الصيانة السنوية، التوريد والتركيب، وتدريب فرق الطوارئ.',
}

export default async function ServicesPage() {
  const payload = await getClient()
  const services = await payload.find({
    collection: 'services',
    limit: 50,
    depth: 0,
    locale: 'ar',
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">الخدمات</h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-[var(--e-text-muted)]">
        الطفاية بتحتاج إعادة تعبئة وفحص كل سنة، والمنشأة بتحتاج شهادة سارية. بنتولى ده كله بعقد
        واحد، مع تذكير تلقائي بمواعيد الصيانة.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(services.docs as Service[]).map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            className="card-lift rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-6"
          >
            <h2 className="text-lg font-bold leading-snug">{s.title}</h2>
            {s.summary && (
              <p className="mt-2 text-sm leading-relaxed text-[var(--e-text-muted)]">{s.summary}</p>
            )}
            {s.recurringMonths === 12 && (
              <span className="mt-3 inline-block rounded-full bg-[var(--e-orange-50)] px-3 py-1 text-xs font-bold text-[var(--e-orange-700)]">
                خدمة سنوية
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
