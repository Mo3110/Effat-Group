import type { CollectionConfig } from 'payload'
import { autoTranslate, TRANSLATE_SPECS } from '@/hooks/autoTranslate'

/**
 * Refill, annual inspection and maintenance contracts.
 * The highest-margin, most defensible line — and the one no Egyptian
 * competitor has productised online.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'خدمة', plural: 'الخدمات' },
  access: { read: () => true },
  hooks: {
    afterChange: [autoTranslate(TRANSLATE_SPECS.services)],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'model', 'recurringMonths'],
    group: 'الخدمات',
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'اسم الخدمة' },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'model',
      type: 'select',
      required: true,
      defaultValue: 'booking',
      label: 'نموذج الطلب',
      options: [
        { label: 'حجز موعد', value: 'booking' },
        { label: 'باقات متدرجة', value: 'tiered_quote' },
        { label: 'معاينة موقع', value: 'site_survey' },
        { label: 'طلب عرض سعر', value: 'rfq' },
      ],
    },
    {
      name: 'recurringMonths',
      type: 'number',
      label: 'التكرار (شهر)',
      admin: { description: '12 = خدمة سنوية تُشغّل نظام التذكير' },
    },
    { name: 'summary', type: 'textarea', localized: true, label: 'ملخص' },
    { name: 'body', type: 'richText', localized: true, label: 'التفاصيل' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'tiers',
      type: 'array',
      label: 'الباقات',
      admin: { condition: (data) => data?.model === 'tiered_quote' },
      fields: [
        { name: 'name', type: 'text', required: true, localized: true },
        { name: 'summary', type: 'textarea', localized: true },
        { name: 'priceFrom', type: 'number', label: 'يبدأ من (ج.م)' },
      ],
    },
  ],
}
