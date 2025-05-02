import { defineConfig, } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  preview: {
    allowedHosts: ['process.env.VITE_ALLOWED_HOST']
  },
  plugins: [
  react(),
  tailwindcss(),
  ]
})
