'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n'

/**
 * Swaps the leading locale segment of the current URL, so the reader lands on
 * the same page in the other language (search terms and pagination kept).
 */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || '/'
  const search = useSearchParams()
  const target: Locale = locale === 'ar' ? 'en' : 'ar'

  const segments = pathname.split('/')
  if (isLocale(segments[1])) segments[1] = target
  else segments.splice(1, 0, target)

  const qs = search?.toString()
  const href = `${segments.join('/') || '/'}${qs ? `?${qs}` : ''}`

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      className="rounded-full border border-white/40 px-3 py-0.5 text-xs font-bold hover:bg-white hover:text-[var(--e-blue-900)]"
    >
      {label}
    </Link>
  )
}
