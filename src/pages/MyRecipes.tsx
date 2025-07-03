import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FormattedRecipeDisplay } from '@/components/FormattedRecipeDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { AIAssistantSidebar } from '@/components/AIAssistantSidebar';

const MyRecipes = () => {
  const { user, loading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [updating, setUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const { toast } = useToast();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
    }
  }, [user, loading]);

  // Fetch user recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) return;
      
      setLoadingRecipes(true);
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching recipes:', error);
        } else {
          setRecipes(data || []);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [user]);

  const handleEditClick = (recipe: any) => {
    setEditingRecipe(recipe.id);
    setEditTitle(recipe.title);
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setEditTitle('');
  };

  const handleUpdateRecipe = async (recipeId: string) => {
    if (!editTitle.trim()) {
      toast({
        title: "Error",
        description: "Recipe title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ 
          title: editTitle.trim(),
          data: { 
            ...recipes.find(r => r.id === recipeId)?.data,
            title: editTitle.trim()
          }
        })
        .eq('id', recipeId)
        .eq('user_id', user?.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update recipe. Please try again.",
          variant: "destructive",
        });
        console.error('Error updating recipe:', error);
      } else {
        // Update local state
        setRecipes(prevRecipes => 
          prevRecipes.map(recipe => 
            recipe.id === recipeId 
              ? { 
                  ...recipe, 
                  title: editTitle.trim(),
                  data: { 
                    ...recipe.data, 
                    title: editTitle.trim() 
                  }
                }
              : recipe
          )
        );
        
        setEditingRecipe(null);
        setEditTitle('');
        
        toast({
          title: "Success",
          description: "Recipe updated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating recipe:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || loadingRecipes) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <main className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-muted-foreground">
              {loadingRecipes ? 'Loading your recipes...' : 'Loading...'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="bg-background text-foreground min-h-screen relative">
      <Header />
      <main className={`py-20 px-4 transition-all duration-300 ${isSidebarOpen ? 'mr-96' : ''}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">My Recipes</h1>
            <p className="text-xl text-muted-foreground">
              Welcome back! Here are your saved recipes.
            </p>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You don't have any saved recipes yet.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/recipe-formatter">Format Your First Recipe</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
                </p>
              </div>
              <div className="grid gap-6">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        {editingRecipe === recipe.id ? (
                          <Card className="shadow-warm">
                            <CardHeader>
                              <CardTitle className="text-primary">Edit Recipe</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edit-title-${recipe.id}`}>Recipe Title</Label>
                                <Input
                                  id={`edit-title-${recipe.id}`}
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  placeholder="Enter recipe title"
                                  disabled={updating}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="hero" 
                                  onClick={() => handleUpdateRecipe(recipe.id)}
                                  disabled={updating || !editTitle.trim()}
                                >
                                  {updating ? 'Updating...' : 'Save Changes'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={handleCancelEdit}
                                  disabled={updating}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-primary">{recipe.title}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRecipe(recipe.data);
                                  setIsSidebarOpen(true);
                                }}
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
                      {editingRecipe !== recipe.id && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(recipe)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    {editingRecipe !== recipe.id && (
                      <FormattedRecipeDisplay 
                        recipe={recipe.data} 
                        imageUrl={recipe.image_url}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      <AIAssistantSidebar
        recipeContext={selectedRecipe}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
};

export default MyRecipes;