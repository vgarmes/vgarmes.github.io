---
title: "My experience with Astro's experimental fonts API"
pubDate: 2025-06-12
description: 'Redesign 2025'
image:
    url: 'https://res.cloudinary.com/dx73a1lse/image/upload/v1691097664/blog/build-your-own-react-routerwebp_wzdy1w.webp' 
    alt: 'Redesign 2025'
tags: ["design","web development"]
draft: true
---

TL; DR;

```ts
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
```

```shell
pnpm astro sync
```