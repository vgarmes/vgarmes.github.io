/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				'fade-up': 'fade-up 1000ms'
			},
			keyframes: {
				'fade-up': {
					from: { opacity: 0, transform: 'translateY(30px)' },
					to: { opacity: 1, transform: 'translateY(0)' }
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
