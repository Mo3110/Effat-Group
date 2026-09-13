/**
 * Sample product catalogue.
 *
 * Prices are PLACEHOLDERS for layout and flow testing — replace with the real
 * price list before launch. Images are cropped from the client's own equipment
 * and PPE photography; swap for proper per-SKU shots when available.
 *
 *   npm run seed:products
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import type { Product } from '../payload-types.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(dirname, '../../public')

type Spec = { key: string; value: string }

type SeedProduct = {
  slug: string
  sku: string
  title: string
  category: string // category slug
  shortDescription: string
  image: string // file under public/products
  saleMode: 'cart' | 'quote' | 'hybrid'
  price?: number
  compareAtPrice?: number
  stockStatus: 'in_stock' | 'low' | 'on_order' | 'out'
  certifications?: NonNullable<Product['certifications']>
  warrantyMonths?: number
  refillDueMonths?: number
  specs: Spec[]
  /** English copy, written to the `en` locale after the Arabic pass. */
  en: { title: string; shortDescription: string; specs: Spec[] }
}

const PRODUCTS: SeedProduct[] = [
  {
    slug: 'extinguisher-powder-6kg',
    sku: 'EX-PWD-6',
    title: 'طفاية حريق بودرة جافة 6 كجم',
    category: 'dry-powder',
    shortDescription:
      'طفاية بودرة جافة ABC بضغط مخزّن، مناسبة للمكاتب والمحلات والسيارات. تشمل الحامل والمانومتر.',
    image: 'extinguishers.webp',
    saleMode: 'cart',
    price: 850,
    compareAtPrice: 980,
    stockStatus: 'in_stock',
    certifications: ['الدفاع المدني', 'EN3'],
    warrantyMonths: 12,
    refillDueMonths: 12,
    specs: [
      { key: 'نوع المادة', value: 'بودرة جافة ABC 40%' },
      { key: 'السعة', value: '6 كجم' },
      { key: 'فئات الحريق', value: 'A · B · C' },
      { key: 'ضغط التشغيل', value: '15 بار' },
      { key: 'زمن التفريغ', value: '13 ثانية تقريباً' },
      { key: 'التركيب', value: 'حائط (حامل مرفق)' },
    ],
    en: {
      title: '6 kg Dry Powder Fire Extinguisher',
      shortDescription:
        'ABC dry-powder extinguisher for class A, B and C fires — the standard unit for offices, shops, warehouses and vehicles. Supplied with wall bracket and a Civil Defense inspection tag.',
      specs: [
        { key: 'Agent', value: 'ABC dry powder 40%' },
        { key: 'Capacity', value: '6 kg' },
        { key: 'Fire classes', value: 'A · B · C' },
        { key: 'Working pressure', value: '15 bar' },
        { key: 'Discharge time', value: 'approx. 13 s' },
        { key: 'Mounting', value: 'Wall (bracket included)' },
      ],
    },
  },
  {
    slug: 'extinguisher-co2-5kg',
    sku: 'EX-CO2-5',
    title: 'طفاية حريق ثاني أكسيد الكربون 5 كجم',
    category: 'co2',
    shortDescription:
      'طفاية CO₂ بقرن تفريغ، مثالية للوحات الكهرباء وغرف السيرفرات — لا تترك أي أثر بعد الإطفاء.',
    image: 'extinguishers.webp',
    saleMode: 'cart',
    price: 1750,
    stockStatus: 'in_stock',
    certifications: ['الدفاع المدني', 'EN3'],
    warrantyMonths: 12,
    refillDueMonths: 12,
    specs: [
      { key: 'نوع المادة', value: 'ثاني أكسيد الكربون CO₂' },
      { key: 'السعة', value: '5 كجم' },
      { key: 'فئات الحريق', value: 'B · كهرباء' },
      { key: 'الأسطوانة', value: 'صلب بدون لحام' },
      { key: 'القرن', value: 'بلاستيك عازل مانع للتجمد' },
    ],
    en: {
      title: '5 kg CO₂ Fire Extinguisher',
      shortDescription:
        'Carbon-dioxide extinguisher for electrical and flammable-liquid fires. Leaves no residue, so it is the right choice for server rooms, panels and kitchens.',
      specs: [
        { key: 'Agent', value: 'Carbon dioxide CO₂' },
        { key: 'Capacity', value: '5 kg' },
        { key: 'Fire classes', value: 'B · Electrical' },
        { key: 'Cylinder', value: 'Seamless steel' },
        { key: 'Horn', value: 'Insulated, frost-free plastic' },
      ],
    },
  },
  {
    slug: 'hose-reel-25m',
    sku: 'HR-25',
    title: 'بكرة خرطوم حريق 25 متر',
    category: 'hose-reel',
    shortDescription:
      'بكرة دوّارة بخرطوم مطاطي 25 متر وقاذف ثلاثي الأوضاع، تركيب حائط أو داخل صندوق حريق.',
    image: 'hose-reel.webp',
    saleMode: 'hybrid',
    price: 4200,
    stockStatus: 'in_stock',
    certifications: ['الدفاع المدني'],
    warrantyMonths: 12,
    specs: [
      { key: 'طول الخرطوم', value: '25 متر' },
      { key: 'قطر الخرطوم', value: '¾ بوصة' },
      { key: 'قطر البكرة', value: '½ بوصة مدخل' },
      { key: 'القاذف', value: '3 أوضاع (رذاذ / مستقيم / غلق)' },
      { key: 'ضغط التشغيل', value: '12 بار' },
    ],
    en: {
      title: '25 m Fire Hose Reel',
      shortDescription:
        'Swinging fire hose reel with a 25 m semi-rigid hose and three-position nozzle. Fits fire cabinets or mounts directly to the wall.',
      specs: [
        { key: 'Hose length', value: '25 m' },
        { key: 'Hose diameter', value: '¾ in' },
        { key: 'Inlet', value: '½ in' },
        { key: 'Nozzle', value: '3-position (spray / jet / shut-off)' },
        { key: 'Working pressure', value: '12 bar' },
      ],
    },
  },
  {
    slug: 'fire-cabinet-single',
    sku: 'FC-S1',
    title: 'صندوق حريق باب واحد',
    category: 'fire-cabinet',
    shortDescription:
      'صندوق صاج مدهون إلكتروستاتيك أحمر بباب زجاجي، يتسع لبكرة خرطوم ومحبس وطفاية.',
    image: 'fire-cabinet.webp',
    saleMode: 'hybrid',
    price: 3100,
    stockStatus: 'low',
    certifications: ['الدفاع المدني'],
    warrantyMonths: 12,
    specs: [
      { key: 'الخامة', value: 'صاج 1.2 مم' },
      { key: 'الدهان', value: 'إلكتروستاتيك أحمر' },
      { key: 'الباب', value: 'زجاج سيكوريت مع قفل' },
      { key: 'التركيب', value: 'غاطس أو بارز' },
    ],
    en: {
      title: 'Single-Door Fire Cabinet',
      shortDescription:
        'Powder-coated steel fire cabinet with a tempered-glass door and lock. Houses a hose reel, extinguisher and landing valve in one recessed or surface-mounted unit.',
      specs: [
        { key: 'Material', value: '1.2 mm steel sheet' },
        { key: 'Finish', value: 'Red electrostatic powder coat' },
        { key: 'Door', value: 'Tempered glass with lock' },
        { key: 'Mounting', value: 'Recessed or surface' },
      ],
    },
  },
  {
    slug: 'pillar-hydrant',
    sku: 'HYD-P',
    title: 'حنفية حريق خارجية (Pillar Hydrant)',
    category: 'pillar-hydrant',
    shortDescription:
      'حنفية حريق خارجية من الحديد الزهر بمخرجين، للشبكات الخارجية والمصانع والمجمعات السكنية.',
    image: 'hydrant.webp',
    saleMode: 'quote',
    stockStatus: 'on_order',
    certifications: ['الدفاع المدني', 'UL'],
    specs: [
      { key: 'الخامة', value: 'حديد زهر' },
      { key: 'المخارج', value: '2 × 2½ بوصة' },
      { key: 'المدخل', value: '4 بوصة فلانشة' },
      { key: 'ضغط التشغيل', value: '16 بار' },
    ],
    en: {
      title: 'Pillar Hydrant',
      shortDescription:
        'Cast-iron outdoor pillar hydrant with two 2½ in outlets for fire-brigade connection. Supplied with caps and chains, tested to 16 bar.',
      specs: [
        { key: 'Material', value: 'Cast iron' },
        { key: 'Outlets', value: '2 × 2½ in' },
        { key: 'Inlet', value: '4 in flanged' },
        { key: 'Working pressure', value: '16 bar' },
      ],
    },
  },
  {
    slug: 'fire-hose-15',
    sku: 'FH-15-30',
    title: 'خرطوم حريق 1.5 بوصة × 30 متر',
    category: 'fire-hose',
    shortDescription: 'خرطوم حريق مبطن بالمطاط مع كوبلن معدني على الطرفين، جاهز للتركيب.',
    image: 'fire-hose.webp',
    saleMode: 'cart',
    price: 2400,
    stockStatus: 'in_stock',
    warrantyMonths: 12,
    specs: [
      { key: 'القطر', value: '1.5 بوصة' },
      { key: 'الطول', value: '30 متر' },
      { key: 'البطانة', value: 'مطاط EPDM' },
      { key: 'ضغط الانفجار', value: '40 بار' },
      { key: 'الكوبلن', value: 'ألومنيوم مطروق' },
    ],
    en: {
      title: '1.5 in × 30 m Fire Hose',
      shortDescription:
        'Rubber-lined fire hose with metal couplings on both ends, ready to connect.',
      specs: [
        { key: 'Diameter', value: '1.5 in' },
        { key: 'Length', value: '30 m' },
        { key: 'Lining', value: 'EPDM rubber' },
        { key: 'Burst pressure', value: '40 bar' },
        { key: 'Couplings', value: 'Forged aluminium' },
      ],
    },
  },
  {
    slug: 'couplings-set',
    sku: 'CPL-SET',
    title: 'وصلات وكوبلن نحاس للحريق',
    category: 'couplings',
    shortDescription:
      'تشكيلة وصلات وكوبلن نحاس وألومنيوم بمقاسات مختلفة للشبكات وخراطيم الحريق.',
    image: 'couplings.webp',
    saleMode: 'quote',
    stockStatus: 'in_stock',
    specs: [
      { key: 'المقاسات', value: '1½ · 2 · 2½ بوصة' },
      { key: 'الخامة', value: 'نحاس / ألومنيوم مطروق' },
      { key: 'النوع', value: 'سريع الفك والتركيب' },
    ],
    en: {
      title: 'Brass Fire Hose Couplings & Adaptors',
      shortDescription:
        'Quick-release instantaneous couplings and adaptors in brass and forged aluminium, matching Egyptian fire-brigade standards.',
      specs: [
        { key: 'Sizes', value: '1½ · 2 · 2½ in' },
        { key: 'Material', value: 'Brass / forged aluminium' },
        { key: 'Type', value: 'Quick-release' },
      ],
    },
  },
  {
    slug: 'addressable-alarm-panel',
    sku: 'AL-ADR-2L',
    title: 'لوحة إنذار حريق معنونة 2 لوب',
    category: 'addressable-panel',
    shortDescription:
      'لوحة إنذار حريق معنونة بشاشة LCD عربي، تتحمل حتى 250 عنوان لكل لوب مع بطاريات احتياطية.',
    image: 'alarm-panel.webp',
    saleMode: 'quote',
    stockStatus: 'on_order',
    certifications: ['الدفاع المدني', 'EN3', 'UL'],
    warrantyMonths: 24,
    specs: [
      { key: 'عدد اللوبات', value: '2' },
      { key: 'السعة', value: '250 عنوان / لوب' },
      { key: 'الشاشة', value: 'LCD عربي / إنجليزي' },
      { key: 'التغذية', value: '220 فولت + بطاريات 24 فولت' },
      { key: 'المخارج', value: 'ريليهات قابلة للبرمجة' },
    ],
    en: {
      title: '2-Loop Addressable Fire Alarm Panel',
      shortDescription:
        'Addressable fire alarm control panel with two loops and up to 500 devices. Arabic/English LCD, programmable relays, and battery back-up. Supplied, programmed and commissioned by our engineers.',
      specs: [
        { key: 'Loops', value: '2' },
        { key: 'Capacity', value: '250 addresses per loop' },
        { key: 'Display', value: 'LCD Arabic / English' },
        { key: 'Power', value: '220 V + 24 V batteries' },
        { key: 'Outputs', value: 'Programmable relays' },
      ],
    },
  },
  {
    slug: 'safety-boots-steel-toe',
    sku: 'PPE-BOOT-ST',
    title: 'حذاء أمان بمقدمة حديد',
    category: 'safety-shoes',
    shortDescription:
      'حذاء أمان جلد طبيعي بمقدمة حديد ونعل مقاوم للانزلاق والزيوت — مقاسات 39 إلى 46.',
    image: 'safety-boots.webp',
    saleMode: 'cart',
    price: 980,
    compareAtPrice: 1150,
    stockStatus: 'in_stock',
    certifications: ['CE'],
    warrantyMonths: 6,
    specs: [
      { key: 'المقدمة', value: 'حديد 200 جول' },
      { key: 'النعل', value: 'PU مزدوج مقاوم للانزلاق' },
      { key: 'الوجه', value: 'جلد طبيعي' },
      { key: 'المقاسات', value: '39 – 46' },
    ],
    en: {
      title: 'Steel-Toe Safety Boots',
      shortDescription:
        'Full-grain leather safety boot with a 200 J steel toe cap and anti-slip dual-density PU sole. Sizes 39–46, always in stock.',
      specs: [
        { key: 'Toe cap', value: 'Steel, 200 J' },
        { key: 'Sole', value: 'Dual-density anti-slip PU' },
        { key: 'Upper', value: 'Full-grain leather' },
        { key: 'Sizes', value: '39 – 46' },
      ],
    },
  },
  {
    slug: 'safety-helmet',
    sku: 'PPE-HLM',
    title: 'خوذة أمان صناعي',
    category: 'helmets',
    shortDescription:
      'خوذة HDPE بسير رأس قابل للضبط 6 نقاط، متوفرة بألوان متعددة لتمييز الفرق.',
    image: 'helmet-gloves.webp',
    saleMode: 'cart',
    price: 185,
    stockStatus: 'in_stock',
    certifications: ['CE'],
    specs: [
      { key: 'الخامة', value: 'HDPE' },
      { key: 'سير الرأس', value: '6 نقاط قابل للضبط' },
      { key: 'الألوان', value: 'أصفر · أبيض · أحمر · أزرق · أخضر' },
    ],
    en: {
      title: 'Industrial Safety Helmet',
      shortDescription:
        'HDPE safety helmet with a six-point adjustable harness, in five colours for site colour-coding.',
      specs: [
        { key: 'Material', value: 'HDPE' },
        { key: 'Harness', value: '6-point adjustable' },
        { key: 'Colours', value: 'Yellow · White · Red · Blue · Green' },
      ],
    },
  },
  {
    slug: 'work-coverall',
    sku: 'PPE-COV',
    title: 'أفرول عمل بشرائط عاكسة',
    category: 'coveralls',
    shortDescription:
      'أفرول قطن بوليستر بشرائط عاكسة، مقاس من S إلى XXL، متاح بالكميات للمصانع.',
    image: 'coverall.webp',
    saleMode: 'hybrid',
    price: 640,
    stockStatus: 'in_stock',
    warrantyMonths: 0,
    specs: [
      { key: 'الخامة', value: 'قطن / بوليستر 65-35' },
      { key: 'الشرائط', value: 'عاكسة على الصدر والأكمام والساقين' },
      { key: 'المقاسات', value: 'S · M · L · XL · XXL' },
      { key: 'الألوان', value: 'كحلي · أزرق · رمادي' },
    ],
    en: {
      title: 'Work Coverall with Reflective Tape',
      shortDescription:
        'Poly-cotton work coverall with reflective tape on chest, sleeves and legs. Sizes S–XXL, custom logo printing available for volume orders.',
      specs: [
        { key: 'Fabric', value: '65/35 polyester-cotton' },
        { key: 'Tape', value: 'Reflective on chest, sleeves and legs' },
        { key: 'Sizes', value: 'S · M · L · XL · XXL' },
        { key: 'Colours', value: 'Navy · Blue · Grey' },
      ],
    },
  },
  {
    slug: 'safety-gloves-leather',
    sku: 'PPE-GLV-L',
    title: 'قفازات جلد للحام والأعمال الثقيلة',
    category: 'gloves',
    shortDescription: 'قفاز جلد طبيعي بكفّ مبطّن ومقاومة للحرارة، مناسب لأعمال اللحام والورش.',
    image: 'helmet-gloves.webp',
    saleMode: 'cart',
    price: 145,
    stockStatus: 'in_stock',
    specs: [
      { key: 'الخامة', value: 'جلد طبيعي' },
      { key: 'الطول', value: '35 سم' },
      { key: 'الاستخدام', value: 'لحام · ورش · أعمال ثقيلة' },
    ],
    en: {
      title: 'Leather Welding & Heavy-Duty Gloves',
      shortDescription:
        'Full-grain leather glove with a lined, heat-resistant palm for welding and workshop use.',
      specs: [
        { key: 'Material', value: 'Full-grain leather' },
        { key: 'Length', value: '35 cm' },
        { key: 'Use', value: 'Welding · Workshops · Heavy duty' },
      ],
    },
  },
]

