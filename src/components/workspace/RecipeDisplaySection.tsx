import { Button } from '@/components/ui/button';
import { FormattedRecipeDisplay } from '@/components/FormattedRecipeDisplay';
import { FullRecipeEditForm } from '@/components/FullRecipeEditForm';
import { RecipeImageUploader } from '@/components/RecipeImageUploader';
import { RecipeActionsToolbar } from '@/components/RecipeActionsToolbar';
import { RecipeShareButton } from '@/components/RecipeShareButton';
import { Edit, ChefHat } from 'lucide-react';
import { FormattedRecipe, RecipeWithImage } from '@/types/recipe-workspace';

interface RecipeDisplaySectionProps {
  formattedRecipe: RecipeWithImage;
  editedRecipe: FormattedRecipe | null;
  recipeImageUrl: string;
  isEditMode: boolean;
  user: any;
  savedRecipeInfo?: { id: string; slug: string | null };
  onEditToggle: () => void;
  onRecipeUpdate: (recipeId: string, updates: any) => Promise<boolean>;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
  onRecipeSaved: (recipeId: string, slug: string | null) => void;
  onStartOver: () => void;
}

export const RecipeDisplaySection = ({
  formattedRecipe,
  editedRecipe,
  recipeImageUrl,
  isEditMode,
  user,
  savedRecipeInfo,
  onEditToggle,
  onRecipeUpdate,
  onImageUploaded,
  onImageRemoved,
  onRecipeSaved,
  onStartOver,
}: RecipeDisplaySectionProps) => {
  return (
    <div className="space-y-8">
      {/* Review Section */}
      {!isEditMode && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Formatted Recipe</h2>
            <div className="flex gap-2">
              {savedRecipeInfo?.slug && (
                <RecipeShareButton 
                  recipe={{ 
                    id: savedRecipeInfo.id, 
                    title: editedRecipe?.title || formattedRecipe.recipe.title,
                    slug: savedRecipeInfo.slug 
                  }}
                  variant="outline"
                  size="default"
                />
              )}
              <Button onClick={onEditToggle} variant="outline" className="touch-manipulation">
                <Edit className="h-4 w-4 mr-2" />
                Edit Recipe
              </Button>
              <Button onClick={onStartOver} variant="outline" className="touch-manipulation">
                Start Over
              </Button>
            </div>
          </div>
          <FormattedRecipeDisplay 
            recipe={editedRecipe || formattedRecipe.recipe} 
            imageUrl={recipeImageUrl}
          />
        </div>
      )}

      {/* Edit Section */}
      {isEditMode && editedRecipe && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Edit Recipe Details</h2>
            <Button onClick={onEditToggle} variant="outline" className="touch-manipulation">
              <ChefHat className="h-4 w-4 mr-2" />
              Back to Review
            </Button>
          </div>
          <FullRecipeEditForm
            recipe={{ 
              id: 'temp', 
              title: editedRecipe.title, 
              data: editedRecipe,
              image_url: recipeImageUrl,
              user_id: user?.id || '',
              folder: '',
              tags: [],
              is_public: false,
              slug: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }}
            onSave={onRecipeUpdate}
            onCancel={onEditToggle}
            updating={false}
          />
        </div>
      )}

      {/* Image Upload Section */}
      {!isEditMode && (
        <RecipeImageUploader
          currentImageUrl={recipeImageUrl}
          onImageUploaded={onImageUploaded}
          onImageRemoved={onImageRemoved}
        />
      )}

      {/* Actions Toolbar */}
      {!isEditMode && user && (
        <RecipeActionsToolbar
          recipe={editedRecipe || formattedRecipe.recipe}
          imageUrl={recipeImageUrl}
          onSaved={onRecipeSaved}
        />
      )}
    </div>
  );
};