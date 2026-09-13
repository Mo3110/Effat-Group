'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { STORY, ACT_DURATION } from '@/lib/story'

/**
 * Four-act photo hero, contained split layout.
 *
 * The photography is displayed at close to its NATIVE pixel size (~640px)
 * rather than stretched full-bleed. The source files are only 638-768px wide,
 * so a full-bleed hero blew them up 2-4x and made them visibly pixelated.
 * Displayed near 1:1 they are sharp. If higher-resolution originals arrive,
 * this layout scales up without any code change.
 *
 * All four images stay mounted and cross-fade, so there is no flash between
 * acts and no re-decode. The first is `priority` (the LCP element).
 */
export function HeroStory() {
  const [act, setAct] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) setPaused(true)
  }, [])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setAct((a) => (a + 1) % STORY.length), ACT_DURATION)
    return () => clearInterval(id)
  }, [paused, act])

  const current = STORY[act]

  return (
    <section
      className="relative overflow-hidden border-b border-[var(--e-border)] bg-gradient-to-b from-white to-[var(--e-steel-50)]"
      onMouseEnter={() => !reduced.current && setPaused(true)}
      onMouseLeave={() => !reduced.current && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => !reduced.current && setPaused(false)}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_640px] lg:py-16">
        {/* RTL: first column is the physical right — the copy side */}
        <div>
          <div key={current.key} className="act-in">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: current.color }}
            >
              {current.eyebrow}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
              {current.title}
            </h1>

            <p
              className="mt-4 max-w-lg leading-relaxed text-[var(--e-text-muted)]"
              aria-live="polite"
            >
              {current.body}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={current.href}
              className="rounded-full bg-[var(--e-primary)] px-6 py-3 font-bold text-white shadow-[var(--e-shadow)]"
            >
              {current.ctaLabel}
            </Link>
            <Link
              href="/quote"
              className="rounded-full border-2 border-[var(--e-primary)] px-6 py-3 font-bold text-[var(--e-primary)] transition-colors hover:bg-[var(--e-primary)] hover:text-white"
            >
              اطلب عرض سعر
            </Link>
          </div>

          <p className="mt-5 text-sm text-[var(--e-text-muted)]">
            توريد وتركيب وصيانة · اعتماد الدفاع المدني · الدفع عند الاستلام متاح
          </p>
        </div>

        {/* Image panel. `fit` is per-image: scene renders fill the frame, the
            product-family shots on white are contained so nothing is cropped. */}
        <div className="w-full">
          <div
            className="relative aspect-16/10 w-full overflow-hidden rounded-[var(--e-radius-lg)] shadow-[var(--e-shadow-lg)] ring-4 transition-colors duration-500"
            style={{
              ['--tw-ring-color' as string]: current.color,
              background: current.bg,
            }}
          >
            {STORY.map((s, i) => (
              <Image
                key={s.key}
                src={s.image}
                alt={i === act ? s.alt : ''}
                aria-hidden={i !== act}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 660px"
                className={s.fit === 'contain' ? 'object-contain p-3' : 'object-cover'}
                // Opacity is set inline, not via a class: Next/Image and
                // Tailwind's cascade layers made the class-driven rule lose,
                // leaving the wrong photo visible for the active act.
                style={{
                  opacity: i === act ? 1 : 0,
                  transition: 'opacity 700ms var(--e-ease)',
                }}
              />
            ))}
          </div>

          {/* Thumbnail strip — act switcher and category nav in one control */}
          <nav aria-label="أقسام" className="mt-3">
            <ul className="grid grid-cols-4 gap-2">
              {STORY.map((s, i) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => setAct(i)}
                    aria-current={i === act ? 'true' : undefined}
                    className="block w-full overflow-hidden rounded-[var(--e-radius)] border-2 bg-white text-start transition-all"
                    style={{
                      borderColor: i === act ? s.color : 'var(--e-border)',
                      opacity: i === act ? 1 : 0.75,
                    }}
                  >
                    <span
                      className="relative block aspect-4/3"
                      style={{ background: s.bg }}
                    >
                      <Image
                        src={s.thumb}
                        alt=""
                        fill
                        sizes="160px"
                        className={s.fit === 'contain' ? 'object-contain p-1' : 'object-cover'}
                      />
                    </span>
                    <span
                      className="block truncate px-2 py-1.5 text-[11px] font-bold"
                      style={{
                        background: i === act ? s.color : 'var(--e-steel-50)',
                        color: i === act ? '#fff' : 'var(--e-text-muted)',
                      }}
                    >
                      {s.chip}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div
              aria-hidden
              className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-[var(--e-steel-200)]"
            >
              <span
                key={`${act}-${paused}`}
                className="block h-full rounded-full"
                style={{
                  background: current.color,
                  animation: paused ? 'none' : `act-progress ${ACT_DURATION}ms linear forwards`,
                  width: paused ? '100%' : undefined,
                  opacity: paused ? 0.4 : 1,
                }}
              />
            </div>
          </nav>
        </div>
      </div>
    </section>
  )
}
