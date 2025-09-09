// Recipe data normalization to prevent crashes from mixed data shapes

export type UiIngredient = { 
  qty?: string; 
  unit?: string; 
  item: string; 
  notes?: string; 
};

export type UiStep = {
  step: number;
  instruction: string;
  image?: string;
  timer?: number;
};

export type NormalizedRecipe = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  seoDescription?: string;
  heroImage: { url: string };
  yield: string;
  servings?: number;
  categories: string[];
  ingredients: UiIngredient[];
  steps: UiStep[];
  isPublic: boolean;
  data: any; // Keep original data for compatibility
  image_url?: string; // Keep for compatibility
};

export function normalizeRecipe(db: any): NormalizedRecipe {
  const hero = db.heroImage?.url || db.image_url || "/og-default.jpg";
  
  // Normalize ingredients from various possible formats
  const ingredients: UiIngredient[] = [];
  const rawIngredients = db.data?.ingredients || db.ingredients || [];
  
  if (Array.isArray(rawIngredients)) {
    rawIngredients.forEach((ing: any) => {
      if (typeof ing === "string") {
        ingredients.push({ item: ing });
      } else if (ing && typeof ing === "object") {
        ingredients.push({
          qty: ing.amount_metric ?? ing.amount_volume ?? ing.amount ?? ing.qty ?? "",
          unit: ing.unit ?? "",
          item: ing.item ?? ing.ingredient ?? "",
          notes: ing.note ?? ing.notes ?? "",
        });
      }
    });
  }

  // Normalize steps/instructions
  const steps: UiStep[] = [];
  const rawSteps = db.data?.method || db.data?.instructions || db.steps || db.instructions || [];
  
  if (Array.isArray(rawSteps)) {
    rawSteps.forEach((step: any, index: number) => {
      if (typeof step === "string") {
        steps.push({ step: index + 1, instruction: step });
      } else if (step && typeof step === "object") {
        steps.push({
          step: step.step || index + 1,
          instruction: step.instruction || step.text || step.toString(),
          image: step.image,
          timer: step.timer
        });
      }
    });
  }

  return {
    id: db.id || "",
    title: db.title ?? "Recipe",
    slug: db.slug ?? "",
    summary: db.data?.description ?? db.data?.introduction ?? db.summary ?? "",
    seoDescription: db.data?.seoDescription ?? db.seoDescription,
    heroImage: { url: hero },
    yield: db.data?.yield ?? db.data?.servings ?? db.yield ?? db.servings ?? "4 servings",
    servings: parseInt(db.data?.servings ?? db.servings) || 4,
    categories: db.data?.categories ?? db.categories ?? db.tags ?? [],
    ingredients,
    steps,
    isPublic: !!db.is_public,
    data: db.data || db, // Keep original for compatibility
    image_url: hero, // Keep for compatibility
  };
}

// Validate recipe has minimum required data for sharing/display
export function validateRecipeForSharing(recipe: NormalizedRecipe): { 
  isValid: boolean; 
  issues: string[]; 
} {
  const issues: string[] = [];
  
  if (!recipe.title?.trim()) issues.push("Missing title");
  if (!recipe.slug?.trim()) issues.push("Missing slug");
  if (!recipe.ingredients?.length) issues.push("No ingredients");
  if (!recipe.steps?.length) issues.push("No instructions");
  
  return {
    isValid: issues.length === 0,
    issues
  };
}