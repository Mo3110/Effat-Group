import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'ماركة', plural: 'الماركات' },
  access: { read: () => true },
  admin: { useAsTitle: 'title', group: 'الكتالوج' },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'الاسم' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'الشعار' },
    {
      name: 'origin',
      type: 'select',
      label: 'بلد المنشأ',
      options: ['مصري', 'إيطالي', 'ألماني', 'صيني', 'إسباني', 'تركي', 'أمريكي', 'بريطاني'].map(
        (v) => ({ label: v, value: v }),
      ),
    },
    {
      name: 'authorized',
      type: 'checkbox',
      defaultValue: false,
      label: 'وكيل معتمد',
      admin: { description: 'يظهر شارة "وكيل معتمد" على صفحات المنتج' },
    },
  ],
}
