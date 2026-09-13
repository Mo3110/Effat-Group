/**
 * The four product families. Colour coding matches design/tokens.css.
 * Titles and blurbs live in the i18n dictionaries under `families[key]`.
 */
export const FAMILIES = [
  { key: 'fire-fighting', family: 'fire', color: 'var(--e-cat-fire)' },
  { key: 'fire-alarm', family: 'alarm', color: 'var(--e-cat-alarm)' },
  { key: 'security-systems', family: 'security', color: 'var(--e-cat-security)' },
  { key: 'industrial-safety', family: 'ppe', color: 'var(--e-cat-ppe)' },
] as const

export type FamilyKey = (typeof FAMILIES)[number]['key']
