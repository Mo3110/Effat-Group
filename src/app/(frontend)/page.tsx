import Image from 'next/image'
import Link from 'next/link'
import { FAMILIES } from '@/lib/families'
import { STORY } from '@/lib/story'
import { FacilityHero } from '@/components/FacilityHero'

export default function HomePage() {
  return (
    <>
      <FacilityHero />

      {/* ---- Trust bar ------------------------------------------------ */}
      <section className="border-y border-[var(--e-border)] bg-white">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-6 text-center md:grid-cols-4">
          {[
            { n: '٤', l: 'عائلات منتجات تحت سقف واحد' },
            { n: '١٤٠+', l: 'قسم ومنتج' },
            { n: 'معتمد', l: 'من الدفاع المدني' },
            { n: '٢٤/٧', l: 'صيانة وطوارئ' },
          ].map((s) => (
            <li key={s.l}>
              <div className="text-2xl font-extrabold text-[var(--e-blue-500)]">{s.n}</div>
              <div className="text-xs text-[var(--e-text-muted)]">{s.l}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- All four, combined in one band ---------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold">كل ده تحت سقف واحد</h2>
        <p className="mt-1 max-w-2xl text-[var(--e-text-muted)]">
          من غرفة الطلمبات لحد حذاء الأمان — أنظمة الحريق والإنذار والمراقبة ومهمات السلامة، من مورّد
          واحد بضمان واحد.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STORY.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="card-lift group relative block overflow-hidden rounded-[var(--e-radius-lg)] shadow-[var(--e-shadow)]"
              style={{ background: s.bg }}
            >
              <span className="relative block aspect-4/3">
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`transition-opacity group-hover:opacity-100 ${
                    s.fit === 'contain' ? 'object-contain p-2' : 'object-cover opacity-90'
                  }`}
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3"
                  style={{
                    background:
                      'linear-gradient(to top, rgb(8 12 18 / 0.88), rgb(8 12 18 / 0))',
                  }}
                />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-4">
                <span
                  aria-hidden
                  className="mb-2 block h-1 w-10 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="block text-base font-bold text-white">{s.chip}</span>
                <span className="mt-0.5 block text-xs text-white/75">{s.ctaLabel} ←</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Four families -------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold">تسوّق حسب القسم</h2>
        <p className="mt-1 text-[var(--e-text-muted)]">
          أسعار معلنة على المستهلكات ومهمات الوقاية، وعروض هندسية على الأنظمة.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILIES.map((f) => (
            <Link
              key={f.key}
              href={`/c/${f.key}`}
              className="card-lift group rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-5 shadow-[var(--e-shadow-sm)]"
            >
              <span
                aria-hidden
                className="block h-1.5 w-12 rounded-full"
                style={{ background: f.color }}
              />
              <h3 className="mt-4 text-lg font-bold">{f.titleAr}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--e-text-muted)]">{f.blurb}</p>
              <span className="mt-4 inline-block text-sm font-bold text-[var(--e-primary)]">
                تصفّح القسم ←
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Services: the recurring-revenue play ---------------------- */}
      <section className="bg-[var(--e-steel-50)] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold">خدمات الصيانة والامتثال</h2>
          <p className="mt-1 text-[var(--e-text-muted)]">
            الطفاية بتحتاج إعادة تعبئة وفحص كل سنة. احجز وخلّي منشأتك مطابقة لاشتراطات الدفاع المدني.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                slug: 'extinguisher-refill',
                t: 'إعادة تعبئة واختبار الطفايات',
                d: 'فحص، إعادة تعبئة، واختبار ضغط — في موقعك أو بالورشة.',
                urgent: true,
              },
              {
                slug: 'annual-inspection',
                t: 'الفحص الدوري وشهادة الدفاع المدني',
                d: 'تقرير فحص كامل للمنشأة واستخراج الشهادة السنوية.',
              },
              {
                slug: 'maintenance-contract',
                t: 'عقود صيانة سنوية',
                d: 'ثلاث باقات حسب حجم المنشأة، مع تذكير تلقائي بمواعيد الصيانة.',
              },
            ].map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card-lift rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-6"
              >
                <h3 className="text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--e-text-muted)]">{s.d}</p>
                <span
                  className="mt-4 inline-block rounded-full px-4 py-2 text-sm font-bold text-white"
                  style={{ background: s.urgent ? 'var(--e-urgent)' : 'var(--e-primary)' }}
                >
                  {s.urgent ? 'احجز الآن' : 'اعرف أكثر'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Sector bundles: compliance anxiety → cart ----------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold">حزم جاهزة حسب نوع المنشأة</h2>
        <p className="mt-1 text-[var(--e-text-muted)]">
          كل اللي منشأتك محتاجاه للامتثال، مجمّع في حزمة واحدة.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            ['restaurant', 'مطاعم وكافيهات'],
            ['warehouse', 'مخازن ومستودعات'],
            ['factory', 'مصانع'],
            ['school', 'مدارس وحضانات'],
            ['clinic', 'عيادات ومستشفيات'],
            ['office', 'مكاتب وإدارات'],
            ['datacenter', 'غرف سيرفرات'],
            ['residential', 'منازل وعقارات'],
          ].map(([slug, label]) => (
            <Link
              key={slug}
              href={`/solutions/${slug}`}
              className="rounded-full border border-[var(--e-border)] bg-white px-4 py-2 text-sm font-semibold hover:border-[var(--e-primary)] hover:text-[var(--e-primary)]"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