async function main() {
  const payload = await getPayload({ config })

  // Reuse one Media doc per image file
  const mediaCache = new Map<string, number>()

  async function uploadImage(file: string, alt: string): Promise<number> {
    if (mediaCache.has(file)) return mediaCache.get(file)!

    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: file } },
      limit: 1,
    })
    if (existing.docs.length) {
      mediaCache.set(file, existing.docs[0].id)
      return existing.docs[0].id
    }

    const filePath = path.join(PUBLIC, 'products', file)
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath,
      locale: 'ar',
    })
    mediaCache.set(file, doc.id)
    return doc.id
  }

  let created = 0
  let updated = 0
  let skipped = 0

  for (const p of PRODUCTS) {
    const cat = await payload.find({
      collection: 'categories',
      where: { slug: { equals: p.category } },
      limit: 1,
      locale: 'ar',
    })
    if (!cat.docs.length) {
      payload.logger.warn(`category "${p.category}" not found — skipping ${p.slug}`)
      skipped++
      continue
    }

    const imageId = await uploadImage(p.image, p.title)

    const data = {
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      category: cat.docs[0].id,
      shortDescription: p.shortDescription,
      gallery: [imageId],
      saleMode: p.saleMode,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stockStatus: p.stockStatus,
      certifications: p.certifications,
      warrantyMonths: p.warrantyMonths,
      refillDueMonths: p.refillDueMonths,
      specs: p.specs,
      metaTitle: p.title,
      metaDescription: p.shortDescription,
    }

    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    let id: number | string
    if (existing.docs.length) {
      id = existing.docs[0].id
      await payload.update({ collection: 'products', id, data, locale: 'ar' })
      updated++
    } else {
      id = (await payload.create({ collection: 'products', data, locale: 'ar' })).id
      created++
    }

    // Second pass writes only the localized fields to `en`; everything else
    // (price, stock, gallery…) is shared and was set above.
    await payload.update({
      collection: 'products',
      id,
      locale: 'en',
      data: {
        title: p.en.title,
        shortDescription: p.en.shortDescription,
        specs: p.en.specs,
        metaTitle: p.en.title,
        metaDescription: p.en.shortDescription,
      },
    })
  }

  payload.logger.info(`✅ products: ${created} created, ${updated} updated, ${skipped} skipped`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
