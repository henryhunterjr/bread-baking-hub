import { Folder } from 'lucide-react';
import { RecipeList } from '@/components/RecipeList';

interface FolderGroupProps {
  folder: string;
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