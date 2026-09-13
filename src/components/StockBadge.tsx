/**
 * Single source of truth for stock labels and colours.
 *
 * Previously duplicated in the category and product pages with DIFFERENT
 * colours — the category page used design tokens, the product page used raw
 * hex — so the same status rendered differently on the two pages.
 */
const STOCK = {
  in_stock: { label: 'متوفر', color: 'var(--e-success)' },
  low: { label: 'كمية محدودة', color: 'var(--e-warning)' },
  on_order: { label: 'حسب الطلب', color: 'var(--e-text-muted)' },
  out: { label: 'غير متوفر', color: 'var(--e-error)' },
} as const

export type StockStatus = keyof typeof STOCK

export const stockInfo = (status?: string | null) =>
  STOCK[(status ?? 'in_stock') as StockStatus] ?? STOCK.in_stock

export function StockBadge({
  status,
  withDot = false,
}: {
  status?: string | null
  withDot?: boolean
}) {
  const s = stockInfo(status)
  return (
    <span className="text-xs font-bold" style={{ color: s.color }}>
      {withDot ? '● ' : ''}
      {s.label}
    </span>
  )
}
