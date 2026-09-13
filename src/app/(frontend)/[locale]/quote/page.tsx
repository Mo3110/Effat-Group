import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { QuoteForm } from './QuoteForm'
import { getDict, isLocale } from '@/i18n'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDict(locale)
  return { title: t.quote.title, description: t.quote.description }
}

export default async function QuotePage({ params, searchParams }: Args) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const { category } = await searchParams

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t.quote.title}</h1>
      <p className="mt-2 leading-relaxed text-[var(--e-text-muted)]">
        {t.quote.intro}
      </p>

      <div className="mt-8 rounded-[var(--e-radius-lg)] border border-[var(--e-border)] bg-white p-6 sm:p-8">
        <QuoteForm locale={locale} t={t.quote} category={category} />
      </div>
    </div>
  )
}
