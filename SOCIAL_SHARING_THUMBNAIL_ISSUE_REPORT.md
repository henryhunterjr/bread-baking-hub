# Social Sharing Thumbnail Issue Report
*Date: 2025-08-30*
*Issue: Challah bread recipe showing wrong thumbnail on Facebook*

## Problem Summary
The Henry's round challah bread recipe (URL: `/recipes/challah-bread`) is displaying the generic "Baking Great Bread at Home" thumbnail instead of the specific challah bread image when shared on Facebook.

## Root Cause Analysis

### 1. Image Mapping System
✅ **FIXED**: The `recipeImageMapping.ts` file now correctly maps:
```javascript
"challah-bread": "https://bakinggreatbread.blog/wp-content/uploads/2023/06/img_3677.jpg"
```

### 2. Critical Issue: PublicRecipe.tsx NOT Using Image Mapping
❌ **MAJOR PROBLEM FOUND**: The `PublicRecipe.tsx` component (lines 62, 74) is NOT using the `getRecipeImage()` function from the mapping system.

**Current problematic code:**
```javascript
// Line 62 - Open Graph
<meta property="og:image" content={(recipe.data as any)?.social_image_url || recipe.image_url || 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/default-recipe.jpg'} />

// Line 74 - Twitter Card  
<meta name="twitter:image" content={(recipe.data as any)?.social_image_url || recipe.image_url || 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/default-recipe.jpg'} />
```

**This is falling back to the default image because:**
- `recipe.data.social_image_url` is likely null/undefined
- `recipe.image_url` is likely null/undefined  
- So it uses the default fallback: `default-recipe.jpg`

### 3. Other Components Using Image Mapping Correctly
✅ These components ARE using `getRecipeImage()` correctly:
- `FormattedRecipeDisplay.tsx`
- `SeasonalRecipeCard.tsx` 
- `SeasonalRecipeModal.tsx`
- `RecipePrint.tsx`

## Impact Assessment
- **Affected**: All public recipe pages (`/recipes/{slug}`) when shared on social media
- **Scope**: Every single recipe will show wrong thumbnail on Facebook/Twitter
- **User Experience**: Poor social sharing experience, incorrect recipe representation

## Required Fix
The `PublicRecipe.tsx` component must be updated to use the `getRecipeImage()` function with the recipe slug as the primary source for social media images.

**Proposed fix:**
```javascript
import { getRecipeImage } from '@/utils/recipeImageMapping';

// In the component:
const socialImageUrl = getRecipeImage(recipe.slug, (recipe.data as any)?.social_image_url || recipe.image_url);

// Then use socialImageUrl in meta tags:
<meta property="og:image" content={socialImageUrl} />
<meta name="twitter:image" content={socialImageUrl} />
```

## Additional Considerations
1. **Facebook Cache**: After fixing, may need to use Facebook Sharing Debugger to refresh cached images
2. **All Recipes Affected**: This fix will improve social sharing for ALL recipes, not just challah bread
3. **Consistency**: This will make social sharing consistent with how recipe images are displayed throughout the app

## Next Steps
1. ✅ Update `recipeImageMapping.ts` with correct challah bread mapping (COMPLETED)
2. ❌ **URGENT**: Fix `PublicRecipe.tsx` to use `getRecipeImage()` function (REQUIRED)
3. Deploy and test social sharing
4. Clear Facebook cache using FB Sharing Debugger
5. Verify all recipe social shares show correct thumbnails

## Technical Debt
- Consider creating a unified `RecipeSEO` component that handles all recipe social meta tags consistently
- Audit all recipe-related pages to ensure consistent image handling
- Add validation to ensure recipe image mapping coverage

---
**Priority**: HIGH - Affects all recipe social sharing
**Estimated Fix Time**: 5 minutes to implement, 15 minutes for deployment and testing