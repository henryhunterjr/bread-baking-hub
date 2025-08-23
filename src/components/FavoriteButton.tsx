import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  recipeSlug: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const FavoriteButton = ({ 
  recipeSlug, 
  variant = 'outline', 
  size = 'default',
  className 
}: FavoriteButtonProps) => {
  const { isRecipeFavorited, toggleFavorite, loading } = useUserRecipes();
  const favorited = isRecipeFavorited(recipeSlug);

  const handleToggle = async () => {
    await toggleFavorite(recipeSlug, !favorited);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={loading}
      className={cn(className)}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={cn(
          "w-4 h-4 mr-2", 
          favorited ? "fill-current text-red-500" : "text-muted-foreground"
        )} 
      />
      {favorited ? 'Favorited' : 'Favorite'}
    </Button>
  );
};