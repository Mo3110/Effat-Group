/**
 * The four acts of the Effat story. Each act is a photograph, a headline and a
 * route — so the narrative and the navigation are the same object.
 *
 * `fit` matters: two of the images are scene renders that should fill the
 * frame, and two are product-family shots on white that must never be cropped.
 */
export const STORY = [
  {
    key: 'hall',
    eyebrow: 'تحت سقف واحد',
    title: 'مركز متكامل للحريق والأمن والسلامة',
    body: 'مكافحة الحريق، إنذار الحريق، أنظمة الأمن والمراقبة، ومهمات السلامة — من مورّد واحد، بعقد واحد، وضمان واحد.',
    ctaLabel: 'تصفّح كل الأقسام',
    href: '/c/fire-fighting',
    image: '/hero/hall.webp',
    thumb: '/hero/hall-thumb.webp',
    alt: 'مركز الأنظمة الأمنية ومكافحة الحريق والسلامة المتكاملة — تحت سقف واحد',
    color: 'var(--e-cat-security)',
    chip: 'المركز',
    fit: 'cover',
    bg: '#0d1f45',
  },
  {
    key: 'plant',
    eyebrow: 'الفصل الأول · الحماية',
    title: 'نحمي المبنى نفسه',
    body: 'شبكات ومواسير إطفاء، طلمبات حريق، لوحات إنذار معنونة وتقليدية، كواشف دخان وحرارة — تصميم وتوريد وتركيب بمعايير الدفاع المدني.',
    ctaLabel: 'تصفّح إنذار ومكافحة الحريق',
    href: '/c/fire-alarm',
    image: '/hero/plant-room.webp',
    thumb: '/hero/plant-room-thumb.webp',
    alt: 'غرفة مضخات حريق وشبكة مواسير حمراء ولوحات إنذار حريق',
    color: 'var(--e-cat-alarm)',
    chip: 'الإنذار والإطفاء',
    fit: 'cover',
    bg: '#1b1416',
  },
  {
    key: 'equipment',
    eyebrow: 'الفصل الثاني · المعدات',
    title: 'كل معدات الحريق في مكان واحد',
    body: 'طفايات بكل الأنواع، بكرات وصناديق خراطيم، حنفيات ومحابس، وصلات وكوبلن نحاس — بأسعار معلنة وتوصيل لكل محافظات مصر.',
    ctaLabel: 'تصفّح مكافحة الحريق',
    href: '/c/fire-fighting',
    image: '/hero/equipment.webp',
    thumb: '/hero/equipment-thumb.webp',
    alt: 'مجموعة معدات مكافحة الحريق: حنفيات، بكرات خراطيم، صناديق حريق، طفايات ومحابس',
    color: 'var(--e-cat-fire)',
    chip: 'مكافحة الحريق',
    fit: 'contain',
    bg: '#ffffff',
  },
  {
    key: 'ppe',
    eyebrow: 'الفصل الثالث · الناس',
    title: 'وبنحمي فريقك كمان',
    body: 'أفرولات وبدل عمل، أحذية سلامة، خوذ وقفازات ونظارات — ستوك متوفر دائماً، شحن سريع لكل المحافظات، وأفضل جودة بأقل سعر.',
    ctaLabel: 'تصفّح الأمن الصناعي',
    href: '/c/industrial-safety',
    image: '/hero/ppe.webp',
    thumb: '/hero/ppe-thumb.webp',
    alt: 'مهمات الأمن الصناعي: أفرولات وأحذية سلامة وخوذ وقفازات ونظارات واقية',
    color: 'var(--e-cat-ppe)',
    chip: 'الأمن الصناعي',
    fit: 'contain',
    bg: '#ffffff',
  },
] as const

export type StoryAct = (typeof STORY)[number]

/** Milliseconds each act holds before auto-advancing. */
export const ACT_DURATION = 6000
