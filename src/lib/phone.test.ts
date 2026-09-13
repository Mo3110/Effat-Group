import { describe, expect, it } from 'vitest'
import { normalizeEgyptPhone } from './phone'

/**
 * Guards the RFQ form's only hard validation. A regression here silently
 * rejects real customers or lets junk into the sales pipeline.
 */
describe('normalizeEgyptPhone', () => {
  describe('accepted formats', () => {
    it.each([
      ['01012345678', '+201012345678'], // local, leading 0
      ['1012345678', '+201012345678'], // no leading 0
      ['+201012345678', '+201012345678'], // already E.164
      ['201012345678', '+201012345678'], // country code, no plus
      ['00201012345678', '+201012345678'], // international prefix
    ])('%s → %s', (input, expected) => {
      expect(normalizeEgyptPhone(input)).toBe(expected)
    })

    it('accepts every valid Egyptian mobile prefix (010/011/012/015)', () => {
      for (const p of ['010', '011', '012', '015']) {
        expect(normalizeEgyptPhone(`${p}12345678`)).toBe(`+20${p.slice(1)}12345678`)
      }
    })

    it('strips spaces, dashes and parentheses', () => {
      expect(normalizeEgyptPhone(' 010 1234 5678 ')).toBe('+201012345678')
      expect(normalizeEgyptPhone('010-1234-5678')).toBe('+201012345678')
      expect(normalizeEgyptPhone('(010) 1234 5678')).toBe('+201012345678')
    })

    it('converts Eastern-Arabic numerals', () => {
      // This is what an Arabic keyboard actually produces.
      expect(normalizeEgyptPhone('٠١٠١٢٣٤٥٦٧٨')).toBe('+201012345678')
    })

    it('converts Persian numerals', () => {
      expect(normalizeEgyptPhone('۰۱۰۱۲۳۴۵۶۷۸')).toBe('+201012345678')
    })
  })

  describe('rejected input', () => {
    it.each([
      ['', 'empty'],
      ['   ', 'whitespace only'],
      ['0101234567', 'too short'],
      ['010123456789', 'too long'],
      ['01312345678', 'invalid prefix 013'],
      ['01412345678', 'invalid prefix 014'],
      ['0221234567', 'landline, not mobile'],
      ['abcdefghijk', 'letters'],
      ['+441234567890', 'non-Egyptian country code'],
    ])('rejects %s (%s)', (input) => {
      expect(normalizeEgyptPhone(input)).toBeNull()
    })
  })

  it('is idempotent — normalising twice changes nothing', () => {
    const once = normalizeEgyptPhone('01012345678')
    expect(once).not.toBeNull()
    expect(normalizeEgyptPhone(once!)).toBe(once)
  })
})
