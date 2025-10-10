export interface FormattedRecipe {
  title: string;
  introduction: string;
  author_name?: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  servings?: string;
  course?: string;
  cuisine?: string;
  equipment?: string[];
  ingredients: any;
  method: any;
  tips: string[];
  troubleshooting: any;
  tags?: string[];
  recommended_products?: string[];
}

export interface RecipeWithImage {
  recipe: FormattedRecipe;
  imageUrl?: string;
}

export type WorkspaceStep = 'upload' | 'review' | 'edit' | 'save';