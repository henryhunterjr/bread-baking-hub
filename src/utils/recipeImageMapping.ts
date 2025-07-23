// Recipe slug to image URL mapping
export const recipeImageMapping: Record<string, string> = {
  'why-summer-changes-your-dough': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/why-summer-changes-your-dough.png',
  'proofing-yeasted-dough-guide': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/proofing-yeasted-dough-guide.png',
  'blueberry-white-chocolate-chip-scones': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/blueberry-white-chocolate-chip-scones.jpg',
  'bulk-fermentation': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/bulk-fermentation.png',
  'this-keeps-it-simple-readable-and-keyword-friendly': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/this-keeps-it-simple-readable-and-keyword-friendly.jpg',
};

// Get recipe image with fallback logic
export const getRecipeImageUrl = (recipe: { image_url?: string; slug?: string }): string => {
  if (recipe.image_url) {
    return recipe.image_url;
  }
  
  if (recipe.slug && recipeImageMapping[recipe.slug]) {
    return recipeImageMapping[recipe.slug];
  }
  
  // Fallback to a default recipe image
  return '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png';
};