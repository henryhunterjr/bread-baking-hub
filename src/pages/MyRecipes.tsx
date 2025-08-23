import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/SafeImage';
import { Search, Star, Eye, Trash2, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getRecipeImage } from '@/utils/recipeImageMapping';

interface UserRecipe {
  id: string;
  created_at: string;
  recipe: {
    id: string;
    title: string;
    slug: string;
    image_url?: string;
    tags?: string[];
    data: any;
  };
}

const MyRecipes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchMyRecipes();
    }
  }, [user, authLoading, navigate]);

  const fetchMyRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select(`
          id,
          created_at,
          recipe:recipes(
            id,
            title,
            slug,
            image_url,
            tags,
            data
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching my recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load your recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromLibrary = async (userRecipeId: string) => {
    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('id', userRecipeId);

      if (error) throw error;

      setRecipes(prev => prev.filter(r => r.id !== userRecipeId));
      toast({
        title: "Removed from library",
        description: "Recipe has been removed from your library.",
      });
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast({
        title: "Error",
        description: "Failed to remove recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredRecipes = recipes.filter(userRecipe =>
    userRecipe.recipe?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userRecipe.recipe?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background" role="main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Recipe Library</h1>
          <p className="text-muted-foreground">Your saved recipes from across the site</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <Star className="mx-auto w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery ? 'No recipes found' : 'No saved recipes yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Save recipes from the site to see them here'
              }
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((userRecipe) => {
              const recipe = userRecipe.recipe;
              if (!recipe) return null;

              const imageUrl = getRecipeImage(recipe.slug, recipe.image_url);
              const excerpt = recipe.data?.description || recipe.data?.introduction || '';

              return (
                <Card key={userRecipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <SafeImage
                      src={imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">
                      {recipe.title}
                    </CardTitle>
                    {excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {recipe.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {recipe.tags.length > 3 && (
                          <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                            +{recipe.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/recipe/${recipe.slug}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Recipe
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromLibrary(userRecipe.id)}
                        className="px-2"
                        aria-label="Remove from library"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Saved {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
        </div>
      </div>
    </main>
  );
};

export default MyRecipes;