import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import image from '@astrojs/image';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), image(), tailwind()]
});