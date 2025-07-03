import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NoRecipesProps {
  hasRecipes: boolean;
  hasFilteredResults: boolean;
}

export const NoRecipes = ({ hasRecipes, hasFilteredResults }: NoRecipesProps) => {
  if (!hasRecipes) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          You don't have any saved recipes yet.
        </p>
        <Button variant="hero" size="lg" asChild>
          <Link to="/recipe-formatter">Format Your First Recipe</Link>
        </Button>
      </div>
    );
  }

  if (!hasFilteredResults) {
    return (
      <div className="text-center text-muted-foreground">
        No recipes match your current filters.
      </div>
    );
  }

  return null;
};