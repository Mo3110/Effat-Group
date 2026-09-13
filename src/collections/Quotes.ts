import type { CollectionConfig } from 'payload'

/** RFQ submissions — the primary conversion event for the quote-only half of the catalog. */
export const Quotes: CollectionConfig = {
  slug: 'quotes',
  labels: { singular: 'طلب عرض سعر', plural: 'طلبات عروض الأسعار' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true, // public submissions — constrained by the hook below
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        // Anonymous callers may create a quote, but must not control the sales
        // pipeline. Without this, anyone can POST /api/quotes with
        // status:'won' or attach arbitrary media. Staff (req.user) are exempt.
        if (operation !== 'create' || req.user || !data) return data

        return {
          ...data,
          status: 'new',
          source: 'website',
          items: undefined,
          attachment: undefined,
        }
      },
    ],
  },
  admin: {
    useAsTitle: 'contactName',
    defaultColumns: ['contactName', 'company', 'phone', 'status', 'createdAt'],
    group: 'المبيعات',
  },
  fields: [
    { name: 'contactName', type: 'text', required: true, maxLength: 100, label: 'اسم المسؤول' },
    { name: 'company', type: 'text', maxLength: 120, label: 'الشركة' },
    {
      name: 'phone',
      type: 'text',
      required: true,
      maxLength: 20,
      label: 'رقم الهاتف',
      admin: { description: 'يُخزَّن بصيغة E.164 مثل ‎+201XXXXXXXXX' },
    },
    { name: 'email', type: 'email', label: 'البريد الإلكتروني' },
    {
      name: 'governorate',
      type: 'text',
      maxLength: 60,
      label: 'المحافظة',
    },
    {
      name: 'items',
      type: 'array',
      label: 'الأصناف المطلوبة',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', label: 'المنتج' },
        { name: 'qty', type: 'number', required: true, defaultValue: 1, label: 'الكمية' },
        { name: 'note', type: 'text', label: 'ملاحظة' },
      ],
    },
    { name: 'message', type: 'textarea', maxLength: 2000, label: 'تفاصيل إضافية' },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'media',
      label: 'مقايسة / رسومات (PDF)',
      admin: { description: 'وجود مرفق يميّز العميل الجاد' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      label: 'الحالة',
      options: [
        { label: 'جديد', value: 'new' },
        { label: 'جاري التسعير', value: 'pricing' },
        { label: 'تم الإرسال', value: 'sent' },
        { label: 'تم التحويل', value: 'won' },
        { label: 'مرفوض', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'الموقع', value: 'website' },
        { label: 'واتساب', value: 'whatsapp' },
        { label: 'هاتف', value: 'phone' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
