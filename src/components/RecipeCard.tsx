import { Button } from '@/components/ui/button';
import { FormattedRecipeDisplay } from '@/components/FormattedRecipeDisplay';
import { RecipeEditForm } from './RecipeEditForm';

interface RecipeCardProps {
  recipe: any;
  isEditing: boolean;
  updating: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (recipeId: string, title: string) => Promise<boolean>;
  onAskAssistant: (recipe: any) => void;
}

export const RecipeCard = ({ 
  recipe, 
  isEditing, 
  updating, 
  onEdit, 
  onCancelEdit, 
  onSave, 
  onAskAssistant 
}: RecipeCardProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </div>
      {!isEditing && (
        <FormattedRecipeDisplay 
          recipe={recipe.data} 
          imageUrl={recipe.image_url}
        />
      )}
    </div>
  );
};