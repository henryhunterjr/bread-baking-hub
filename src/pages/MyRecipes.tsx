import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FormattedRecipeDisplay } from '@/components/FormattedRecipeDisplay';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MyRecipes = () => {
  const { user, loading } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

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
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main className="py-20 px-4">
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
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{recipe.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Saved on {new Date(recipe.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <FormattedRecipeDisplay recipe={recipe.data} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyRecipes;