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
				dark: 'vesper'
			},
			transformers: [
				{
					pre(hast) {
						hast.properties['data-meta'] = this.options.meta?.__raw
						// the original source code is stored in `source` property
						hast.properties['data-code'] = this.source
					}
				}
			]
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
				name: 'Geist',
				cssVariable: '--font-geist',
				styles: ['normal'],
				weights: ['400 500'],
				subsets: ['latin'],
				fallbacks: [
					'ui-sans-serif',
					'system-ui',
					'sans-serif',
					'Apple Color Emoji',
					'Segoe UI Emoji',
					'Segoe UI Symbol',
					'Noto Color Emoji'
				]
			},
			{
				provider: fontProviders.google(),
				name: 'Geist Mono',
				cssVariable: '--font-geist-mono',
				styles: ['normal'],
				weights: ['400 500'],
				subsets: ['latin'],
				fallbacks: [
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'Liberation Mono',
					'Courier New',
					'monospace'
				]
			}
		]
	}
})
