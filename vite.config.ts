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
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    exclude: ["jsdom", "canvas", "iconv-lite", "whatwg-encoding", "html-encoding-sniffer"],
    force: true, // Force re-optimization to clear cache
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
        manualChunks: {
          // Core vendor chunk - keep ALL React-related packages together
          vendor: [
            "react", 
            "react-dom", 
            "react-router-dom",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu", 
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-progress",
            "@radix-ui/react-tooltip"
          ],

          // Utilities
          utils: ["date-fns", "clsx", "tailwind-merge", "zustand"],

          // Form & Validation
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],

          // Data & Query
          data: ["@tanstack/react-query", "@supabase/supabase-js"],

          // Rich Content - lazy loaded
          editor: ["@uiw/react-md-editor", "react-markdown", "remark-gfm"],

          // Charts & Visualization - lazy loaded
          charts: ["recharts"],

          // Heavy Libraries - lazy loaded
          compression: ["browser-image-compression"],
          pdf: ["html2pdf.js"],

          // Framer Motion - lazy loaded
          animation: ["framer-motion"],
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
