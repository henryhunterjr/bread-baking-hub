import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        globIgnores: [
          '**/lovable-uploads/**', // Exclude large uploaded files from precaching
          '**/node_modules/**',
        ],
        runtimeCaching: [
          // Supabase storage images
          {
            urlPattern: /^https:\/\/ojyckskucneljvuqzrsw\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          // External image domains used in the app
          {
            urlPattern: /^https:\/\/(images\.unsplash\.com|img\.youtube\.com|bakinggreatbread\.blog|challengerbreadware\.com|hollandbowlmill\.com|i\.etsystatic\.com|henrysbreadkitchen\.wpcomstaging\.com)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          // Supabase API
          {
            urlPattern: /^https:\/\/ojyckskucneljvuqzrsw\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
          // Navigation pages
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Bread Troubleshooting Pro',
        short_name: 'BreadTroublePro',
        description: 'Professional bread troubleshooting with AI-powered symptom detection',
        theme_color: '#8B4513',
        background_color: '#1A1A1A',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/placeholder.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/placeholder.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Prevent accidental bundling of server-only libs in the browser
      jsdom: path.resolve(__dirname, "./src/shims/empty-module.ts"),
    },
  },
  optimizeDeps: {
    exclude: ['jsdom', 'canvas', 'iconv-lite', 'whatwg-encoding', 'html-encoding-sniffer'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI Components
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-progress'
          ],
          
          // Utilities
          utils: ['date-fns', 'clsx', 'tailwind-merge', 'zustand'],
          
          // Form & Validation
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Data & Query
          data: ['@tanstack/react-query', '@supabase/supabase-js'],
          
          // Rich Content
          editor: ['@uiw/react-md-editor', 'react-markdown', 'remark-gfm'],
          
          // Charts & Visualization
          charts: ['recharts'],
          
          // Heavy Libraries (lazy-loaded)
          compression: ['browser-image-compression'],
          pdf: ['html2pdf.js'],
          
          // Framer Motion (animation heavy)
          animation: ['framer-motion']
        }
      }
    },
    // Enhanced production optimization
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 500, // Lower threshold for better chunking
    cssCodeSplit: true,
    
    // Tree shaking optimization
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },
  // Image optimization - include all common image formats
  assetsInclude: ['**/*.webp', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif'],
}));
