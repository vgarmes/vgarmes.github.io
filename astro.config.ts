import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import image from '@astrojs/image'
import tailwind from '@astrojs/tailwind' // TODO: set 'site' (https://docs.astro.build/en/reference/configuration-reference/#site)
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
	integrations: [preact({ compat: true }), image(), tailwind(), mdx()],
	site: 'https://vgarmes.github.io'
})
