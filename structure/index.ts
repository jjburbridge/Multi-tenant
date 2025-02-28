import { id } from 'date-fns/locale'
import { apiVersion } from 'lib/sanity.api'
import { getPublishedId } from 'sanity'

export const structurePost = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.listItem()
        .title('Posts by category')
        .child(
          S.documentTypeList('category')
            .title('Posts by Category')
            .child((categoryId) =>
              // Filter posts by selected group
              S.documentList()
                .title('Posts')
                .filter('_type == "post" && category._ref == $categoryId')
                .params({ categoryId })
                .initialValueTemplates([
                  S.initialValueTemplateItem('post-by-category', {
                    categoryId,
                  }),
                ]),
            ),
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !['post'].includes(listItem.getId()),
      ),
    ])

export const structureCategory = (S, { categoryId, name }) => {
  return S.list()
    .id('root')
    .title('Content')
    .items([
      S.listItem()
        .title(`${name} Posts`)
        .child(
          S.documentList()
            .title('Posts')
            .filter('_type == "post" && category._ref == $categoryId')
            .params({ categoryId })
            .initialValueTemplates([
              S.initialValueTemplateItem('post-by-category', {
                categoryId,
              }),
            ]),
        ),
      S.listItem()
        .title(`${name} Category`)
        .child(S.document().id(categoryId).schemaType('category')),
      ...S.documentTypeListItems().filter(
        (listItem) => !['post', 'category'].includes(listItem.getId()),
      ),
    ])
}

// not implemented but shows how you could doa workspace based on language or some other field
export const structureLanguage = (S, { language }) => {
  return S.list()
    .id('root')
    .title('Content')
    .items([
      S.listItem()
        .title(`${name} Products`)
        .child(
          S.documentList()
            .title('Products')
            .filter('_type == "product" && language == $language')
            .params({ language })
            .initialValueTemplates([
              S.initialValueTemplateItem('product-by-language', {
                language,
              }),
            ]),
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !['post', 'category'].includes(listItem.getId()),
      ),
    ])
}

// used in structure above to prefill the category field
export const templatesCategory = [
  {
    id: 'post-by-category',
    title: 'Post by Category',
    schemaType: 'post', // Must be a valid schema type
    parameters: [{ name: 'categoryId', type: 'string' }], // Must be a valid schema type
    value: (params) => {
      return {
        category: {
          _type: 'reference',
          _ref: params.categoryId,
        },
      }
    },
  },
]


export const templatesLanguage = [
  {
    id: 'product-by-language',
    title: 'Product by Language',
    schemaType: 'product', // Must be a valid schema type
    parameters: [{ name: 'language', type: 'string' }], // Must be a valid schema type
    value: (params) => {
      return {
        language: params.language,
      }
    },
  },
]
