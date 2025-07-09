import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SeasonalHero } from '@/components/SeasonalHero';
import { FeaturedRecipes } from '@/components/FeaturedRecipes';
import { SeasonalFilters } from '@/components/SeasonalFilters';
import { SeasonalRecipeCard } from '@/components/SeasonalRecipeCard';
import { useSeasonalRecipes, Season, Category, Difficulty, SeasonalRecipe } from '@/hooks/useSeasonalRecipes';
import { SeasonalRecipeModal } from '@/components/SeasonalRecipeModal';
import { Skeleton } from '@/components/ui/skeleton';

const Recipes = () => {
  const {
    recipes,
    loading,
    selectedSeason,
    setSelectedSeason,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    searchQuery,
    setSearchQuery,
    featuredRecipes,
    seasonCounts,
  } = useSeasonalRecipes();

  const [selectedRecipe, setSelectedRecipe] = useState<SeasonalRecipe | null>(null);

  const handleSeasonChange = (season: Season) => {
    setSelectedSeason(season);
  };

  const handleRecipeClick = (recipe: SeasonalRecipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <SeasonalHero 
          selectedSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
          seasonCounts={seasonCounts}
        />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Featured Recipes Section */}
          {!loading && featuredRecipes.length > 0 && (
            <FeaturedRecipes 
              featuredRecipes={featuredRecipes}
              onRecipeClick={handleRecipeClick}
            />
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <SeasonalFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedSeason={selectedSeason}
              onSeasonChange={setSelectedSeason}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
              resultCount={recipes.length}
            />
          </motion.div>

          {/* Recipe Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <h3 className="text-lg font-medium mb-2">No recipes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 * index }}
                >
                  <SeasonalRecipeCard 
                    recipe={recipe} 
                    onRecipeClick={handleRecipeClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Recipe Detail Modal */}
      <SeasonalRecipeModal 
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};

export default Recipes;