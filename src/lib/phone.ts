/**
 * Normalises Egyptian numbers to E.164 (+201XXXXXXXXX).
 * Accepts 01X…, 1X…, 201X…, 00201X…, +201X… with any spacing or dashes,
 * and Eastern-Arabic numerals (٠١٢٣٤٥٦٧٨٩).
 * Returns null when the number is not a valid Egyptian mobile.
 */
export function normalizeEgyptPhone(input: string): string | null {
  if (!input) return null

  // Eastern-Arabic and Persian digits → ASCII
  const ascii = input.replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0)
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660
    return String(code - base)
  })

  let digits = ascii.replace(/\D/g, '')

  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('20')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = digits.slice(1)

  // Egyptian mobiles: 1 + [0125] + 8 digits
  if (!/^1[0125]\d{8}$/.test(digits)) return null

  return `+20${digits}`
}
