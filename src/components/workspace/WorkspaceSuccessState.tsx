import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { RecipeShareButton } from '@/components/RecipeShareButton';

interface WorkspaceSuccessStateProps {
  onStartOver: () => void;
  savedRecipe?: {
    id: string;
    title: string;
    slug: string | null;
  };
}

export const WorkspaceSuccessState = ({ onStartOver, savedRecipe }: WorkspaceSuccessStateProps) => {
  return (
    <Card className="shadow-warm text-center">
      <CardContent className="pt-8 pb-8">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Save className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-primary">Recipe Saved Successfully!</h3>
          <p className="text-muted-foreground">
            Your recipe has been saved to your collection. You can find it in "My Recipes".
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onStartOver} variant="hero" className="touch-manipulation">
              Create Another Recipe
            </Button>
            {savedRecipe?.slug && (
              <RecipeShareButton 
                recipe={savedRecipe}
                variant="outline"
                size="default"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};