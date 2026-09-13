/**
 * The four acts of the Effat story. Each act is a photograph and a route — so
 * the narrative and the navigation are the same object. All copy (eyebrow,
 * title, body, CTA, alt, chip) lives in the i18n dictionaries under
 * `hero.acts[key]`.
 *
 * `fit` matters: two of the images are scene renders that should fill the
 * frame, and two are product-family shots on white that must never be cropped.
 */
export const STORY = [
  {
    key: 'hall',
    href: '/c/fire-fighting',
    image: '/hero/hall.webp',
    thumb: '/hero/hall-thumb.webp',
    color: 'var(--e-cat-security)',
    fit: 'cover',
    bg: '#0d1f45',
  },
  {
    key: 'plant',
    href: '/c/fire-alarm',
    image: '/hero/plant-room.webp',
    thumb: '/hero/plant-room-thumb.webp',
    color: 'var(--e-cat-alarm)',
    fit: 'cover',
    bg: '#1b1416',
  },
  {
    key: 'equipment',
    href: '/c/fire-fighting',
    image: '/hero/equipment.webp',
    thumb: '/hero/equipment-thumb.webp',
    color: 'var(--e-cat-fire)',
    fit: 'contain',
    bg: '#ffffff',
  },
  {
    key: 'ppe',
    href: '/c/industrial-safety',
    image: '/hero/ppe.webp',
    thumb: '/hero/ppe-thumb.webp',
    color: 'var(--e-cat-ppe)',
    fit: 'contain',
    bg: '#ffffff',
  },
] as const

export type StoryAct = (typeof STORY)[number]
export type StoryKey = StoryAct['key']

/** Milliseconds each act holds before auto-advancing. */
export const ACT_DURATION = 6000
