import type { CollectionConfig } from 'payload'

/**
 * The hybrid model lives here: `saleMode` decides whether the product page
 * renders "أضف للسلة" with a price, or "اطلب عرض سعر" with an RFQ form.
 * Inherited from the category unless overridden.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'منتج', plural: 'المنتجات' },
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'category', 'price', 'stockStatus'],
    group: 'الكتالوج',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'اسم المنتج' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'الرابط',
      admin: { position: 'sidebar' },
    },
    { name: 'sku', type: 'text', unique: true, label: 'كود المنتج', admin: { position: 'sidebar' } },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'القسم',
      admin: { position: 'sidebar' },
    },
    { name: 'brand', type: 'relationship', relationTo: 'brands', label: 'الماركة', admin: { position: 'sidebar' } },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'المحتوى',
          fields: [
            { name: 'shortDescription', type: 'textarea', localized: true, label: 'وصف مختصر' },
            { name: 'description', type: 'richText', localized: true, label: 'الوصف التفصيلي' },
            { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: 'الصور' },
            { name: 'datasheet', type: 'upload', relationTo: 'media', label: 'كتالوج / داتا شيت (PDF)' },
          ],
        },
        {
          label: 'البيع والسعر',
          fields: [
            {
              name: 'saleMode',
              type: 'select',
              defaultValue: 'inherit',
              label: 'طريقة البيع',
              options: [
                { label: 'حسب القسم', value: 'inherit' },
                { label: 'إضافة للسلة', value: 'cart' },
                { label: 'طلب عرض سعر', value: 'quote' },
                { label: 'مختلط', value: 'hybrid' },
              ],
            },
            {
              name: 'price',
              type: 'number',
              label: 'السعر (ج.م — شامل الضريبة)',
              admin: { condition: (data) => data?.saleMode !== 'quote' },
            },
            {
              name: 'compareAtPrice',
              type: 'number',
              label: 'السعر قبل الخصم',
              admin: { condition: (data) => data?.saleMode !== 'quote' },
            },
            {
              name: 'quoteThresholdQty',
              type: 'number',
              label: 'الكمية التي تتحول بعدها لعرض سعر',
              admin: {
                condition: (data) => data?.saleMode === 'hybrid',
                description: 'الطلبات الأكبر من هذه الكمية تُحوَّل تلقائياً لطلب عرض سعر',
              },
            },
            {
              name: 'stockStatus',
              type: 'select',
              defaultValue: 'in_stock',
              required: true,
              label: 'حالة التوفر',
              options: [
                { label: 'متوفر', value: 'in_stock' },
                { label: 'كمية محدودة', value: 'low' },
                { label: 'حسب الطلب', value: 'on_order' },
                { label: 'غير متوفر', value: 'out' },
              ],
              admin: { description: 'المقاولون يشترون حسب التوفر قبل السعر' },
            },
            { name: 'stockQty', type: 'number', label: 'الكمية' },
          ],
        },
        {
          label: 'المواصفات',
          fields: [
            {
              name: 'specs',
              type: 'array',
              label: 'جدول المواصفات',
              labels: { singular: 'مواصفة', plural: 'المواصفات' },
              fields: [
                { name: 'key', type: 'text', required: true, localized: true, label: 'البند' },
                { name: 'value', type: 'text', required: true, localized: true, label: 'القيمة' },
              ],
            },
            {
              name: 'certifications',
              type: 'select',
              hasMany: true,
              label: 'الاعتمادات',
              options: [
                'الدفاع المدني',
                'EN3',
                'UL',
                'FM',
                'ISO 9001',
                'علامة الجودة المصرية',
                'CE',
                'NFPA',
              ].map((v) => ({ label: v, value: v })),
            },
            { name: 'warrantyMonths', type: 'number', label: 'الضمان (شهر)' },
            {
              name: 'refillDueMonths',
              type: 'number',
              label: 'دورية إعادة التعبئة (شهر)',
              admin: {
                description: 'يشغّل تذكير الصيانة السنوي — المصدر الأساسي للإيراد المتكرر',
              },
            },
          ],
        },
        {
          label: 'السيو',
          fields: [
            { name: 'metaTitle', type: 'text', localized: true },
            { name: 'metaDescription', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}
