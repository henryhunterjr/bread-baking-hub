import { RecipeCard } from '@/components/RecipeCard';

interface RecipeListProps {
  recipes: any[];
  editingRecipe: string | null;
  fullEditingRecipe: string | null;
  updating: boolean;
  onEdit: (recipe: any) => void;
  onFullEdit: (recipe: any) => void;
  onCancelEdit: () => void;
  onSave: (recipeId: string, title: string) => Promise<boolean>;
  onFullSave: (recipeId: string, updates: { data: any; image_url?: string; folder?: string; tags?: string[]; is_public?: boolean; slug?: string }) => Promise<boolean>;
  onAskAssistant: (recipeData: any) => void;
  allRecipes: any[];
}

export const RecipeList = ({
  recipes,
  editingRecipe,
  fullEditingRecipe,
  updating,
  onEdit,
  onFullEdit,
  onCancelEdit,
  onSave,
  onFullSave,
  onAskAssistant,
  allRecipes
}: RecipeListProps) => {
  return (
    <div className="grid gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isEditing={editingRecipe === recipe.id}
          isFullEditing={fullEditingRecipe === recipe.id}
          updating={updating}
          onEdit={() => onEdit(recipe)}
          onFullEdit={() => onFullEdit(recipe)}
          onCancelEdit={onCancelEdit}
          onSave={onSave}
          onFullSave={onFullSave}
          onAskAssistant={onAskAssistant}
          allRecipes={allRecipes}
        />
      ))}
    </div>
  );
};