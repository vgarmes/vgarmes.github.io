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
				light: 'github-light-high-contrast',
				dark: 'github-dark-high-contrast'
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
				cssVariable: '--font-inter',
				styles: ['normal'],
				weights: ['400 500'],
				fallbacks: [
					'ui-sans-serif',
					'system-ui',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'Noto Color Emoji'
				],
				optimizedFallbacks: false,
				subsets: ['latin']
			}
		]
	}
})
