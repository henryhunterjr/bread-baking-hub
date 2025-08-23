import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { SaveRecipeButton } from '@/components/SaveRecipeButton';
import { FavoriteButton } from '@/components/FavoriteButton';
import { BookOpen, Heart, Plus, Loader2 } from 'lucide-react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const MyRecipes = () => {
  const { user } = useAuth();
  const { userRecipes, favorites, loading, getMyRecipes, getMyFavorites } = useUserRecipes();
  const [activeTab, setActiveTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getMyRecipes();
      getMyFavorites();
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <Helmet>
          <title>My Recipes | Baking Great Bread at Home</title>
          <meta name="description" content="Access your saved recipes and favorites. Sign in to view your personal recipe collection." />
        </Helmet>
        
        <div className="bg-background text-foreground min-h-screen">
          <Header />
          <main className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold mb-4">My Recipe Library</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Please sign in to access your saved recipes and favorites.
              </p>
              <Button asChild size="lg" variant="hero">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Recipes | Baking Great Bread at Home</title>
        <meta name="description" content="Your personal collection of saved baking recipes and favorites." />
      </Helmet>
      
      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <main className="py-20 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <BookOpen className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-4xl font-bold text-primary">My Recipe Library</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your personal collection of saved recipes and favorites
              </p>
            </div>

            {/* Tabs for All Recipes vs Favorites */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  All Recipes ({userRecipes.length})
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites ({favorites.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading your recipes...</span>
                  </div>
                ) : userRecipes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {userRecipes.map((userRecipe) => (
                      <Card key={userRecipe.id} className="shadow-warm hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{userRecipe.title}</CardTitle>
                          <CardDescription>
                            Saved {new Date(userRecipe.created_at).toLocaleDateString()}
                            {userRecipe.folder && (
                              <Badge variant="secondary" className="ml-2">
                                {userRecipe.folder}
                              </Badge>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <SaveRecipeButton 
                              recipeId={userRecipe.recipe_id}
                              recipeTitle={userRecipe.title}
                              recipeSlug={userRecipe.slug}
                              folder={userRecipe.folder}
                              size="sm"
                            />
                            <FavoriteButton 
                              recipeId={userRecipe.recipe_id}
                              size="sm"
                            />
                          </div>
                          {userRecipe.slug && (
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <Link to={`/recipes/${userRecipe.slug}`}>
                                View Recipe
                              </Link>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No Saved Recipes</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Start saving recipes to your library by clicking the save button on any recipe.
                    </p>
                    <Button asChild variant="hero">
                      <Link to="/recipes">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Recipes
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites" className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading your favorites...</span>
                  </div>
                ) : favorites.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((userRecipe) => (
                      <Card key={userRecipe.id} className="shadow-warm hover:shadow-lg transition-shadow border-red-200">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            {userRecipe.title}
                          </CardTitle>
                          <CardDescription>
                            Favorited {new Date(userRecipe.updated_at).toLocaleDateString()}
                            {userRecipe.folder && (
                              <Badge variant="secondary" className="ml-2">
                                {userRecipe.folder}
                              </Badge>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <SaveRecipeButton 
                              recipeId={userRecipe.recipe_id}
                              recipeTitle={userRecipe.title}
                              recipeSlug={userRecipe.slug}
                              folder={userRecipe.folder}
                              size="sm"
                            />
                            <FavoriteButton 
                              recipeId={userRecipe.recipe_id}
                              size="sm"
                            />
                          </div>
                          {userRecipe.slug && (
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <Link to={`/recipes/${userRecipe.slug}`}>
                                View Recipe
                              </Link>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No Favorite Recipes</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Mark recipes as favorites by clicking the heart button to see them here.
                    </p>
                    <Button asChild variant="hero">
                      <Link to="/recipes">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Recipes
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
        
        <Suspense fallback={null}>
          <LazyAIAssistantSidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </Suspense>
      </div>
    </>
  );
};

export default MyRecipes;