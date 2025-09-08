// Standardized Recipe type definitions

export interface StandardRecipe {
  id: string;
  title: string;
  slug: string;
  heroImage: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  summary: string;
  seoDescription?: string;
  yield: string; // e.g., "8 servings", "2 loaves"
  servings: number;
  categories: string[];
  tags: string[];
  ingredients: StandardIngredient[];
  steps: StandardStep[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  author: {
    name: string;
    avatar?: string;
  };
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface StandardIngredient {
  item: string;
  amount?: string;
  unit?: string;
  note?: string;
}

export interface StandardStep {
  step: number;
  instruction: string;
  image?: string;
  timer?: number; // minutes
}

// Legacy Recipe type from Supabase
export interface LegacyRecipe {
  id: string;
  user_id: string;
  title: string;
  data: any; // Variable structure
  image_url?: string;
  folder?: string;
  tags?: string[];
  is_public?: boolean;
  slug?: string;
  created_at: string;
  updated_at: string;
}

// Recipe mapping utilities
export function mapLegacyToStandard(legacy: LegacyRecipe): StandardRecipe {
  const data = legacy.data || {};
  
  // Normalize ingredients
  const ingredients: StandardIngredient[] = [];
  if (Array.isArray(data.ingredients)) {
    data.ingredients.forEach((ing: any) => {
      if (typeof ing === 'string') {
        ingredients.push({ item: ing });
      } else if (ing && typeof ing === 'object') {
        ingredients.push({
          item: ing.item || ing.ingredient || '',
          amount: ing.amount_metric || ing.amount_volume || ing.amount || '',
          unit: ing.unit || '',
          note: ing.note || ''
        });
      }
    });
  }

  // Normalize steps
  const steps: StandardStep[] = [];
  if (Array.isArray(data.method)) {
    data.method.forEach((step: any, index: number) => {
      if (typeof step === 'string') {
        steps.push({ step: index + 1, instruction: step });
      } else if (step && typeof step === 'object') {
        steps.push({
          step: step.step || index + 1,
          instruction: step.instruction || step.text || '',
          image: step.image,
          timer: step.timer
        });
      }
    });
  }

  return {
    id: legacy.id,
    title: legacy.title || 'Untitled Recipe',
    slug: legacy.slug || '',
    heroImage: {
      url: legacy.image_url || '/og-default.jpg',
      alt: `${legacy.title} recipe image`,
      width: 1200,
      height: 630
    },
    summary: data.description || data.introduction || data.notes || `A delicious recipe for ${legacy.title}`,
    seoDescription: data.seoDescription,
    yield: data.servings || data.yield || '4 servings',
    servings: parseInt(data.servings) || 4,
    categories: legacy.tags || [],
    tags: legacy.tags || [],
    ingredients,
    steps,
    prepTime: data.prep_time || data.prepTime,
    cookTime: data.cook_time || data.cookTime,
    totalTime: data.total_time || data.totalTime,
    difficulty: data.difficulty,
    author: {
      name: 'Henry Hunter',
      avatar: '/author-avatar.jpg'
    },
    nutrition: data.nutrition,
    createdAt: legacy.created_at,
    updatedAt: legacy.updated_at,
    isPublic: legacy.is_public || false
  };
}

export function getRecipeOGImage(recipe: StandardRecipe): string {
  // Ensure the hero image is publicly accessible and meets OG requirements
  const imageUrl = recipe.heroImage.url;
  
  // If it's already a full URL, return it
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path, make it absolute
  if (imageUrl.startsWith('/')) {
    return `${window.location.origin}${imageUrl}`;
  }
  
  // Fallback to default OG image
  return `${window.location.origin}/og-default.jpg`;
}

export function getRecipeURL(recipe: StandardRecipe): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/recipes/${recipe.slug}`;
}