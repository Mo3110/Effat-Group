import Link from 'next/link'
import { Suspense } from 'react'
import { FAMILIES } from '@/lib/families'
import { getDict, localePath, type Locale } from '@/i18n'
import { LocaleSwitch } from './LocaleSwitch'

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const p = (path: string) => localePath(locale, path)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--e-border)] bg-white/95 backdrop-blur">
      {/* Utility strip — phone first, because most enquiries are calls */}
      <div className="bg-[var(--e-blue-900)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 text-[13px]">
          <span className="hidden sm:inline">{t.header.tagline}</span>
          <div className="flex items-center gap-4">
            <a href="tel:+201060094777" className="num font-semibold hover:text-[var(--e-orange-400)]">
              +20 106 009 4777
            </a>
            <Suspense fallback={null}>
              <LocaleSwitch locale={locale} label={t.common.switchTo} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href={p('/')} className="flex shrink-0 items-center gap-2.5">
          <ShieldMark />
          <span
            dir="ltr"
            className="text-lg font-extrabold tracking-tight text-[var(--e-blue-500)]"
          >
            Effat Group
          </span>
        </Link>

        <form action={p('/search')} className="ms-auto hidden max-w-md flex-1 md:block">
          <input
            name="q"
            type="search"
            placeholder={t.header.searchPlaceholder}
            className="w-full rounded-full border border-[var(--e-border)] bg-[var(--e-steel-50)] px-4 py-2 text-sm outline-none focus:border-[var(--e-primary)]"
          />
        </form>

        <Link
          href={p('/services/extinguisher-refill')}
          className="ms-auto rounded-full bg-[var(--e-urgent)] px-4 py-2 text-sm font-bold text-white md:ms-0"
        >
          {t.header.urgent}
        </Link>
      </div>

      <nav className="border-t border-[var(--e-border)]">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 text-sm">
          {FAMILIES.map((f) => (
            <li key={f.key}>
              <Link
                href={p(`/c/${f.key}`)}
                className="flex items-center gap-2 whitespace-nowrap px-3 py-2.5 font-semibold hover:bg-[var(--e-steel-50)]"
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ background: f.color }}
                />
                {t.families[f.key].title}
              </Link>
            </li>
          ))}
          <li>
            <Link href={p('/services')} className="block whitespace-nowrap px-3 py-2.5 font-semibold hover:bg-[var(--e-steel-50)]">
              {t.header.services}
            </Link>
          </li>
          <li>
            <Link href={p('/solutions')} className="block whitespace-nowrap px-3 py-2.5 font-semibold hover:bg-[var(--e-steel-50)]">
              {t.solutions.title}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

/** Shield + flame mark, derived from the logo. Inline SVG — no image request. */
export function ShieldMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 56" aria-hidden role="presentation">
      <path
        d="M24 2 44 8v22c0 12-9 20-20 24C13 50 4 42 4 30V8L24 2Z"
        fill="none"
        stroke="var(--e-red-500)"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 13c5 6 9 9 9 15a9 9 0 1 1-18 0c0-4 2-6 4-9 1 2 2 3 3 4 1-4 1-7 2-10Z"
        fill="var(--e-orange-500)"
      />
    </svg>
  )
}
