import { DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',

      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
    }),
    defineField({
      name: 'relatedContent',
      type: 'array',
      title: 'Related Content',
      options: {
        insertMenu: {
          filter: true,
        },
      },
      of: [
        {
          name: 'pageReference',
          title: 'Page',
          type: 'reference',
          to: [{ type: 'page', name: 'page' }],
        },
        {
          title: 'Faculty 1 post',
          name: 'faculty1Post',
          type: 'reference',
          options: {
            filter: 'category._ref == $categoryId',
            filterParams: {
              categoryId: '717cedd0-f05c-4a6b-9a6b-ffeda030ad6e',
            },
          },
          to: [{ type: 'post' }],
        },
        {
          title: 'Faculty 2 post',
          name: 'faculty2Post',
          type: 'reference',
          options: {
            filter: 'category._ref == $categoryId',
            filterParams: {
              categoryId: 'd15ba58a-28cf-48be-8f7d-fa3e03b8facd',
            },
          },
          to: [{ type: 'post' }],
        },
        {
          title: 'All Post',
          name: 'all posts',
          type: 'reference',
          to: [{ type: 'post' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      slug: 'slug.current',
      media: 'image',
    },
    prepare: ({ title, description, slug, media }) => ({
      title,
      subtitle: description ?? slug,
      media,
    }),
  },
})
