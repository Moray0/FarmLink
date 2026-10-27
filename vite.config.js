import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    watch: {
      usePolling: true,   // Fix for Windows HMR not detecting file changes
      interval: 100,      // Poll every 100ms for a good balance of speed vs CPU
    },
  },
})

