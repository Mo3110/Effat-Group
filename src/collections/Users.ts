import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'مستخدم', plural: 'المستخدمون' },
  admin: { useAsTitle: 'email', group: 'الإعدادات' },
  auth: true,
  fields: [
    { name: 'name', type: 'text', label: 'الاسم' },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'staff',
      required: true,
      label: 'الصلاحية',
      options: [
        { label: 'مدير', value: 'admin' },
        { label: 'موظف', value: 'staff' },
      ],
    },
  ],
}
