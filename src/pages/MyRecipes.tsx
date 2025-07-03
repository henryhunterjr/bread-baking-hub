import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AIAssistantSidebar } from '@/components/AIAssistantSidebar';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilters } from '@/components/RecipeFilters';
import { Folder } from 'lucide-react';

const MyRecipes = () => {
  const { user, loading } = useAuth();
  const { recipes, loading: loadingRecipes, updateRecipe, updateRecipeTitle } = useRecipes();
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
  const [fullEditingRecipe, setFullEditingRecipe] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    folder: '',
    selectedTags: [] as string[]
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth';
    }
  }, [user, loading]);

  const handleEditClick = (recipe: any) => {
    setEditingRecipe(recipe.id);
  };

  const handleFullEditClick = (recipe: any) => {
    setFullEditingRecipe(recipe.id);
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setFullEditingRecipe(null);
  };

  const handleUpdateRecipeTitle = async (recipeId: string, title: string) => {
    setUpdating(true);
    const success = await updateRecipeTitle(recipeId, title);
    setUpdating(false);
    if (success) {
      setEditingRecipe(null);
    }
    return success;
  };

  const handleUpdateFullRecipe = async (recipeId: string, updates: { data: any; image_url?: string; folder?: string; tags?: string[] }) => {
    setUpdating(true);
    const success = await updateRecipe(recipeId, updates);
    setUpdating(false);
    if (success) {
      setFullEditingRecipe(null);
    }
    return success;
  };

  const handleAskAssistant = (recipeData: any) => {
    setSelectedRecipe(recipeData);
    setIsSidebarOpen(true);
  };

  // Filter recipes based on current filters
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = !filters.searchTerm || 
        recipe.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        JSON.stringify(recipe.data).toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesFolder = !filters.folder || recipe.folder === filters.folder;
      
      const matchesTags = filters.selectedTags.length === 0 || 
        filters.selectedTags.every(tag => recipe.tags?.includes(tag));
      
      return matchesSearch && matchesFolder && matchesTags;
    });
  }, [recipes, filters]);

  // Group recipes by folder
  const groupedRecipes = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    
    filteredRecipes.forEach(recipe => {
      const folder = recipe.folder || 'Uncategorized';
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(recipe);
    });
    
    return groups;
  }, [filteredRecipes]);

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
                  {filteredRecipes.length !== recipes.length && (
                    <span> • {filteredRecipes.length} shown</span>
                  )}
                </p>
              </div>

              <RecipeFilters 
                recipes={recipes} 
                onFilter={setFilters}
              />

              {filteredRecipes.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No recipes match your current filters.
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedRecipes).map(([folder, folderRecipes]) => (
                    <div key={folder} className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                        <Folder className="h-5 w-5" />
                        {folder}
                        <span className="text-sm text-muted-foreground">
                          ({folderRecipes.length} recipe{folderRecipes.length !== 1 ? 's' : ''})
                        </span>
                      </h3>
                      <div className="grid gap-6">
                        {folderRecipes.map((recipe) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isEditing={editingRecipe === recipe.id}
                            isFullEditing={fullEditingRecipe === recipe.id}
                            updating={updating}
                            onEdit={() => handleEditClick(recipe)}
                            onFullEdit={() => handleFullEditClick(recipe)}
                            onCancelEdit={handleCancelEdit}
                            onSave={handleUpdateRecipeTitle}
                            onFullSave={handleUpdateFullRecipe}
                            onAskAssistant={handleAskAssistant}
                            allRecipes={recipes}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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