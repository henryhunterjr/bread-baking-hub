# Mobile Sharing Diagnostic Report
## Issue: Blog Links Fail to Open on Mobile Devices

**Date:** October 25, 2025  
**Issue URL:** https://bakinggreatbread.com/blog/discover-the-autumn-magic-of-pain-normand  
**Status:** UNRESOLVED - Mobile 404 errors persist

---

## Executive Summary

Blog post links shared via Facebook Messenger work correctly on desktop browsers but consistently fail on mobile devices with 404 errors or blank pages. The Open Graph previews and thumbnails work correctly across all platforms, but the actual page load fails specifically on mobile.

---

## Symptoms

### ✅ What Works
- Facebook Debugger shows correct Open Graph tags and thumbnail
- Links shared in Messenger display correct preview with image
- Opening links on **desktop/PC browsers** works perfectly
- Desktop URL resolves to: `https://bakinggreatbread.com/blog/discover-the-autumn-magic-of-pain-normand?fbclid=...`

### ❌ What Fails
- Opening same links on **mobile devices** results in 404 "Page Not Found"
- Mobile URL shows as: `https://bakinggreatbread.com/blog/discover-the-autumn-magic-of-pain-normand`
- Blank white page on some mobile devices
- Issue occurs across different mobile browsers (Chrome, Safari, in-app Messenger browser)

---

## Technical Architecture

### Current Setup

```
User shares link → Messenger/Facebook
                    ↓
    Is user-agent a social crawler?
         ↓              ↓
       YES             NO
         ↓              ↓
   /api/blog-share → React SPA (/blog/:slug)
   (OG tags only)    (Full page render)
```

### File Structure

1. **`vercel.json`** - Routing configuration with conditional rewrites
2. **`/api/blog-share.ts`** - Vercel serverless function for Open Graph metadata
3. **`src/pages/BlogPost.tsx`** - React component for blog post rendering
4. **`src/components/blog/BlogPostSEO.tsx`** - SEO metadata component

---

## Configuration Analysis

### Current `vercel.json` Rewrite Rules

```json
{
  "source": "/blog/:slug",
  "destination": "/api/blog-share?slug=:slug",
  "has": [
    {
      "type": "header",
      "key": "user-agent",
      "value": ".*(facebookexternalhit|Facebot|FacebookBot|Twitterbot|LinkedInBot).*"
    }
  ]
}
```

**User-agents that trigger API redirect:**
- `facebookexternalhit` (Facebook crawler)
- `Facebot` (Facebook bot)
- `FacebookBot` (Facebook bot variant)
- `Twitterbot` (Twitter crawler)
- `LinkedInBot` (LinkedIn crawler)

**User-agents that should go to React SPA:**
- All other browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers
- In-app browsers (Messenger, Instagram, etc.)

---

## Debugging Steps Attempted

### Phase 1: Initial Mobile User-Agent Issue
**Problem:** Mobile Messenger browsers were matching the rewrite rule  
**Action:** Removed mobile-specific user-agents from regex  
**Removed:**
- `FBAN` (Facebook App for iOS/Android)
- `FBAV` (Facebook App version)
- `MessengerForiOS`
- `Instagram`

**Result:** Still experiencing 404 errors on mobile

### Phase 2: WhatsApp User-Agent Issue
**Problem:** WhatsApp shares were being incorrectly routed  
**Action:** Removed `WhatsApp` from user-agent regex  
**Result:** Still experiencing 404 errors on mobile

### Phase 3: Current State
**Status:** Mobile devices still receiving 404 errors despite all mobile user-agents removed from rewrite rules

---

## API Endpoint Analysis

### `/api/blog-share.ts` Functionality

```typescript
// Fetches blog post from Supabase
// Generates static HTML with Open Graph tags
// Uses meta refresh + JavaScript redirect to actual blog post
```

**Key Features:**
1. Queries Supabase for blog post by slug
2. Generates HTML with OG tags (og:image, og:title, og:description)
3. Includes two redirect mechanisms:
   - `<meta http-equiv="refresh" content="0;url=${url}">`
   - `<script>window.location.href = "${url}";</script>`
4. Returns 404 if post not found

**Image Priority:**
```
social_image_url → inline_image_url → hero_image_url → fallback logo
```

---

## React SPA Analysis

### `src/pages/BlogPost.tsx` Route Handling

```typescript
// Route definition in App.tsx
<Route path="/blog/:slug" element={<BlogPost />} />

// Blog post loading logic
1. Normalize slug (lowercase, decode URI)
2. Query Supabase for matching post
3. Fallback to WordPress if not found
4. Render with SEO metadata
```

**Data Sources (in order):**
1. Supabase `blog_posts` table (primary)
2. WordPress API fallback (legacy content)

