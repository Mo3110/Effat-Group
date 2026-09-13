'use client'

import { useActionState } from 'react'
import { submitQuote, type QuoteState } from './actions'
import type { Dict, Locale } from '@/i18n'

const initial: QuoteState = { ok: false }

export function QuoteForm({
  locale,
  t,
  category,
}: {
  locale: Locale
  t: Dict['quote']
  category?: string
}) {
  const [state, formAction, pending] = useActionState(submitQuote, initial)

  if (state.ok) {
    return (
      <div className="rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-10 text-center">
        <div className="text-2xl font-extrabold text-[var(--e-success)]">{t.successTitle}</div>
        <p className="mt-2 text-[var(--e-text-muted)]">
          {t.successBody}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      {category && <input type="hidden" name="category" value={category} />}

      <Field label={t.name} name="contactName" required />
      <Field label={t.phone} name="phone" required placeholder="01012345678" inputMode="tel" />
      <Field label={t.company} name="company" />
      <Field label={t.email} name="email" type="email" />

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">{t.governorate}</span>
        <select
          name="governorate"
          className="w-full rounded-[var(--e-radius)] border border-[var(--e-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--e-primary)]"
          defaultValue=""
        >
          <option value="">{t.chooseGovernorate}</option>
          {t.governorates.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm font-bold">{t.details}</span>
        <textarea
          name="message"
          rows={5}
          placeholder={t.detailsPlaceholder}
          className="w-full rounded-[var(--e-radius)] border border-[var(--e-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--e-primary)]"
        />
      </label>

      {state.error && (
        <p role="alert" className="sm:col-span-2 text-sm font-bold text-[var(--e-error)]">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--e-primary)] px-7 py-3 font-bold text-white disabled:opacity-60"
        >
          {pending ? t.sending : t.submit}
        </button>
        <p className="mt-3 text-xs text-[var(--e-text-muted)]">
          {t.privacy}
        </p>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  required,
  type = 'text',
  placeholder,
  inputMode,
}: {
  label: string
  name: string
  required?: boolean
  type?: string
  placeholder?: string
  inputMode?: 'tel' | 'text' | 'email'
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">
        {label}
        {required && <span className="text-[var(--e-urgent)]"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        dir={inputMode === 'tel' || type === 'email' ? 'ltr' : undefined}
        className="w-full rounded-[var(--e-radius)] border border-[var(--e-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--e-primary)]"
      />
    </label>
  )
}
