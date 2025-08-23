import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useUserRecipes } from '@/hooks/useUserRecipes';

interface FavoriteButtonProps {
  recipeId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const FavoriteButton = ({ 
  recipeId, 
  variant = 'ghost', 
  size = 'default',
  className 
}: FavoriteButtonProps) => {
  const { toggleFavorite, isRecipeFavorited, loading } = useUserRecipes();

  const isFavorited = isRecipeFavorited(recipeId);

  const handleToggleFavorite = async () => {
    await toggleFavorite(recipeId, !isFavorited);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={loading}
      className={className}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Heart 
          className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} 
        />
      )}
      {isFavorited ? 'Favorited' : 'Favorite'}
    </Button>
  );
};