/** Shared formatting helpers. Extracted from six duplicated call sites. */

/** Egyptian VAT rate applied to displayed prices. */
export const VAT_RATE = 0.14

/**
 * Prices are stored VAT-inclusive, so this is the pre-VAT figure B2B buyers
 * need for their books.
 */
export const priceExVat = (grossEgp: number) => Math.round(grossEgp / (1 + VAT_RATE))

/** `1,750` — Latin digits, matching the `.num` class used for prices and SKUs. */
export const formatEGP = (n: number) => n.toLocaleString('en-EG')

/** `1,750 ج.م` */
export const formatEGPWithUnit = (n: number) => `${formatEGP(n)} ج.م`

/**
 * WhatsApp deep link with a prefilled Arabic message.
 *
 * Previously built inline in five places, four of which repeated the fallback
 * number and one (SiteFooter) hardcoded it entirely — so changing
 * NEXT_PUBLIC_WHATSAPP did not update the footer.
 */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '201060094777'

export function waLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
