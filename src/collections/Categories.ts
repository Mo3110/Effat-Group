import type { CollectionConfig } from 'payload'

/**
 * Nested category tree, seeded from catalog/taxonomy.json.
 * `family` drives the colour coding defined in design/tokens.css.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'قسم', plural: 'الأقسام' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'family', 'saleMode', 'slug'],
    group: 'الكتالوج',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'الاسم' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'الرابط',
      admin: { position: 'sidebar' },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'القسم الأعلى',
      admin: { position: 'sidebar' },
    },
    {
      name: 'family',
      type: 'select',
      required: true,
      label: 'العائلة',
      options: [
        { label: 'مكافحة الحريق', value: 'fire' },
        { label: 'إنذار الحريق', value: 'alarm' },
        { label: 'الأمن والتيار الخفيف', value: 'security' },
        { label: 'الأمن الصناعي', value: 'ppe' },
      ],
      admin: { position: 'sidebar', description: 'يحدد لون القسم في الموقع' },
    },
    {
      name: 'saleMode',
      type: 'select',
      defaultValue: 'quote',
      label: 'طريقة البيع',
      options: [
        { label: 'إضافة للسلة', value: 'cart' },
        { label: 'طلب عرض سعر', value: 'quote' },
        { label: 'مختلط', value: 'hybrid' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'description', type: 'textarea', localized: true, label: 'الوصف' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'الصورة' },
    {
      name: 'seoKeywords',
      type: 'text',
      hasMany: true,
      label: 'كلمات البحث المستهدفة',
      admin: { description: 'من ملف taxonomy.json — تُستخدم في الميتا والمحتوى' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'قسم مميز',
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
