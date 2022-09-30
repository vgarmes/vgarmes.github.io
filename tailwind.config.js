/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				fadein: 'fadein 300ms'
			},
			keyframes: {
				fadein: {
					from: { opacity: 0 },
					to: { opacity: 1 }
				}
			}
		}
	},
	plugins: []
}
