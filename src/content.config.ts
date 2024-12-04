// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

// 2. Define your collection(s)
const blogCollection = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: './src/content/blog'
	}),
	schema: z.object({
		title: z.string(),
		pubDate: z.date(),
		editedDate: z.date().optional(),
		description: z.string(),
		tags: z.array(z.string()),
		image: z.object({ url: z.string(), alt: z.string() }).optional(),
		draft: z.boolean().optional().default(false)
	})
})

const projectCollection = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
		image: z.object({ url: z.string(), alt: z.string() }).optional(),
		url: z.string(),
		githubUrl: z.string()
	})
})
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	blog: blogCollection,
	projects: projectCollection
}
