import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck, Loader2 } from 'lucide-react';
import { useUserRecipes } from '@/hooks/useUserRecipes';

interface SaveRecipeButtonProps {
  recipeId: string;
  recipeTitle: string;
  recipeSlug?: string;
  folder?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const SaveRecipeButton = ({ 
  recipeId,
  recipeTitle,
  recipeSlug,
  folder,
  variant = 'outline', 
  size = 'default',
  className 
}: SaveRecipeButtonProps) => {
  const { saveRecipe, removeRecipe, isRecipeSaved, loading } = useUserRecipes();

  const isSaved = isRecipeSaved(recipeId);

  const handleToggleSave = async () => {
    if (isSaved) {
      await removeRecipe(recipeId);
    } else {
      await saveRecipe({
        recipe_id: recipeId,
        title: recipeTitle,
        slug: recipeSlug,
        folder,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={loading}
      className={className}
      aria-label={isSaved ? 'Remove from library' : 'Save to library'}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="w-4 h-4 mr-2" />
      ) : (
        <BookmarkPlus className="w-4 h-4 mr-2" />
      )}
      {isSaved ? 'Saved' : 'Save Recipe'}
    </Button>
  );
};