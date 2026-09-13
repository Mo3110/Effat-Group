import type { Metadata } from 'next'
import { QuoteForm } from './QuoteForm'

export const metadata: Metadata = {
  title: 'اطلب عرض سعر',
  description:
    'اطلب عرض سعر لأنظمة مكافحة الحريق وإنذار الحريق وكاميرات المراقبة ومهمات الأمن الصناعي. رد خلال يوم عمل.',
}

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">اطلب عرض سعر</h1>
      <p className="mt-2 leading-relaxed text-[var(--e-text-muted)]">
        للأنظمة والمشاريع بنعمل تسعير هندسي حسب المواصفات والكميات. املأ البيانات وهنرجع لك خلال يوم
        عمل — أو ابعت لنا المقايسة على واتساب مباشرة.
      </p>

      <div className="mt-8 rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-6 sm:p-8">
        <QuoteForm category={category} />
      </div>
    </div>
  )
}
