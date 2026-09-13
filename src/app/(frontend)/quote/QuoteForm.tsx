'use client'

import { useActionState } from 'react'
import { submitQuote, type QuoteState } from './actions'

const GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'القليوبية',
  'الإسكندرية',
  'الشرقية',
  'الدقهلية',
  'الغربية',
  'المنوفية',
  'البحيرة',
  'بورسعيد',
  'السويس',
  'الإسماعيلية',
  'أسيوط',
  'المنيا',
  'سوهاج',
  'أسوان',
  'الأقصر',
  'البحر الأحمر',
  'مطروح',
  'شمال سيناء',
  'جنوب سيناء',
  'أخرى',
]

const initial: QuoteState = { ok: false }

export function QuoteForm({ category }: { category?: string }) {
  const [state, formAction, pending] = useActionState(submitQuote, initial)

  if (state.ok) {
    return (
      <div className="rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-10 text-center">
        <div className="text-2xl font-extrabold text-[var(--e-success)]">تم استلام طلبك ✅</div>
        <p className="mt-2 text-[var(--e-text-muted)]">
          هنراجع الطلب ونرجع لك بعرض السعر خلال يوم عمل. لو مستعجل، كلّمنا على واتساب.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      {category && <input type="hidden" name="category" value={category} />}

      <Field label="الاسم" name="contactName" required />
      <Field label="رقم الموبايل" name="phone" required placeholder="01012345678" inputMode="tel" />
      <Field label="الشركة / المنشأة" name="company" />
      <Field label="البريد الإلكتروني" name="email" type="email" />

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">المحافظة</span>
        <select
          name="governorate"
          className="w-full rounded-[var(--e-radius)] border border-[var(--e-border)] bg-white px-3 py-2.5 outline-none focus:border-[var(--e-primary)]"
          defaultValue=""
        >
          <option value="">اختر المحافظة</option>
          {GOVERNORATES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-sm font-bold">تفاصيل الطلب</span>
        <textarea
          name="message"
          rows={5}
          placeholder="اكتب الأصناف والكميات، ونوع المنشأة، وأي تفاصيل تساعدنا نسعّر بدقة."
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
          {pending ? 'جاري الإرسال…' : 'إرسال الطلب'}
        </button>
        <p className="mt-3 text-xs text-[var(--e-text-muted)]">
          ببيانات التواصل دي بنرجع لك بعرض السعر بس — مش بنستخدمها في أي حاجة تانية.
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
