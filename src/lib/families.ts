/** The four product families. Colour coding matches design/tokens.css. */
export const FAMILIES = [
  {
    key: 'fire-fighting',
    family: 'fire',
    titleAr: 'مكافحة الحريق',
    titleEn: 'Fire Fighting',
    color: 'var(--e-cat-fire)',
    blurb: 'طفايات، بكرات وصناديق، حنفيات، رشاشات، طلمبات وأنظمة إطفاء تلقائي',
  },
  {
    key: 'fire-alarm',
    family: 'alarm',
    titleAr: 'إنذار الحريق',
    titleEn: 'Fire Alarm',
    color: 'var(--e-cat-alarm)',
    blurb: 'لوحات تقليدية ومعنونة، كواشف دخان وحرارة، كاسرات زجاج، صافرات وإضاءة طوارئ',
  },
  {
    key: 'security-systems',
    family: 'security',
    titleAr: 'الأمن والتيار الخفيف',
    titleEn: 'Security & Low Current',
    color: 'var(--e-cat-security)',
    blurb: 'كاميرات مراقبة، أجهزة تسجيل، بصمة وأنظمة دخول، بوابات وحواجز',
  },
  {
    key: 'industrial-safety',
    family: 'ppe',
    titleAr: 'الأمن الصناعي',
    titleEn: 'Industrial Safety',
    color: 'var(--e-cat-ppe)',
    blurb: 'خوذ ونظارات، قفازات وأفرولات، أحذية سلامة، سلامة الطرق، إسعافات أولية',
  },
] as const

export type FamilyKey = (typeof FAMILIES)[number]['key']
