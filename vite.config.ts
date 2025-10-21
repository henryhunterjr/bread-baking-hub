import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only include componentTagger in development
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: false },
      selfDestroying: false,
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      jsdom: path.resolve(__dirname, "./src/shims/empty-module.ts"),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },

  optimizeDeps: {
    exclude: [
      "react",
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "jsdom", 
      "canvas", 
      "iconv-lite", 
      "whatwg-encoding", 
      "html-encoding-sniffer"
    ],
  },

  define: {
    global: "globalThis",
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },

  build: {
    assetsInlineLimit: 0, // Prevent image inlining
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // CRITICAL: Keep React as a single chunk to prevent duplication
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }
          
          // Other vendor libraries
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix-ui';
          }
          
          // Supabase and React Query
          if (id.includes('node_modules/@supabase/') || 
              id.includes('node_modules/@tanstack/react-query')) {
            return 'data';
          }
          
          // Utilities
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/zustand')) {
            return 'utils';
          }
          
          // Heavy lazy-loaded libraries
          if (id.includes('node_modules/recharts')) return 'charts';
          if (id.includes('node_modules/framer-motion')) return 'animation';
          if (id.includes('node_modules/browser-image-compression')) return 'compression';
          if (id.includes('node_modules/html2pdf')) return 'pdf';
        },
      },
    },

    // Enhanced production optimization
    minify: "terser", // Switch to Terser for better compression
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,

    // Tree shaking optimization
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },

    // Enhanced compression settings
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        unused: true, // Remove unused code
        dead_code: true, // Remove dead code
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
      },
    },
  },

  // Image optimization - include all common image formats
  assetsInclude: ["**/*.webp", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.gif"],
}));
