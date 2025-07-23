import { Button } from '@/components/ui/button';
import { FormattedRecipeDisplay } from '@/components/FormattedRecipeDisplay';
import { RecipeEditForm } from './RecipeEditForm';
import { FullRecipeEditForm } from './FullRecipeEditForm';
import { RecipeVersionManager } from './RecipeVersionManager';
import { memo } from 'react';

interface RecipeCardProps {
  recipe: any;
  isEditing: boolean;
  isFullEditing: boolean;
  updating: boolean;
  onEdit: () => void;
  onFullEdit: () => void;
  onCancelEdit: () => void;
  onSave: (recipeId: string, title: string) => Promise<boolean>;
  onFullSave: (recipeId: string, updates: { data: any; image_url?: string; folder?: string; tags?: string[]; is_public?: boolean; slug?: string }) => Promise<boolean>;
  onAskAssistant: (recipe: any) => void;
  allRecipes?: any[];
}

export const RecipeCard = memo(({ 
  recipe, 
  isEditing, 
  isFullEditing,
  updating, 
  onEdit, 
  onFullEdit,
  onCancelEdit, 
  onSave, 
  onFullSave,
  onAskAssistant,
  allRecipes = []
}: RecipeCardProps) => {
  if (isFullEditing) {
    return (
      <div className="border rounded-lg p-4">
        <FullRecipeEditForm
          recipe={recipe}
          onSave={onFullSave}
          onCancel={onCancelEdit}
          updating={updating}
          allRecipes={allRecipes}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div className="flex-1">
          {isEditing ? (
            <RecipeEditForm
              recipe={recipe}
              onSave={onSave}
              onCancel={onCancelEdit}
              updating={updating}
            />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-primary">{recipe.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAskAssistant(recipe.data)}
                  className="text-xs"
                >
                  Ask Baker's Helper
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Saved on {new Date(recipe.created_at).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
        {!isEditing && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <RecipeVersionManager 
              recipeId={recipe.id}
              onVersionRestored={() => window.location.reload()}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEdit}
              className="w-full sm:w-auto touch-manipulation"
            >
              Edit Title
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              onClick={onFullEdit}
              className="w-full sm:w-auto touch-manipulation"
            >
              Edit Recipe
            </Button>
          </div>
        )}
      </div>
      {!isEditing && (
        <FormattedRecipeDisplay 
          recipe={recipe.data} 
          imageUrl={recipe.image_url}
          recipeData={recipe}
        />
      )}
    </div>
  );
});