# Recipe Image Upload Protocol

## Overview
This document outlines the proper procedure for uploading new recipes and managing their associated images to avoid image loading issues.

## Image Priority System
The `getRecipeImage()` function follows this priority order:
1. **Database `image_url`** (highest priority)
2. **Mapping file fallback** (`recipeImageMapping.ts`)
3. **Random fallback** (lowest priority)

## Upload Procedures

### 1. New Recipe Creation
When creating a new recipe:

```sql
INSERT INTO public.recipes (
  title, slug, data, image_url, is_public, user_id
) VALUES (
  'Recipe Title',
  'recipe-slug',
  '{"season": "Winter", "holidays": [], ...}',
  '/lovable-uploads/your-image-url.png',  -- SET THIS
  true,
  user_id
);
```

**✅ RECOMMENDED:** Set `image_url` directly in database for new recipes.

### 2. Existing Recipe Image Updates

#### Option A: Database Update (Recommended)
```sql
UPDATE public.recipes 
SET image_url = '/lovable-uploads/new-image-url.png'
WHERE slug = 'recipe-slug';
```

#### Option B: Mapping File (Fallback only)
Only use `recipeImageMapping.ts` if:
- Recipe has no `image_url` in database
- Recipe has broken staging URLs
- Need temporary image override

### 3. Image Upload Location
- **Upload to:** Lovable uploads (`/lovable-uploads/`)
- **Format:** PNG/JPG/WebP
- **Size:** Optimize for web (recommended: 800x600px max)

## Debugging Protocol

### 1. Check Console Logs
Look for these debug messages:
```
🔍 getRecipeImage DEBUG: { slug: "recipe-slug", imageUrl: "..." }
✅ Using direct URL for recipe-slug : /lovable-uploads/...
✅ Using mapping URL for recipe-slug : /lovable-uploads/...
⚠️ Using fallback URL for recipe-slug : https://...
```

### 2. Verify Database State
```sql
SELECT slug, title, image_url 
FROM public.recipes 
WHERE slug = 'recipe-slug';
```

### 3. Check Mapping File
Verify entry in `src/utils/recipeImageMapping.ts`:
```typescript
"recipe-slug": "/lovable-uploads/image-url.png",
```

## Troubleshooting Guide

### Problem: Image Not Showing
1. **Check console:** Look for "Using direct URL" vs "Using mapping URL"
2. **Database wins:** If console shows "direct URL", database `image_url` overrides mapping
3. **Update database:** Use SQL to update `image_url` field
4. **Verify URL:** Ensure uploaded image URL is accessible

### Problem: Wrong Image Displaying
1. **Console debug:** Check which URL is being used
2. **Database priority:** Update database `image_url` first
3. **Clear cache:** Refresh page to see changes

### Problem: Broken/Staging URLs
- Database contains staging URLs (e.g., `wpcomstaging.com`)
- System automatically falls back to mapping file
- Update database with production URL

## Best Practices

### ✅ DO:
- Upload images to `/lovable-uploads/` via Lovable interface
- Set `image_url` in database for new recipes
- Use meaningful image filenames
- Test image URLs before setting
- Check console logs when debugging

### ❌ DON'T:
- Mix database URLs and mapping file entries for same recipe
- Use staging/temporary URLs in production database
- Forget to set `image_url` for new recipes
- Rely solely on mapping file for active recipes

## Quick Reference Commands

### Update Recipe Image:
```sql
UPDATE public.recipes 
SET image_url = '/lovable-uploads/NEW-IMAGE-URL.png'
WHERE slug = 'recipe-slug';
```

### Check Recipe Status:
```sql
SELECT slug, title, image_url, is_public 
FROM public.recipes 
WHERE slug = 'recipe-slug';
```

### Debug Function Call:
Check browser console for `getRecipeImage DEBUG` messages.

## Migration Notes
- Legacy recipes may use mapping file
- New recipes should use database `image_url`
- Gradually migrate mapping entries to database
- Keep mapping file for fallback scenarios

---
**Last Updated:** Based on Rosemary Garlic & Parmesan Loaf debugging session
**Key Learning:** Database `image_url` always overrides mapping file