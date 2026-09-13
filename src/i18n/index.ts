import { ar, type Dict } from './ar'
import { en } from './en'

export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ar'

const dicts: Record<Locale, Dict> = { ar, en }

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale)
}

export function dir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export function getDict(locale: Locale): Dict {
  return dicts[locale]
}

/** Prefix an internal path with the locale segment: localePath('en', '/c/x') → '/en/c/x'. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

export type { Dict }
