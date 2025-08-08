import { Folder } from 'lucide-react';
import { RecipeList } from '@/components/RecipeList';
import { Recipe, RecipeUpdateData, RecipeData } from '@/types';

interface FolderGroupProps {
  folder: string;
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


export const FolderGroup = ({
  folder,
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
}: FolderGroupProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        <Folder className="h-5 w-5" />
        {folder}
        <span className="text-sm text-muted-foreground">
          ({recipes.length} recipe{recipes.length !== 1 ? 's' : ''})
        </span>
      </h3>
      <RecipeList
        recipes={recipes}
        editingRecipe={editingRecipe}
        fullEditingRecipe={fullEditingRecipe}
        updating={updating}
        onEdit={onEdit}
        onFullEdit={onFullEdit}
        onCancelEdit={onCancelEdit}
        onSave={onSave}
        onFullSave={onFullSave}
        onAskAssistant={onAskAssistant}
        allRecipes={allRecipes}
      />
    </div>
  );
};