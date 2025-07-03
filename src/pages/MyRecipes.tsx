import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIAssistantSidebar } from '@/components/AIAssistantSidebar';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeFilters } from '@/components/RecipeFilters';
import { LoadingState } from '@/components/LoadingState';
import { NoRecipes } from '@/components/NoRecipes';
import { FolderGroup } from '@/components/FolderGroup';

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

  const handleUpdateFullRecipe = async (recipeId: string, updates: { data: any; image_url?: string; folder?: string; tags?: string[]; is_public?: boolean; slug?: string }) => {
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
    return <LoadingState loadingRecipes={loadingRecipes} />;
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

          <NoRecipes 
            hasRecipes={recipes.length > 0} 
            hasFilteredResults={filteredRecipes.length > 0} 
          />
          
          {recipes.length > 0 && (
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

              {filteredRecipes.length > 0 && (
                <div className="space-y-8">
                  {Object.entries(groupedRecipes).map(([folder, folderRecipes]) => (
                    <FolderGroup
                      key={folder}
                      folder={folder}
                      recipes={folderRecipes}
                      editingRecipe={editingRecipe}
                      fullEditingRecipe={fullEditingRecipe}
                      updating={updating}
                      onEdit={handleEditClick}
                      onFullEdit={handleFullEditClick}
                      onCancelEdit={handleCancelEdit}
                      onSave={handleUpdateRecipeTitle}
                      onFullSave={handleUpdateFullRecipe}
                      onAskAssistant={handleAskAssistant}
                      allRecipes={recipes}
                    />
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