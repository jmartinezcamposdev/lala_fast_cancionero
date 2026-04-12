// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'server',
  adapter: netlify({
    includeFiles: ['./src/data/lala_data.db'],
  })
});
