import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/coding-h/',
    publicDir: 'public',
    server: {
      // This is the proxy configuration
      proxy: {
        // Any request starting with /api will be proxied
        '/api': {
          target: 'http://localhost:8080', 
          changeOrigin: true,
          secure: false,
        },
    }
  }
})