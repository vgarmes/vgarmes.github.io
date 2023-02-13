import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import image from '@astrojs/image'
import tailwind from '@astrojs/tailwind'

// TODO: set 'site' (https://docs.astro.build/en/reference/configuration-reference/#site)
export default defineConfig({
	integrations: [preact(), image(), tailwind()],
	site: 'https://vgarmes.github.io',
	base: '/homepage'
})
