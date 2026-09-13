import Image from 'next/image'
import Link from 'next/link'
import { FAMILIES } from '@/lib/families'
import { STORY } from '@/lib/story'
import { FacilityHero } from '@/components/FacilityHero'
import { getDict, isLocale, localePath } from '@/i18n'
import { notFound } from 'next/navigation'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const p = (path: string) => localePath(locale, path)
  // Arrow points "forward" in reading direction.
  const arrow = locale === 'ar' ? '←' : '→'

  return (
    <>
      <FacilityHero locale={locale} />

      {/* ---- Trust bar ------------------------------------------------ */}
      <section className="border-y border-[var(--e-border)] bg-white">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-6 text-center md:grid-cols-4">
          {t.home.trust.map((s) => (
            <li key={s.l}>
              <div className="text-2xl font-extrabold text-[var(--e-blue-500)]">{s.n}</div>
              <div className="text-xs text-[var(--e-text-muted)]">{s.l}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- All four, combined in one band ---------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold">{t.home.combinedTitle}</h2>
        <p className="mt-1 max-w-2xl text-[var(--e-text-muted)]">{t.home.combinedBody}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STORY.map((s) => {
            const copy = t.hero.acts[s.key]
            return (
              <Link
                key={s.key}
                href={p(s.href)}
                className="card-lift group relative block overflow-hidden rounded-[var(--e-radius-lg)] shadow-[var(--e-shadow)]"
                style={{ background: s.bg }}
              >
                <span className="relative block aspect-4/3">
                  <Image
                    src={s.image}
                    alt={copy.alt}
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
                  <span className="block text-base font-bold text-white">{copy.chip}</span>
                  <span className="mt-0.5 block text-xs text-white/75">
                    {copy.ctaLabel} {arrow}
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ---- Four families -------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold">{t.home.familiesTitle}</h2>
        <p className="mt-1 text-[var(--e-text-muted)]">{t.home.familiesBody}</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILIES.map((f) => (
            <Link
              key={f.key}
              href={p(`/c/${f.key}`)}
              className="card-lift group rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-5 shadow-[var(--e-shadow-sm)]"
            >
              <span
                aria-hidden
                className="block h-1.5 w-12 rounded-full"
                style={{ background: f.color }}
              />
              <h3 className="mt-4 text-lg font-bold">{t.families[f.key].title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--e-text-muted)]">
                {t.families[f.key].blurb}
              </p>
              <span className="mt-4 inline-block text-sm font-bold text-[var(--e-primary)]">
                {t.home.browse} {arrow}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Services: the recurring-revenue play ---------------------- */}
      <section className="bg-[var(--e-steel-50)] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-extrabold">{t.home.servicesTitle}</h2>
          <p className="mt-1 text-[var(--e-text-muted)]">{t.home.servicesBody}</p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {t.home.services.map((s) => (
              <Link
                key={s.slug}
                href={p(`/services/${s.slug}`)}
                className="card-lift rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-6"
              >
                <h3 className="text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--e-text-muted)]">{s.d}</p>
                <span
                  className="mt-4 inline-block rounded-full px-4 py-2 text-sm font-bold text-white"
                  style={{ background: s.urgent ? 'var(--e-urgent)' : 'var(--e-primary)' }}
                >
                  {s.urgent ? t.home.bookNow : t.home.learnMore}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Sector bundles: compliance anxiety → cart ----------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold">{t.home.bundlesTitle}</h2>
        <p className="mt-1 text-[var(--e-text-muted)]">{t.home.bundlesBody}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {t.home.bundles.map(([slug, label]) => (
            <Link
              key={slug}
              href={p(`/solutions/${slug}`)}
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
