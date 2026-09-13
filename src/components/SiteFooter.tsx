import Link from 'next/link'
import { FAMILIES } from '@/lib/families'
import { waLink } from '@/lib/format'
import { ShieldMark } from './SiteHeader'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--e-border)] bg-[var(--e-blue-900)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldMark size={30} />
            <span dir="ltr" className="text-lg font-extrabold">Effat Group</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            توريد وتركيب وصيانة أنظمة الحريق والأمن ومهمات السلامة للمنشآت والمصانع والمباني.
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-[var(--e-orange-400)]">الأقسام</h3>
          <ul className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
            {FAMILIES.map((f) => (
              <li key={f.key}>
                <Link href={`/c/${f.key}`} className="hover:text-white">
                  {f.titleAr}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services/extinguisher-refill" className="hover:text-white">
                إعادة تعبئة الطفايات
              </Link>
            </li>
            <li>
              <Link href="/services/maintenance-contract" className="hover:text-white">
                عقود الصيانة السنوية
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--e-orange-400)]">تواصل معنا</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>مصر الجديدة، القاهرة</li>
            <li>
              <a className="num hover:text-white" href="tel:+201060094777">
                +20 106 009 4777
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={waLink()}>
                واتساب
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Effat Group — جميع الحقوق محفوظة
      </div>
    </footer>
  )
}
