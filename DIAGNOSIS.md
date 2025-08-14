# Hero Image Production Deployment Issues - Diagnosis

## Overview
Investigation reveals that hero images are correctly implemented in the codebase but may face production deployment issues. This is a React/Vite project (NOT Next.js as originally stated), which changes the diagnosis approach.

## Issue Analysis by Page

### /troubleshooting
- **File**: `src/components/troubleshooting/TroubleshootingHero.tsx`
- **Image Source**: `import troubleshootingHero from '@/assets/troubleshooting-hero.png'`
- **Status**: ✅ Proper static asset import
- **Image Location**: Verified to exist at `src/assets/troubleshooting-hero.png`

### /recipe-workspace  
- **File**: `src/pages/RecipeWorkspace.tsx`
- **Image Source**: `import recipeWorkspaceHero from '@/assets/recipe-workspace-hero.png'`
- **Status**: ✅ Proper static asset import
- **Image Location**: Verified to exist at `src/assets/recipe-workspace-hero.png`

### /glossary (BreadGlossary)
- **File**: `src/pages/BreadGlossary.tsx` 
- **Image Source**: `import glossaryHero from '@/assets/glossary-hero.png'`
- **Status**: ✅ Proper static asset import
- **Image Location**: Verified to exist at `src/assets/glossary-hero.png`

## Root Cause Analysis

### ❌ NOT the Issue:
- **Domain Whitelisting**: No external domains involved - all are static imports
- **next.config.js**: This is a Vite project, not Next.js
- **Hardcoded /lovable-uploads/ paths**: Hero images use proper static imports
- **Missing files**: All three hero images exist in src/assets/

### ✅ LIKELY Production Issues:

1. **Vite Build Asset Processing**
   - Static imports may not be processed correctly during build
   - Assets might not be copied to dist/ directory properly
   - Build optimization could be stripping or renaming assets

2. **Deployment Configuration**
   - Vercel deployment may not include src/assets/ in build output
   - vite.config.ts asset handling might be insufficient
   - Missing asset build step in deployment pipeline

3. **Cache/CDN Issues**
   - Images building correctly but cached incorrectly on Vercel
   - Browser cache showing old version without images
   - CDN not serving updated assets

## Supporting Evidence

### Console Error Pattern
```
Troubleshooting hero image failed to load
```
This suggests the image path resolves but the actual file is missing in production.

### Widespread /lovable-uploads/ Usage
Found 296 instances of `/lovable-uploads/` paths across 62 files, indicating the codebase heavily relies on Lovable's upload system, but the three hero images correctly use static imports.

### Vite Configuration Review
- `vite.config.ts` excludes `/lovable-uploads/` from precaching (line 22)
- Asset handling configured with `assetsInclude: ['**/*.webp']` but may need PNG inclusion
- Build optimization might be affecting static imports

## Fix Plan

### 1. Verify Vite Asset Handling
- Ensure PNG files are properly included in Vite's asset processing
- Check if static imports generate correct production paths
- Verify dist/ folder contains the hero images after build

### 2. Update Vite Configuration  
- Add explicit PNG handling to `assetsInclude`
- Ensure proper asset copying in build pipeline
- Review rollup output configuration for assets

### 3. Deployment Verification
- Check Vercel build logs for asset processing errors
- Verify deployed dist/ contains hero images
- Test production URLs directly for image accessibility

### 4. Fallback Implementation
- Add error handling with fallback images
- Implement loading states for hero sections
- Add development vs production image source logic if needed

## Next Steps

1. **Immediate**: Check Vercel deployment build output for missing assets
2. **Configuration**: Update vite.config.ts asset handling
3. **Testing**: Deploy test build to verify asset inclusion
4. **Monitoring**: Add logging to track image load success/failure in production

## Impact Assessment
- **Critical**: Hero sections are key visual elements for user engagement
- **User Experience**: Missing heroes create poor first impression
- **SEO**: Hero images important for social sharing and visual appeal
- **Brand**: Professional appearance compromised without hero visuals