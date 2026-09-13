import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SOLUTIONS } from '@/lib/solutions'
import { getDict, isLocale, localePath } from '@/i18n'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDict(locale)
  return { title: t.solutions.title, description: t.solutions.description }
}

export default async function SolutionsIndex({ params }: Args) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const arrow = locale === 'ar' ? '←' : '→'

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t.solutions.title}</h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-[var(--e-text-muted)]">{t.solutions.intro}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SOLUTIONS.map((s) => {
          const copy = t.solutions.sectors[s.key]
          return (
            <Link
              key={s.key}
              href={localePath(locale, `/solutions/${s.key}`)}
              className="card-lift group overflow-hidden rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white"
            >
              <span className="relative block aspect-16/9 bg-[var(--e-steel-50)]">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: s.color }} />
              </span>
              <span className="block p-5">
                <span className="block text-lg font-bold">{copy.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-[var(--e-text-muted)]">{copy.tagline}</span>
                <span className="mt-3 block text-sm font-bold text-[var(--e-primary)]">
                  {t.solutions.itemsCount(s.categories.length)} {arrow}
                </span>
              </span>
            </Link>
          )
        })}
      </div>

      <p className="mt-10 text-xs text-[var(--e-text-muted)]">{t.solutions.disclaimer}</p>
    </div>
  )
}
