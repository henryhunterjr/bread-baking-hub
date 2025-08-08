import { RecipeCard } from '@/components/RecipeCard';
import { Recipe, RecipeUpdateData, RecipeData } from '@/types';


interface RecipeListProps {
  recipes: Recipe[];
  editingRecipe: string | null;
  fullEditingRecipe: string | null;
  updating: boolean;
  onEdit: (recipe: Recipe) => void;
  onFullEdit: (recipe: Recipe) => void;
  onCancelEdit: () => void;
  onSave: (recipeId: string, title: string) => Promise<boolean>;
  onFullSave: (recipeId: string, updates: RecipeUpdateData) => Promise<boolean>;
  onAskAssistant: (recipeData: RecipeData) => void;
  allRecipes: Recipe[];
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