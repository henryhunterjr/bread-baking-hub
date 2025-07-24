// Recipe slug to image URL mapping
export const recipeImageMapping: Record<string, string> = {
  'blueberry-lemon-scones': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/blueberry-white-chocolate-chip-scones.jpg',
  'pumpernickel-bread': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'light-sourdough-batard': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'rustic-italian-ciabatta': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'easter-paska': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'sourdough-bagels': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'cheddar-and-chive-biscuits': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'olive-and-rosemary-focaccia': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'sourdough-pizza-dough': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'jalapeno-cheddar-cornbread': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'sourdough-english-muffins': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'honey-oatmeal-bread': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'rosemary-garlic-focaccia': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'sun-dried-tomato-and-feta-bread': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'apricot-almond-sourdough': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'cherry-vanilla-sourdough': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'fig-and-walnut-sourdough': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'multigrain-sandwich-loaf': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'caramelized-onion-and-gruyere-fougasse': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'spiced-pear-bread': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'sourdough-pretzels': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'buttermilk-potato-rolls': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'apple-cider-bread': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'spiced-holiday-bread': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'nutty-whole-grain-sourdough': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'roasted-garlic-and-rosemary-sourdough': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'spiced-chocolate-bread': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'basic-sourdough-loaf': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'brioche-hamburger-buns': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'hot-dog-buns': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'grilled-flatbread-with-toppings': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'zucchini-bread': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'spring-herb-rolls': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'cranberry-walnut-loaf': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
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