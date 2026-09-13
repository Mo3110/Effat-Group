import { describe, expect, it } from 'vitest'
import { VAT_RATE, formatEGP, formatEGPWithUnit, priceExVat, waLink } from './format'

describe('price formatting', () => {
  it('groups thousands with Latin digits', () => {
    // Latin digits are deliberate: prices use the `.num` class so they stay
    // LTR and legible inside RTL text.
    expect(formatEGP(1750)).toBe('1,750')
    expect(formatEGP(850)).toBe('850')
    expect(formatEGP(1234567)).toBe('1,234,567')
  })

  it('appends the EGP unit', () => {
    expect(formatEGPWithUnit(3100)).toBe('3,100 ج.م')
  })

  it('handles zero', () => {
    expect(formatEGP(0)).toBe('0')
  })
})

describe('priceExVat', () => {
  it('removes VAT from a gross price', () => {
    expect(VAT_RATE).toBe(0.14)
    expect(priceExVat(1140)).toBe(1000)
    expect(priceExVat(850)).toBe(746)
  })

  it('round-trips within rounding tolerance', () => {
    for (const gross of [185, 850, 1750, 4200]) {
      const net = priceExVat(gross)
      expect(Math.abs(net * (1 + VAT_RATE) - gross)).toBeLessThan(1)
    }
  })
})

describe('waLink', () => {
  it('builds a bare link with no message', () => {
    expect(waLink()).toMatch(/^https:\/\/wa\.me\/\d+$/)
  })

  it('percent-encodes Arabic message text', () => {
    const link = waLink('السلام عليكم')
    expect(link).toContain('?text=')
    expect(link).not.toContain(' ')
    expect(decodeURIComponent(link.split('?text=')[1])).toBe('السلام عليكم')
  })
})
