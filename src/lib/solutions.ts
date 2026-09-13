/**
 * Sector bundles: "everything a <facility type> needs to pass inspection".
 *
 * Structural data only — which categories make up each bundle, in display
 * order. All copy (title, intro, compliance checklist, per-item notes) lives
 * in the i18n dictionaries under `solutions.sectors[key]`.
 *
 * Category slugs must exist in src/seed/taxonomy.json; the page skips any
 * that do not resolve so a taxonomy edit never breaks a solution page.
 */
export const SOLUTIONS = [
  {
    key: 'restaurant',
    color: 'var(--e-cat-fire)',
    image: '/hero/equipment.webp',
    categories: ['wet-chemical', 'dry-powder', 'co2', 'kitchen-hood', 'fire-blanket', 'smoke', 'exit-sign', 'first-aid-kit'],
  },
  {
    key: 'warehouse',
    color: 'var(--e-cat-alarm)',
    image: '/hero/plant-room.webp',
    categories: ['trolley', 'dry-powder', 'hose-reel', 'fire-cabinet', 'sprinkler-heads', 'beam', 'conventional-panel', 'bullet', 'hi-vis', 'fire-signs'],
  },
  {
    key: 'factory',
    color: 'var(--e-cat-ppe)',
    image: '/hero/ppe.webp',
    categories: ['fire-pumps', 'hydrants-valves', 'hose-reels-cabinets', 'addressable-panel', 'heat', 'flame', 'helmets', 'safety-boots', 'coveralls', 'gloves', 'eye-wash', 'first-aid-cabinet'],
  },
  {
    key: 'school',
    color: 'var(--e-cat-alarm)',
    image: '/hero/hall.webp',
    categories: ['dry-powder', 'water', 'hose-reel', 'conventional-panel', 'smoke', 'call-point', 'sounder', 'emergency-light', 'exit-sign', 'first-aid-kit', 'dome'],
  },
  {
    key: 'clinic',
    color: 'var(--e-cat-security)',
    image: '/hero/hall.webp',
    categories: ['co2', 'clean-agent', 'addressable-panel', 'smoke', 'sounder-strobe', 'emergency-light', 'exit-sign', 'fire-door', 'ip-camera', 'card-reader'],
  },
  {
    key: 'office',
    color: 'var(--e-cat-security)',
    image: '/hero/hall.webp',
    categories: ['dry-powder', 'co2', 'hose-reel', 'conventional-panel', 'smoke', 'call-point', 'exit-sign', 'dome', 'nvr', 'fingerprint', 'first-aid-kit'],
  },
  {
    key: 'datacenter',
    color: 'var(--e-cat-security)',
    image: '/hero/plant-room.webp',
    categories: ['fm200', 'novec', 'clean-agent', 'co2', 'aspirating', 'addressable-panel', 'sounder-strobe', 'face-recognition', 'ip-camera', 'thermal'],
  },
  {
    key: 'residential',
    color: 'var(--e-cat-fire)',
    image: '/hero/equipment.webp',
    categories: ['dry-powder', 'automatic-ball', 'fire-blanket', 'smoke', 'gas', 'intercom', 'wifi-camera', 'magnetic-contact', 'first-aid-kit'],
  },
] as const

export type SolutionKey = (typeof SOLUTIONS)[number]['key']

export const getSolution = (key: string) => SOLUTIONS.find((s) => s.key === key) ?? null
