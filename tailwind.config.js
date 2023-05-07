/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				'fade-up': 'fade-up 1000ms',
				'bounce-right': 'bounce-right 2s both infinite'
			},
			keyframes: {
				'fade-up': {
					from: { opacity: 0, transform: 'translateY(30px)' },
					to: { opacity: 1, transform: 'translateY(0)' }
				},
				'bounce-right': {
					'0%': {
						transform: 'translateX(48px)',
						animationTimingFunction: 'ease-in',
						opacity: 1
					},
					'24%': {
						opacity: 1
					},
					'40%': {
						transform: 'translateX(26px)',
						animationTimingFunction: 'ease-in'
					},
					'65%': {
						transform: 'translateX(13px)',
						animationTimingFunction: 'ease-in'
					},
					'82%': {
						transform: 'translateX(6.5px)',
						animationTimingFunction: 'ease-in'
					},
					'93%': {
						transform: 'translateX(4px)',
						animationTimingFunction: 'ease-in'
					},
					'25%, 55%, 75%, 87%, 98%': {
						transform: 'translateX(0px)',
						animationTimingFunction: 'ease-out'
					},
					'100%': {
						transform: 'translateX(0px)',
						animationTimingFunction: 'ease-out',
						opacity: 1
					}
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
}
