'use server'

import { headers } from 'next/headers'
import { getClient } from '@/lib/payload'
import { normalizeEgyptPhone } from '@/lib/phone'

export type QuoteState = { ok: boolean; error?: string }

/** Field caps mirror the maxLength values on the Quotes collection. */
const LIMITS = {
  contactName: 100,
  company: 120,
  email: 160,
  governorate: 60,
  message: 2000,
} as const

/**
 * Per-IP submission throttle.
 *
 * Deliberately in-memory: it resets on restart and is per-instance, so it is a
 * speed bump against casual spam, NOT real abuse protection. Move to Redis or
 * a WAF rule before launch if submissions get attacked.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    }
  }

  return recent.length > MAX_PER_WINDOW
}

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? '')
    .trim()
    .slice(0, max)

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'

  if (rateLimited(ip)) {
    return { ok: false, error: 'طلبات كتير في وقت قصير. استنى شوية وحاول تاني.' }
  }

  const contactName = clean(formData.get('contactName'), LIMITS.contactName)
  const rawPhone = clean(formData.get('phone'), 40)
  const company = clean(formData.get('company'), LIMITS.company)
  const email = clean(formData.get('email'), LIMITS.email)
  const governorate = clean(formData.get('governorate'), LIMITS.governorate)
  const message = clean(formData.get('message'), LIMITS.message)

  if (!contactName) return { ok: false, error: 'من فضلك اكتب اسمك.' }

  const phone = normalizeEgyptPhone(rawPhone)
  if (!phone) return { ok: false, error: 'رقم الموبايل غير صحيح. مثال: 01012345678' }

  // Payload's email field rejects malformed values, but catching it here gives
  // the user an Arabic message instead of a generic failure.
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: 'البريد الإلكتروني غير صحيح.' }
  }

  try {
    const payload = await getClient()
    await payload.create({
      collection: 'quotes',
      data: {
        contactName,
        phone,
        company: company || undefined,
        email: email || undefined,
        governorate: governorate || undefined,
        message: message || undefined,
        status: 'new',
        source: 'website',
      },
    })
    return { ok: true }
  } catch (err) {
    // Logged server-side only; the user gets a generic message so internal
    // details never reach the browser.
    console.error('quote submit failed', err)
    return { ok: false, error: 'حصلت مشكلة أثناء الإرسال. جرّب تاني أو كلّمنا على واتساب.' }
  }
}
