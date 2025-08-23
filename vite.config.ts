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
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      jsdom: path.resolve(__dirname, "./src/shims/empty-module.ts"),
      // 🔒 Force a single copy of React/ReactDOM
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },

  optimizeDeps: {
    exclude: ["jsdom", "canvas", "iconv-lite", "whatwg-encoding", "html-encoding-sniffer"],
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
          // ❌ removed: vendor chunk that previously split react/react-dom/react-router-dom
          // Keep the rest of your chunking as-is:

          // UI Components
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-progress",
          ],

          // Utilities
          utils: ["date-fns", "clsx", "tailwind-merge", "zustand"],

          // Form & Validation
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],

          // Data & Query
          data: ["@tanstack/react-query", "@supabase/supabase-js"],

          // Rich Content
          editor: ["@uiw/react-md-editor", "react-markdown", "remark-gfm"],

          // Charts & Visualization
          charts: ["recharts"],

          // Heavy Libraries (lazy-loaded)
          compression: ["browser-image-compression"],
          pdf: ["html2pdf.js"],

          // Framer Motion (animation heavy)
          animation: ["framer-motion"],
        },
      },
    },

    // Enhanced production optimization
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,

    // Tree shaking optimization
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
  },

  // Image optimization - include all common image formats
  assetsInclude: ["**/*.webp", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.gif"],
}));
