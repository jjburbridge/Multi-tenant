import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'document',
  name: 'category',
  title: 'Category',
  fields: [
    defineField({
      type: 'string',
      name: 'categoryName',
      title: 'Category Name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'slug',
      name: 'categorySlug',
      title: 'Category Slug',
      validation: (rule) => rule.required(),
      options: {
        source: 'categoryName',
      },
    }),
    defineField({
      type: 'text',
      name: 'categoryDescription',
      title: 'Category Description',
    }),
  ],
})
