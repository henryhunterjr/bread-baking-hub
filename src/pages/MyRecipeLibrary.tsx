import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Search, FolderOpen, Trash2, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FavoriteButton } from '@/components/FavoriteButton';
import { format } from 'date-fns';

const MyRecipeLibrary = () => {
  const { user } = useAuth();
  const { userRecipes: recipes, favorites, loading, removeRecipe: deleteRecipe } = useUserRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const navigate = useNavigate();

  // Filter and search recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = !searchQuery || 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFolder = !selectedFolder || recipe.folder === selectedFolder;
      
      return matchesSearch && matchesFolder;
    });
  }, [recipes, searchQuery, selectedFolder]);

  // Get unique folders
  const folders = useMemo(() => {
    const folderSet = new Set(recipes.map(r => r.folder).filter(Boolean));
    return Array.from(folderSet);
  }, [recipes]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-8 text-primary" />
            <h1 className="text-4xl font-bold mb-4 text-primary">My Recipe Library</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sign in to access your saved recipes and favorites
            </p>
            <Button asChild size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Recipe Library | Baking Great Bread</title>
        <meta name="description" content="Your personal collection of saved recipes and favorites from Baking Great Bread." />
      </Helmet>

      <Header />
      
      <main className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-bold mb-4 text-primary">My Recipe Library</h1>
            <p className="text-xl text-muted-foreground">
              Your personal collection of saved recipes and favorites
            </p>
          </div>

          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Saved Recipes ({recipes.length})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites ({favorites.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search your recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {folders.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                            <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="">All Folders</option>
                      {folders.map(folder => (
                        <option key={folder || 'default'} value={folder || ''}>{folder || 'No Folder'}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <BookOpen className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading your recipes...</p>
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || selectedFolder 
                      ? "Try adjusting your search or filter"
                      : "Start saving recipes to build your personal library"
                    }
                  </p>
                  <Button asChild>
                    <Link to="/recipe-workspace">Format a Recipe</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                             <CardDescription className="flex items-center gap-2 mt-2">
                               <Calendar className="w-4 h-4" />
                               {format(new Date(recipe.created_at), 'MMM d, yyyy')}
                             </CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRecipe(recipe.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recipe.folder && (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                              <FolderOpen className="w-3 h-3" />
                              {recipe.folder}
                            </Badge>
                          )}
                          
                          <div className="text-sm text-muted-foreground">
                            Recipe ID: {recipe.recipe_id}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              asChild 
                              size="sm" 
                              className="flex-1"
                            >
                              <Link to={`/recipe/${recipe.id}`}>View Recipe</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start favoriting recipes from our collection
                  </p>
                  <Button asChild>
                    <Link to="/recipes">Browse Recipes</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{favorite.title}</CardTitle>
                        <CardDescription>
                          Favorited recipe from our collection
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link to={`/recipe/${favorite.slug || favorite.id}`}>View Recipe</Link>
                          </Button>
                          <FavoriteButton recipeSlug={favorite.recipe_id} size="sm" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyRecipeLibrary;