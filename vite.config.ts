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
      // KILL SWITCH: forces old SWs to self-remove on this deploy
      selfDestroying: true,
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
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          vendor: ["react", "react-dom", "react-router-dom"],

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
