import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'document',
  name: 'product',
  title: 'Product Details',
  fields: [
    defineField({
      type: 'string',
      name: 'name',
      title: 'Product Name',
      validation: (e) => e.required(),
    }),
    defineField({
      type: 'text',
      name: 'description',
      title: 'Description',
    }),
    defineField({
      type: 'number',
      name: 'price',
      title: 'Price',
      validation: (e) => e.required(),
    }),
    defineField({
      type: 'number',
      name: 'stock',
      title: 'Quantity in Stock',
      validation: (e) => e.required(),
    }),
    defineField({ type: 'string', name: 'category', title: 'Category' }),
    defineField({
      type: 'image',
      name: 'image',
      title: 'Product Image',
    }),
    defineField({
      type: 'boolean',
      name: 'featured',
      title: 'Featured Product',
    }),
    defineField({ type: 'slug', name: 'id', title: 'Product ID' }),
    defineField({
      type: 'date',
      name: 'releaseDate',
      title: 'Release Date',
    }),
    defineField({
      type: 'string',
      name: 'language',
      title: 'Language',
    }),
  ],
})
