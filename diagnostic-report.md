# Diagnostic Report for Support Escalation

**Project ID**: 18b3ac3e-8a37-490b-9d6f-2f54b058b979
**Public URL**: https://bakinggreatbread.com
**Lovable Host**: https://18b3ac3e-8a37-490b-9d6f-2f54b058b979.lovableproject.com/

## Issue Summary
Intermittent crashes with: `Uncaught TypeError: Cannot read properties of null (reading 'useState')`

## Current Configuration Dumps

### package.json
```json
{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.4",
    "@radix-ui/react-progress": "^1.0.3",
    "react-router-dom": "^6.14.2",
    "@uiw/react-md-editor": "^3.23.5",
    "@hookform/resolvers": "^3.3.1",
    "@supabase/supabase-js": "^2.38.4",
    "@tanstack/react-query": "^4.36.1",
    "@types/node": "^20.8.9",
    "browser-image-compression": "^2.0.2",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "framer-motion": "^10.16.4",
    "html2pdf.js": "^0.10.1",
    "react-hook-form": "^7.47.0",
    "react-markdown": "^9.0.0",
    "recharts": "^2.9.0",
    "remark-gfm": "^4.0.0",
    "tailwind-merge": "^1.14.0",
    "tailwindcss": "^3.3.3",
    "zod": "^3.22.4",
    "zustand": "^4.4.4"
  },
  "devDependencies": {
    "@iconify/react": "^4.1.1",
    "@testing-library/jest-dom": "^6.1.3",
    "@testing-library/react": "^14.0.0",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react-swc": "^3.3.2",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "jsdom": "^22.1.0",
    "postcss": "^8.4.31",
    "prettier": "^3.0.3",
    "prettier-plugin-tailwindcss": "^0.5.6",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vite-plugin-pwa": "^0.16.6",
    "vitest": "^0.34.6",
    "lovable-tagger": "latest"
  },
  "overrides": {
    "react": "18.3.1", 
    "react-dom": "18.3.1"
  }
}
```

### vite.config.ts - Bundle Configuration
```javascript
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunk - ALL React-related packages together
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
  },
}));
```

### tsconfig.json & tsconfig.app.json
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/\\*": ["./src/*"] }
  }
}

// tsconfig.app.json  
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": { "@/\\*": ["./src/*"] }
  }
}
```

## Runtime Snapshots (Enhanced Diagnostics)

### src/main.tsx - Current Instrumentation
```javascript
// TEMP DIAGNOSTIC - verify single React instance
console.log('[react version]', React.version);
console.log('[useState identity]', React.useState);
console.log('[React object]', React);
console.log('[React from window]', (window as any).React);
const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
console.log('[react renderers count]', hook?.renderers?.size ?? 'no devtools hook');
console.log('[hook renderers]', hook?.renderers);

// Check if React is duplicated in window
if ((window as any).React && (window as any).React !== React) {
  console.error('⚠️ DUPLICATE REACT DETECTED - window.React differs from imported React');
  console.log('imported React:', React);
  console.log('window.React:', (window as any).React);
}
```

## Service Worker / PWA Configuration

### vite.config.ts PWA Settings
```javascript
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
})
```

### Workbox Dependencies Found
- workbox-build: 7.3.0
- workbox-window: 7.3.0
- workbox-core: 7.3.0
- All workbox sub-packages at version 7.3.0

**NOTE**: No service worker files found in public/ directory, indicating they're generated at build time.

## Failing Stack Trace
```
Uncaught TypeError: Cannot read properties of null (reading 'useState')
    at Object.useState (…/node_modules/.vite/deps/chunk-ZMLY2J2T.js:1066:29)
    at TooltipProvider (@radix-ui/react-tooltip …)
    at renderWithHooks (…/node_modules/.vite/deps/chunk-W6L2VRDA.js:11548:26)
```

## Key Hypothesis Points for Platform Investigation

1. **Chunk Identity Mismatch**: The error occurs in `chunk-ZMLY2J2T.js` but rendering happens in `chunk-W6L2VRDA.js` - need verification these chunks import the same React identity.

2. **Prebundle Consistency**: Despite our `resolve.dedupe` configuration, the `.vite/deps/` prebundled chunks may contain different React instances.

3. **Cache/CDN Issues**: Possible stale chunk mixing where some chunks reference an older React build.

## Required Platform Checks

### 1. CDN/Cache Consistency
- List all served assets with full URLs, ETags, and cache headers
- Verify all `.vite/deps/*` chunks came from same build hash
- Perform cache purge and confirm alignment

### 2. Prebundle Analysis  
- Show internal Vite prebundle graph proving single React identity
- Verify Radix packages import same React as our app
- Examine `.vite/deps/` directory contents

### 3. Editor Shell Isolation
- Confirm Lovable shell doesn't inject React into our app's iframe
- Provide current shell build/revision
- Verify no cross-frame React bridges

### 4. Serve-time Identity Check
In failing sessions, compare React imports in:
- `chunk-ZMLY2J2T.js` (where useState fails)  
- `chunk-W6L2VRDA.js` (where rendering happens)

### 5. Service Worker Analysis
- Show current `sw.js` precache manifest
- Verify no stale chunk caching during upgrades
- Check workbox configuration headers

## Steps Already Taken (Please Don't Suggest Again)

✅ Hard refresh, incognito, multiple browsers/devices  
✅ Remixed project and redeployed clean  
✅ Restored to earlier commits and re-applied incrementally  
✅ Removed all global React shims  
✅ Confirmed single React version with overrides  
✅ Added Vite resolve aliases and deduplication  
✅ Moved all Radix UI packages to vendor chunk  
✅ JSX-only provider rendering  
✅ Runtime React identity verification  

## Billing Request

- CSV of daily usage for last 2 weeks
- Goodwill credit for incident-related usage  
- Temporary credit boost during investigation
- Hard spending cap until resolution

---

*This report contains all configuration artifacts and diagnostic instrumentation for platform-level investigation of the persistent React useState null error.*
