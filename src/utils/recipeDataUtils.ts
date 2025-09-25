// Utility functions for recipe data processing and validation

export interface StandardizedIngredient {
  item: string;
  amount_metric: string;
  amount_volume: string;
  note?: string;
}

export const standardizeIngredients = (ingredients: any): StandardizedIngredient[] => {
  console.log('Standardizing ingredients:', ingredients);
  
  if (!ingredients) {
    console.log('No ingredients provided');
    return [];
  }

  // If already an array of objects with the right structure
  if (Array.isArray(ingredients)) {
    console.log('Ingredients is array, processing each item');
    return ingredients.map((ingredient, index) => {
      if (typeof ingredient === 'string') {
        // Convert string to object format
        return {
          item: ingredient,
          amount_metric: ingredient,
          amount_volume: ingredient
        };
      } else if (typeof ingredient === 'object' && ingredient) {
        // Extract from various object formats
        return {
          item: ingredient.item || ingredient.ingredient || ingredient.name || `Ingredient ${index + 1}`,
          amount_metric: ingredient.amount_metric || ingredient.metric || ingredient.amount || '',
          amount_volume: ingredient.amount_volume || ingredient.volume || ingredient.imperial || ingredient.amount_metric || ingredient.metric || ingredient.amount || '',
          note: ingredient.note
        };
      }
      return {
        item: `Unknown ingredient ${index + 1}`,
        amount_metric: '',
        amount_volume: ''
      };
    });
  }

  // Handle object with metric/volume arrays
  if (typeof ingredients === 'object' && 'metric' in ingredients) {
    console.log('Converting metric/volume format to standardized format');
    const metricArray = ingredients.metric || [];
    const volumeArray = ingredients.volume || [];
    
    return metricArray.map((metric: string, index: number) => ({
      item: extractIngredientName(metric),
      amount_metric: metric,
      amount_volume: volumeArray[index] || metric
    }));
  }

  // Handle other object formats
  if (typeof ingredients === 'object') {
    console.log('Converting object format to array');
    const values = Object.values(ingredients);
    if (values.length > 0 && Array.isArray(values[0])) {
      return standardizeIngredients(values[0]);
    }
  }

  console.log('Unable to standardize ingredients, returning empty array');
  return [];
};

// Helper function to extract ingredient name from a full ingredient string
const extractIngredientName = (fullIngredient: string): string => {
  // Try to extract just the ingredient name from strings like "500g bread flour"
  const match = fullIngredient.match(/[\d\s\/¼½¾\-\.]+(.+)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return fullIngredient;
};

// Validate recipe data structure
export const validateRecipeData = (recipe: any): boolean => {
  console.log('Validating recipe data:', recipe);
  
  if (!recipe) {
    console.log('No recipe provided');
    return false;
  }

  if (!recipe.title) {
    console.log('Recipe missing title');
    return false;
  }

  if (!recipe.ingredients) {
    console.log('Recipe missing ingredients');
    return false;
  }

  return true;
};