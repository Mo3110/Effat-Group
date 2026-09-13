import Link from 'next/link'
import { FAMILIES } from '@/lib/families'
import { waLink } from '@/lib/format'
import { getDict, localePath, type Locale } from '@/i18n'
import { ShieldMark } from './SiteHeader'

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const p = (path: string) => localePath(locale, path)

  return (
    <footer className="mt-24 border-t border-[var(--e-border)] bg-[var(--e-blue-900)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldMark size={30} />
            <span dir="ltr" className="text-lg font-extrabold">Effat Group</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{t.footer.about}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-[var(--e-orange-400)]">{t.footer.sections}</h3>
          <ul className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
            {FAMILIES.map((f) => (
              <li key={f.key}>
                <Link href={p(`/c/${f.key}`)} className="hover:text-white">
                  {t.families[f.key].title}
                </Link>
              </li>
            ))}
            <li>
              <Link href={p('/services/extinguisher-refill')} className="hover:text-white">
                {t.footer.refill}
              </Link>
            </li>
            <li>
              <Link href={p('/services/maintenance-contract')} className="hover:text-white">
                {t.footer.contracts}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--e-orange-400)]">{t.footer.contact}</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>{t.footer.address}</li>
            <li>
              <a className="num hover:text-white" href="tel:+201060094777">
                +20 106 009 4777
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={waLink()}>
                {t.footer.whatsapp}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Effat Group — {t.footer.rights}
      </div>
    </footer>
  )
}
