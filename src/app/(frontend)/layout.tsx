import React from 'react'
import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import './styles.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFab } from '@/components/WhatsAppFab'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Effat Group — أنظمة الحريق والأمن ومهمات السلامة',
    template: '%s | Effat Group',
  },
  description:
    'توريد وتركيب وصيانة أنظمة مكافحة الحريق وإنذار الحريق وكاميرات المراقبة ومهمات الأمن الصناعي. أسعار معلنة على المستهلكات، وعروض هندسية للأنظمة. مصر الجديدة، القاهرة.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsAppFab />
      </body>
    </html>
  )
}
