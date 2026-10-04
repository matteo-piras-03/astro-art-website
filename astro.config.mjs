// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  fonts: [
  {
    provider: fontProviders.local(),
    name: "Primary Font",
    cssVariable: "--font-primary",
    options: {
      variants: [{
        src: ['./src/assets/fonts/noto-sans-v42-latin-regular.woff2'],
        weight: 400,
        style: 'normal'
      }]
    },
  },
  {
    provider: fontProviders.local(),
    name: "Mono Font",
    cssVariable: "--font-mono",
    options: {
      variants: [{
        src: ['./src/assets/fonts/noto-sans-mono-v37-latin-regular.woff2'],
        weight: 400,
        style: 'normal'
      }]
    },
  },
  {
    provider: fontProviders.local(),
    name: "Header Font",
    cssVariable: "--font-header",
    options: {
      variants: [{
        src: ['./src/assets/fonts/reddit-sans-v6-latin-900.woff2'],
        weight: 900,
        style: 'normal'
      }]
    },
  }
  ],

  site: "https://piras03.com",

  prefetch: {
    prefetchAll: false
  },

  adapter: cloudflare()
});