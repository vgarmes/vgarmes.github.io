---
title: "Astro’s Fonts API"
pubDate: 2025-06-14
description: 'Customizing fonts in Astro using their new experimental API.'
tags: ["astro","typography","html"]
draft: false
---

Astro recently introduced an experimental Fonts API, so I decided to give it a try while redesigning my site, specifically to swap out the default Tailwind sans font for Inter.

I added something like this to my `astro.config.ts` file:

```ts
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter"
    }]
  }
});
```

However, when I looked at the Network tab I noticed that 14 font files where being download on initial load. Digging into the resulting HTML `<head>`, I found that:

1. The API was generating 14 `@font-face` rules, one for each variation.

2. The API also has some fallback optimization, in my case the fallback that it picked is Arial.

3. By default, Astro seems pretty generous with what it includes — pulling in many subsets (`cyrillic-ext`, `cyrillic`, `greek-ext`, and more).

To fix this, I tweaked the configuration until I landed on something more efficient:

```ts
experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: 'Inter',
				cssVariable: '--font-inter',
				styles: ['normal'],
				weights: ['400 500'],
				subsets: ['latin']
			}
		]
	}
```

Here’s what made the biggest difference:

- Only load the styles I actually use: I don’t use italic or oblique, so I excluded those.
- Limit to the needed weights: I use just 400 and 500. Specifying them as a range (`['400 500']`) instead of an array (`['400', '500']`) ensures only one font file is downloaded.
- Subset to only latin characters: No need to load glyphs I don’t use.
