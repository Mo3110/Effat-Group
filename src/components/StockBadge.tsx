/**
 * Single source of truth for stock labels and colours.
 *
 * Previously duplicated in the category and product pages with DIFFERENT
 * colours — the category page used design tokens, the product page used raw
 * hex — so the same status rendered differently on the two pages.
 */
import { getDict, type Locale } from '@/i18n'

const STOCK_COLOR = {
  in_stock: 'var(--e-success)',
  low: 'var(--e-warning)',
  on_order: 'var(--e-text-muted)',
  out: 'var(--e-error)',
} as const

export type StockStatus = keyof typeof STOCK_COLOR

export const stockInfo = (locale: Locale, status?: string | null) => {
  const key = ((status ?? 'in_stock') in STOCK_COLOR ? status ?? 'in_stock' : 'in_stock') as StockStatus
  return { label: getDict(locale).stock[key], color: STOCK_COLOR[key] }
}

export function StockBadge({
  locale,
  status,
  withDot = false,
}: {
  locale: Locale
  status?: string | null
  withDot?: boolean
}) {
  const s = stockInfo(locale, status)
  return (
    <span className="text-xs font-bold" style={{ color: s.color }}>
      {withDot ? '● ' : ''}
      {s.label}
    </span>
  )
}
