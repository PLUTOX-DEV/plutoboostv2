import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Show prompt to update
      includeAssets: ['pl.png', 'apple-touch-icon.png', 'site.webmanifest'],
      manifest: {
        name: 'PlutoBoost',
        short_name: 'PlutoBoost',
        description: 'Social Media Growth Platform',
        theme_color: '#7c3aed',
        background_color: '#0B0E2A',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pl.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'pl.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pl.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      // Use custom service worker
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        injectionPoint: undefined,
      },
      workbox: {
        // Disable workbox, we'll handle everything in sw.js
        globPatterns: [],
      },
      devOptions: {
        enabled: false, // Disable PWA in development
      },
    }),
  ],
  build: {
    minify: 'terser',
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'chart-vendor': ['recharts', 'react-markdown'],
        },
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
})