**SEO Implementation:**
- `BlogPostSEO` component handles meta tags
- `react-helmet-async` for dynamic head management
- Social image resolution via `resolveSocialImage` utility

---

## Network Request Analysis

From provided logs, we can see:
- ✅ Recipes endpoint: Working (`/rest/v1/recipes`)
- ✅ Blog posts endpoint: Working (`/rest/v1/blog_posts`)
- ✅ Recipe ratings: Working
- ⚠️ Search function: Has errors (PGRST203 - function overloading issue)

**No 404 errors visible in network logs** - suggests issue may be environmental/routing

---

## Hypothesis & Root Cause Analysis

### Primary Hypothesis: Mobile Browser User-Agent Mismatch

**Theory:** Mobile browsers accessing links through Messenger may send user-agent strings that:
1. Don't match the current regex pattern (good)
2. But are somehow still being routed to `/api/blog-share` (bad)

**Possible Causes:**

#### 1. **Vercel Edge Caching Issue**
- Old routing rules cached at edge nodes
- Mobile requests hitting stale cache
- Desktop requests hitting updated cache

**Evidence:**
- Desktop works after changes
- Mobile still fails after changes
- Inconsistent behavior suggests caching

**Solution:** Force cache invalidation on Vercel

#### 2. **Mobile-Specific User-Agent Not Removed**
- Hidden mobile user-agent string still in regex
- Case sensitivity issue in regex matching
- Special characters in mobile user-agents

**Evidence:**
- Only mobile devices affected
- Desktop with same URL works fine

**Solution:** Analyze actual mobile user-agent strings from logs

#### 3. **Meta Refresh Failure on Mobile**
- Mobile browsers blocking meta refresh redirects
- JavaScript redirect blocked by mobile security
- Redirect happening before API returns proper response

**Evidence:**
- API endpoint generates redirect HTML
- Mobile may treat this differently than desktop

**Solution:** Use proper 301/302 HTTP redirects instead of HTML redirects

#### 4. **React Router Not Catching Route on Mobile**
- Client-side routing failure on mobile
- Service worker intercepting requests incorrectly
- PWA manifest causing routing issues

**Evidence:**
- React SPA works fine on desktop
- Same codebase fails on mobile

**Solution:** Check service worker and PWA configuration

#### 5. **Supabase Query Failing on Mobile**
- Mobile requests have different headers
- CORS issue specific to mobile browsers
- Authentication token issues on mobile

**Evidence:**
- Network logs show successful Supabase queries
- But these are from desktop session

**Solution:** Capture mobile network logs

---

## Required Diagnostic Steps

### Immediate Actions

#### 1. **Capture Mobile User-Agent Strings**
```typescript
// Add to api/blog-share.ts temporarily
console.log('User-Agent:', req.headers['user-agent']);
console.log('All Headers:', JSON.stringify(req.headers, null, 2));
```

#### 2. **Check Vercel Edge Cache**
- Go to Vercel dashboard
- Navigate to deployment
- Purge cache for blog routes
- Redeploy if necessary

#### 3. **Test Without Facebook**
- Open link directly in mobile Safari/Chrome
- Compare behavior with Messenger in-app browser
- Determine if issue is Facebook-specific

#### 4. **Enable Vercel Function Logs**
```bash
vercel logs --follow
```
Then open link on mobile and watch for:
- Which endpoint is hit (API vs SPA)
- User-agent string from mobile device
- Any errors in serverless function

#### 5. **Add Diagnostic Endpoint**
```typescript
// Create /api/debug-headers.ts
export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    userAgent: req.headers['user-agent'],
    allHeaders: req.headers,
    url: req.url,
    query: req.query
  });
}
```
Test: `https://bakinggreatbread.com/api/debug-headers`

### Secondary Analysis

#### 6. **Review Vercel Build Configuration**
- Check `outputDirectory` setting
- Verify `framework: "vite"` is correct
- Ensure SPA fallback is configured

#### 7. **Inspect Service Worker**
```typescript
// Check if service worker is interfering
// Look in src/main.tsx or vite.config.ts
// Review vite-plugin-pwa configuration
```

#### 8. **Test Alternative Redirect Method**
Instead of HTML redirect in `/api/blog-share.ts`, use HTTP redirect:
```typescript
// Replace meta refresh with:
return res.redirect(302, url);
```

#### 9. **Add Error Boundary**
```typescript
// In BlogPost.tsx, add error logging
useEffect(() => {
  console.log('BlogPost mounted:', { slug, pathname: window.location.pathname });
}, [slug]);
```

#### 10. **Check Facebook App Settings**
- Verify Facebook App ID: `1511662243358762`
- Check app domain settings
- Review OAuth redirect URIs

---

## Recommended Solutions (Priority Order)

