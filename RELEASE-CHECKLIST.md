# Release Checklist

Use this checklist before deploying to production to ensure all critical functionality works correctly.

## 🖼️ Hero Images & Image Loading

### Hero Image Loading
- [ ] Navigate to `/troubleshooting` - verify hero image loads correctly
- [ ] Navigate to `/recipe-workspace` - verify hero image loads correctly  
- [ ] Navigate to `/glossary` - verify hero image loads correctly
- [ ] Test hero image fallback: temporarily break an image URL in DevTools to verify fallback appears
- [ ] Verify no "Loading image..." text appears - should show shimmer skeleton instead

### Network Health Check
- [ ] Open DevTools → Network tab → Filter by "img"
- [ ] Navigate through all hero pages and verify no 404 errors for images
- [ ] Check that fallback images load when primary images fail
- [ ] Verify image retry logic works (watch for retry attempts in network panel)

## 🎯 Interactive Elements

### Vitale "Preview Book" Button
- [ ] Navigate to `/vitale-starter`
- [ ] Click "Preview Book" button
- [ ] Verify it navigates to `/preview/vitale-sourdough-mastery`
- [ ] Verify preview page loads with sample content
- [ ] Check analytics tracking fires (data-analytics="vitale_preview_click")

### Recipe Scaling Control
- [ ] Navigate to any recipe page with scaling controls
- [ ] **Desktop Testing:**
  - [ ] Click preset chips (0.5, 1, 2, 3) - verify ingredient quantities update
  - [ ] Use +/- buttons - verify values update correctly
  - [ ] Type directly in input field - verify clamping (0.5 min, 3 max)
- [ ] **Mobile Testing:**
  - [ ] Verify touch targets are ≥44px (tap comfortably)
  - [ ] Test all scaling controls work on touch devices
  - [ ] Verify ingredient amounts update immediately with proper rounding

## 📱 Mobile Navigation & Accessibility

### Mobile Menu Interaction
- [ ] **Viewport: Mobile (< 768px)**
- [ ] Tap hamburger menu - verify it opens smoothly
- [ ] Verify overlay appears behind menu
- [ ] Tap overlay - verify menu closes
- [ ] Verify body scroll is locked while menu is open
- [ ] Try scrolling page while menu open - should be prevented

### Menu Accessibility
- [ ] **Keyboard Navigation:**
  - [ ] Tab through menu items - verify focus indicators
  - [ ] Press ESC key - verify menu closes
  - [ ] Press Enter/Space on menu items - verify navigation works
- [ ] **Screen Reader Testing:**
  - [ ] Verify menu has proper ARIA labels
  - [ ] Verify focus trap works within open menu
  - [ ] Check button has aria-expanded state

### Z-Index & Layout
- [ ] Open mobile menu with hero sections visible
- [ ] Verify menu appears above hero content (no z-index conflicts)
- [ ] Check menu doesn't interfere with other UI elements
- [ ] Verify menu positioning is correct across different screen sizes

## 🎨 Image Loading Polish

### Skeleton Loading States
- [ ] **Slow Connection Simulation:**
  - [ ] DevTools → Network → Throttling → "Slow 3G"
  - [ ] Navigate to image-heavy pages
  - [ ] Verify shimmer skeleton animations appear (not "Loading..." text)
  - [ ] Verify smooth transition from skeleton to loaded image

### Image Error Handling
- [ ] Test ImageWithFallback component error states
- [ ] Verify error logging appears only once per failed URL (no spam)
- [ ] Verify retry logic attempts once before falling back
- [ ] Check that fallback images (/hero/fallback.jpg) load correctly

## 🔧 Build & Deploy

### Pre-Deploy Checks
- [ ] Run `npm run build` - verify no /lovable-uploads/ violations
- [ ] Check build output for any warnings or errors
- [ ] Verify all static assets are properly bundled
- [ ] Test production build locally before deploying

### Post-Deploy Verification
- [ ] Test all hero pages on production URL
- [ ] Verify CDN/static asset delivery works correctly
- [ ] Check performance metrics (Core Web Vitals)
- [ ] Test on multiple devices/browsers

## 📊 Performance & Monitoring

### Image Performance
- [ ] Check image loading times in DevTools
- [ ] Verify proper image sizing (no oversized downloads)
- [ ] Test lazy loading works correctly
- [ ] Verify WebP support detection works

### Mobile Performance
- [ ] Test mobile navigation performance (should feel responsive)
- [ ] Check for layout shifts during image loading
- [ ] Verify touch response times meet expectations

---

## 🚨 Blocker Issues

Mark any of these as blockers that must be fixed before release:

- [ ] Hero images fail to load on any page
- [ ] Mobile navigation completely broken
- [ ] Recipe scaling produces incorrect values
- [ ] /lovable-uploads/ paths found in production code
- [ ] Critical accessibility issues found

## ✅ Release Approval

- [ ] All checklist items completed successfully
- [ ] No blocker issues identified
- [ ] Performance within acceptable limits
- [ ] Cross-browser compatibility confirmed

**Release approved by:** ________________  
**Date:** ________________