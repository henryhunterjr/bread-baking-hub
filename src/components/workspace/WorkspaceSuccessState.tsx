import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Link2, FileDown, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { copyRecipeLink, shareRecipe } from '@/utils/recipeExport';

interface WorkspaceSuccessStateProps {
  onStartOver: () => void;
  savedRecipe?: {
    id: string;
    title: string;
    slug: string | null;
  };
}

export const WorkspaceSuccessState = ({ onStartOver, savedRecipe }: WorkspaceSuccessStateProps) => {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    if (!savedRecipe?.slug) return;
    
    const success = await copyRecipeLink(savedRecipe.slug, savedRecipe.title);
    if (success) {
      toast({
        title: "Link copied!",
        description: "Recipe link has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!savedRecipe?.slug) return;
    
    await shareRecipe(savedRecipe.slug, savedRecipe.title);
  };

  return (
    <Card className="shadow-warm text-center">
      <CardContent className="pt-8 pb-8">
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Save className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">Recipe Saved Successfully!</h3>
            <p className="text-muted-foreground">
              Your recipe has been saved to your collection. You can find it in "My Recipes".
            </p>
          </div>

          {/* Quick Action Buttons */}
          {savedRecipe?.slug && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center p-4 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground sm:mr-2">Quick Actions:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  onClick={handleCopyLink} 
                  variant="outline" 
                  size="sm"
                  className="touch-manipulation"
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  size="sm"
                  className="touch-manipulation"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onStartOver} variant="hero" className="touch-manipulation">
              Create Another Recipe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};