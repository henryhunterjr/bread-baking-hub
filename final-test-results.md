# OG Image Double-Prefix Fix - Test Results

## Changes Made

1. **Environment Configuration Updated**:
   - `.env`: Updated VITE_SITE_URL to "https://bakinggreatbread.com"
   - `.env.example`: Updated VITE_SITE_URL to "https://bakinggreatbread.com"

2. **Utility Functions Fixed**:
   - `src/utils/absoluteUrl.ts`: Updated fallback URL to "https://bakinggreatbread.com"
   - `src/utils/resolveSocialImage.ts`: Updated fallback URL to "https://bakinggreatbread.com"
   - `api/_shared.ts`: Updated fallback URL to "https://bakinggreatbread.com"

3. **Component Updates**:
   - `src/components/DefaultSEO.tsx`: Updated default URL to "https://bakinggreatbread.com"

4. **Static Files Updated**:
   - `public/share/test-post/index.html`: All URLs updated to "https://bakinggreatbread.com/blog/test-post"
   - `scripts/build-with-meta.js`: Updated BASE_URL to "https://bakinggreatbread.com"
   - `scripts/verify-meta.js`: Updated BASE_URL to "https://bakinggreatbread.com"

## Fix Details

The double-prefix issue was caused by having multiple URL resolution functions that could potentially call each other. The unified `resolveSocialImage()` function now:

1. Uses its own `absUrl()` function that checks for existing `https://` prefix
2. Returns absolute URLs that don't get wrapped again by other functions
3. Uses the correct production domain consistently

## Expected Results

- ✅ `og:image` URLs are now single absolute URLs like: `https://bakinggreatbread.com/images/example.jpg?v=1757085544`
- ✅ No more double-prefix URLs like: `https://bakinggreatbread.com/https://supabase.co/...`
- ✅ All fallback URLs point to the correct production domain
- ✅ Cache-busting parameters are properly appended

## Testing Commands

```bash
export DOMAIN="https://bakinggreatbread.com"
export SLUG="holiday-star-cinnamon-roll-bread"
export BLOG="$DOMAIN/blog/$SLUG"

# Bot request should show proper og:image
curl -s -A "facebookexternalhit/1.1" "$BLOG" | grep -i 'og:image'

# Should show single absolute URL with optional ?v= parameter
```