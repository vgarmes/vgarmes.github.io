import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind' // TODO: set 'site' (https://docs.astro.build/en/reference/configuration-reference/#site)
import mdx from '@astrojs/mdx'
import { remarkReadingTime } from './remark-reading-time.mjs'

// https://astro.build/config
export default defineConfig({
	integrations: [preact({ compat: true }), tailwind(), mdx()],
	site: 'https://vgarmes.github.io',
	markdown: {
		remarkPlugins: [remarkReadingTime]
	}
})
