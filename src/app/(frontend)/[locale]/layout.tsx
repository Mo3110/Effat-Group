import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Cairo, Inter } from 'next/font/google'
import '../styles.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFab } from '@/components/WhatsAppFab'
import { dir, getDict, isLocale, locales } from '@/i18n'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

type Params = Promise<{ locale: string }>

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDict(locale)
  const other = locale === 'ar' ? 'en' : 'ar'
  return {
    title: { default: t.meta.title, template: t.meta.template },
    description: t.meta.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: `/${locale}`,
      languages: { [locale]: `/${locale}`, [other]: `/${other}` },
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale} dir={dir(locale)} className={`${cairo.variable} ${inter.variable}`}>
      <body>
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
        <WhatsAppFab locale={locale} />
      </body>
    </html>
  )
}
