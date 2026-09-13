import Link from 'next/link'

/** Bilingual on purpose: this can render before the locale segment resolves. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="num text-6xl font-extrabold text-[var(--e-blue-500)]">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">الصفحة غير موجودة · Page not found</h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/ar" className="rounded-full bg-[var(--e-primary)] px-6 py-3 font-bold text-white">
          الرئيسية
        </Link>
        <Link href="/en" className="rounded-full border-2 border-[var(--e-primary)] px-6 py-3 font-bold text-[var(--e-primary)]">
          Home
        </Link>
      </div>
    </div>
  )
}
