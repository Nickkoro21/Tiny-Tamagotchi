import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// GitHub Pages serves the site under /<repo-name>/, so the base must match.
// For local dev (`npm run dev`) and Vitest, Vite uses '/' automatically
// because the `base` option only affects `vite build`.
export default defineConfig({
  base: '/Tiny-Tamagotchi/',
  plugins: [preact()],
  test: {
    environment: 'jsdom',
  },
});
