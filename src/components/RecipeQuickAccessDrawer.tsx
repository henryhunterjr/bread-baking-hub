import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Clock, ChevronUp, ChevronDown, FolderOpen } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import { getImageForRecipe } from '@/utils/heroImageMapping';

interface RecipeQuickAccessDrawerProps {
  onRecipeSelect?: (recipe: any) => void;
}

export const RecipeQuickAccessDrawer = ({ onRecipeSelect }: RecipeQuickAccessDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { recipes, loading } = useRecipes();
  const { user } = useAuth();

  if (!user || loading) return null;

  const recentRecipes = recipes.slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-4xl mx-auto p-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-background/95 backdrop-blur-sm shadow-warm touch-manipulation"
            >
              <Clock className="h-4 w-4 mr-2" />
              Recent Recipes ({recentRecipes.length})
              {isOpen ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronUp className="h-4 w-4 ml-2" />}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="bottom" className="max-h-[60vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Recipes
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-4 space-y-3 max-h-[50vh] overflow-y-auto">
              {recentRecipes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent recipes</p>
                  <p className="text-sm">Your saved recipes will appear here</p>
                </div>
              ) : (
                recentRecipes.map((recipe) => (
                  <Card 
                    key={recipe.id}
                    className="cursor-pointer hover:shadow-warm transition-shadow touch-manipulation"
                    onClick={() => {
                      onRecipeSelect?.(recipe);
                      setIsOpen(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary truncate">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(recipe.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {recipe.folder && (
                              <Badge variant="outline" className="text-xs">
                                <FolderOpen className="h-3 w-3 mr-1" />
                                {recipe.folder}
                              </Badge>
                            )}
                            {recipe.is_public && (
                              <Badge variant="secondary" className="text-xs">
                                Public
                              </Badge>
                            )}
                            {recipe.tags?.slice(0, 2).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {recipe.tags?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{recipe.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {getImageForRecipe(recipe) !== '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png' && (
                          <img
                            src={getImageForRecipe(recipe)}
                            alt={recipe.title}
                            className="w-16 h-16 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};