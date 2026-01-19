import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Base path für GitHub Pages - ersetze 'kanu-member-app' mit deinem Repository-Namen
  base: '/kanu-member-app/',
})