### Solution 1: Purge Vercel Cache (HIGHEST PRIORITY)
```bash
# In Vercel Dashboard
1. Go to project settings
2. Navigate to "Deployment"
3. Click "Purge Cache"
4. Redeploy latest commit

# Or via CLI
vercel --prod --force
```

### Solution 2: Change to HTTP Redirects
```typescript
// In api/blog-share.ts
// Replace lines 96-98 with:
return res.redirect(302, url);
```

### Solution 3: Simplify User-Agent Regex
```json
// In vercel.json, change to only core crawlers
"value": ".*(facebookexternalhit|Facebot).*"
```

### Solution 4: Add Explicit Mobile Bypass
```json
{
  "source": "/blog/:slug",
  "destination": "/",
  "has": [
    {
      "type": "header",
      "key": "user-agent",
      "value": ".*(Mobile|Android|iPhone|iPad).*"
    }
  ]
},
{
  "source": "/blog/:slug",
  "destination": "/api/blog-share?slug=:slug",
  "has": [
    {
      "type": "header",
      "key": "user-agent",
      "value": ".*(facebookexternalhit|Facebot).*"
    }
  ]
}
```

### Solution 5: Remove Rewrites Entirely (NUCLEAR OPTION)
```typescript
// Handle OG tags directly in React app
// Use react-helmet-async to set meta tags
// No server-side endpoint needed
// Desktop and mobile get same experience
```

---

## Testing Checklist

After implementing solutions:

- [ ] Test link in Messenger on iPhone
- [ ] Test link in Messenger on Android
- [ ] Test link in desktop Messenger
- [ ] Test link in mobile Safari (direct)
- [ ] Test link in mobile Chrome (direct)
- [ ] Verify Facebook Debugger still works
- [ ] Verify Twitter Card validator
- [ ] Check Vercel function logs
- [ ] Monitor error rates in analytics
- [ ] Test with fbclid parameter
- [ ] Test without fbclid parameter

---

## Success Metrics

### Definition of Resolved
1. ✅ Mobile devices can open blog links from Messenger
2. ✅ No 404 errors on mobile
3. ✅ No blank pages on mobile
4. ✅ Open Graph previews still work
5. ✅ Desktop functionality maintained
6. ✅ Same behavior across iOS and Android

### Monitoring
- Set up error tracking for `/blog/*` routes
- Monitor 404 rate by device type
- Track user-agent strings hitting API endpoint
- Alert on sudden 404 spike

---

## Contact & Resources

### Vercel Documentation
- [Rewrites](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Edge Caching](https://vercel.com/docs/edge-network/caching)

### Facebook Sharing
- [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Open Graph Protocol](https://ogp.me/)

### Project Files
- `/vercel.json` - Routing configuration
- `/api/blog-share.ts` - OG metadata endpoint
- `/api/recipe-share.ts` - Recipe OG metadata (working reference)
- `/src/pages/BlogPost.tsx` - Main blog post component
- `/src/components/blog/BlogPostSEO.tsx` - SEO component
- `/src/utils/resolveSocialImage.ts` - Image resolution logic

---

## Next Steps for Debug Team

1. **Deploy diagnostic endpoint** to capture mobile user-agents
2. **Purge Vercel cache** as first troubleshooting step  
3. **Monitor Vercel logs** during mobile access attempt
4. **Test HTTP redirect** instead of HTML meta refresh
5. **Consider removing rewrites** and handling OG tags in React app

---

## Appendix: Code Snippets

### Current Rewrite Configuration
```json
{
  "rewrites": [
    {
      "source": "/recipes/:slug",
      "destination": "/api/recipe-share?slug=:slug",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(facebookexternalhit|Facebot|FacebookBot|Twitterbot|LinkedInBot).*"
        }
      ]
    },
    {
      "source": "/blog/:slug",
      "destination": "/api/blog-share?slug=:slug",
      "has": [
        {
          "type": "header",
          "key": "user-agent",
          "value": ".*(facebookexternalhit|Facebot|FacebookBot|Twitterbot|LinkedInBot).*"
        }
      ]
    }
  ]
}
```

### API Response Structure
```typescript
// /api/blog-share.ts returns HTML with:
{
  og:title: post.title
  og:description: post.subtitle or content excerpt
  og:image: social_image_url || inline_image_url || hero_image_url
  og:url: https://bakinggreatbread.com/blog/:slug
  meta-refresh: 0 seconds to actual URL
  javascript: window.location.href redirect
}
```

### React Route Handling
```typescript
// src/App.tsx
<Route path="/blog/:slug" element={<BlogPost />} />

// src/pages/BlogPost.tsx
const { slug } = useParams<{ slug: string }>();
// Queries Supabase, then WordPress fallback
// Renders with BlogPostSEO component
```

---

**Report Generated:** October 25, 2025  
**Issue Tracking ID:** MOBILE-SHARE-404  
**Priority:** HIGH  
**Status:** ACTIVE INVESTIGATION
