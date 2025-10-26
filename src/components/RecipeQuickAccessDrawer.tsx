import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, ChevronUp, ChevronDown, FolderOpen, Trash2 } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import { getImageForRecipe } from '@/utils/heroImageMapping';
import { RecipeCardImage } from '@/components/ui/OptimizedImage';

interface RecipeQuickAccessDrawerProps {
  onRecipeSelect?: (recipe: any) => void;
}

export const RecipeQuickAccessDrawer = ({ onRecipeSelect }: RecipeQuickAccessDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { recipes, loading, deleteRecipe } = useRecipes();
  const { user } = useAuth();

  const handleDelete = async (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    setDeletingId(recipeId);
    await deleteRecipe(recipeId);
    setDeletingId(null);
  };

  if (!user || loading) return null;

  const recentRecipes = recipes.slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="max-w-4xl mx-auto p-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-primary/20 text-primary border-primary/30 backdrop-blur-sm shadow-warm touch-manipulation hover:bg-primary/30 hover:text-primary transition-all"
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
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-primary truncate">
                              {recipe.title}
                            </h3>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 shrink-0"
                                  disabled={deletingId === recipe.id}
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label="Delete recipe"
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={(e) => handleDelete(e, recipe.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
                           <RecipeCardImage
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