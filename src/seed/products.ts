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

    if (existing.docs.length) {
      await payload.update({ collection: 'products', id: existing.docs[0].id, data, locale: 'ar' })
      updated++
    } else {
      await payload.create({ collection: 'products', data, locale: 'ar' })
      created++
    }
  }

  payload.logger.info(`✅ products: ${created} created, ${updated} updated, ${skipped} skipped`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
