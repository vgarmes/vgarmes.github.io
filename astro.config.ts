import { defineConfig, fontProviders } from 'astro/config'
import preact from '@astrojs/preact'
import mdx from '@astrojs/mdx'
import { remarkReadingTime } from './remark-reading-time.mjs'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
	integrations: [preact({ compat: true }), mdx()],
	site: 'https://vgarmes.github.io',

	markdown: {
		shikiConfig: {
			themes: {
				light: 'catppuccin-latte',
				dark: 'tokyo-night'
			}
		},
		remarkPlugins: [remarkReadingTime]
	},

	vite: {
		plugins: [tailwindcss()]
	},

	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: 'Inter',
				cssVariable: '--font-inter'
			}
		]
	}
})
