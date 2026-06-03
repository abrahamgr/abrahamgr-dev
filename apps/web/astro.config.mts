// @ts-check
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: {
    port: 3000,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
