import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API requests to backend
      '/api': {
        target: 'http://localhost:5000', // Replace 5000 with your backend port if different
        changeOrigin: true,
        secure: false, // Disable SSL verification for dev
      },
    },
  },
})
