'use client'
/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import {
  apiVersion,
  dataset,
  DRAFT_MODE_ROUTE,
  ecomDataset,
  projectId,
} from 'lib/sanity.api'
import { createClient } from 'next-sanity'
import { locate } from 'plugins/locate'
import { previewDocumentNode } from 'plugins/previewPane'
import { settingsPlugin, settingsStructure } from 'plugins/settings'
import { CurrentUser, defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { workspaceHome } from 'sanity-plugin-workspace-home'
import authorType from 'schemas/author'
import categoryType from 'schemas/category'
import pageType from 'schemas/page'
import postType from 'schemas/post'
import productType from 'schemas/product'
import settingsType from 'schemas/settings'
import teams from 'schemas/teams'
import { structureCategory, structurePost, templatesCategory } from 'structure'

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Next.js Blog with Sanity.io'

const plugins = [
  structureTool({
    structure: settingsStructure(settingsType),
    // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
    defaultDocumentNode: previewDocumentNode(),
  }),
  presentationTool({
    locate,
    previewUrl: {
      previewMode: {
        enable: DRAFT_MODE_ROUTE,
      },
    },
  }),
  // Configures the global "new document" button, and document actions, to suit the Settings document singleton
  settingsPlugin({ type: settingsType.name }),
  // Add an image asset source for Unsplash
  unsplashImageAsset(),
  // Vision lets you query your content with GROQ in the studio
  // https://www.sanity.io/docs/the-vision-plugin
  process.env.NODE_ENV !== 'production' &&
    visionTool({ defaultApiVersion: apiVersion }),
]

const categories = [
  {
    id: 'category-1',
    name: 'Category 1',
  },
  {
    id: 'category-2',
    name: 'Category 2',
  },
]

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

export const fetchCurrentUserRoles = async (): Promise<string[]> => {
  try {
    const response: CurrentUser = await client.request({
      url: 'users/me',
      withCredentials: true,
    })

    return response.roles.map((role) => role.name)
  } catch (error) {
    console.error(error)
    return []
  }
}

export const productWorkspace = defineConfig({
  name: 'product',
  basePath: '/studio/product',
  title: 'product',
  projectId: projectId,
  dataset: ecomDataset,
  plugins: [
    structureTool(),
    documentInternationalization({
      // Required configuration
      supportedLanguages: [
        { id: 'se', title: 'Swedish' },
        { id: 'en', title: 'English' },
      ],
      schemaTypes: ['product'],
    }),
  ],
  schema: {
    types: [productType],
  },
})

export const authorWorkspace = defineConfig({
  name: 'author',
  basePath: '/studio/author',
  title: 'author',
  projectId: projectId,
  dataset: dataset,
  plugins,
  schema: {
    types: [authorType],
  },
})

export const postWorkspace = defineConfig({
  name: 'post',
  basePath: '/studio/post',
  title: 'post',
  projectId: projectId,
  dataset: dataset,
  plugins: [
    structureTool({
      structure: structurePost,
    }),
  ],
  schema: {
    types: [postType, authorType, categoryType],
    templates: templatesCategory,
  },
})

export const categoryPostWorkspace = (categoryId, name) => {
  const workspaceName = name.toLowerCase().replace(/[^a-z0-9]/gi, '')
  console.log(workspaceName)
  return defineConfig({
    name: `${workspaceName}post`,
    basePath: `/studio/${workspaceName}-post`,
    title: `${name} Post`,
    projectId: projectId,
    dataset: dataset,
    plugins: [
      structureTool({
        structure: (s) => structureCategory(s, { categoryId, name }),
      }),
    ],
    schema: {
      types: [postType, authorType, categoryType, pageType],
      templates: templatesCategory,
    },
  })
}

export const allWorkspace = defineConfig({
  name: 'all',
  basePath: '/studio/all',
  title: 'all',
  projectId: projectId,
  dataset: dataset,
  plugins,
  releases: {
    enabled: true,
  },
  schema: {
    types: [authorType, postType, categoryType, settingsType, pageType, teams],
  },
})

const generateConfig = async () => {
  const userRoles = await fetchCurrentUserRoles()

  // custom role
  if (userRoles.includes('author')) {
    return authorWorkspace
  }
  // custom role
  if (userRoles.includes('post')) {
    return postWorkspace
  }


  const filteredCategories = categories
    .map((category) => {
      if (userRoles?.includes(`${category.id}-manager`)) {
        return categoryPostWorkspace(category.id, category.name)
      }
    })
    .filter(Boolean)

  if (filteredCategories.length) {
    return filteredCategories[0]
  }

  // default role
  if (userRoles.includes('administrator')) {
    return allWorkspace
  }

  return []
}

export const configs = await generateConfig()
