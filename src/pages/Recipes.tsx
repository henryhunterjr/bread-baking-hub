import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SeasonalHero } from '@/components/SeasonalHero';
import { FeaturedRecipes } from '@/components/FeaturedRecipes';
import { SeasonalFilters } from '@/components/SeasonalFilters';
import { SeasonalRecipeCard } from '@/components/SeasonalRecipeCard';
import { useSeasonalRecipes, Season, Category, Difficulty, SeasonalRecipe } from '@/hooks/useSeasonalRecipes';
import { SeasonalRecipeModal } from '@/components/SeasonalRecipeModal';
import { RecipeModalUrlHandler } from '@/components/RecipeModalUrlHandler';
import { RecipeShareButton } from '@/components/RecipeShareButton';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import { useEffect } from 'react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSeasonChange = (season: Season) => {
    setSelectedSeason(season);
  };

  const handleRecipeClick = (recipe: SeasonalRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleRecipeSelect = (recipeSlug: string) => {
    // Find recipe by slug and open modal
    const recipe = recipes.find(r => r.slug === recipeSlug) || featuredRecipes.find(r => r.slug === recipeSlug);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  };

  // When rating on a card is clicked, open modal and scroll to reviews
  useEffect(() => {
    const handler = () => {
      setTimeout(() => {
        document.getElementById('reviews-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    };
    window.addEventListener('scroll-reviews', handler);
    return () => window.removeEventListener('scroll-reviews', handler);
  }, [selectedRecipe]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <Helmet>
        <title>Recipes | Sourdough for the Rest of Us</title>
        <meta name="description" content="Skip the intimidation. Practical sourdough techniques that turn flour, water, and time into something your family will ask for again and again." />
        <link rel="canonical" href="https://bakinggreatbread.com/recipes" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Free Bread Recipes - Baking Great Bread at Home" />
        <meta property="og:description" content="Professional artisan bread recipes with no ads, no pop-ups. Just great recipes from Henry Hunter's Baking Great Bread at Home." />
        <meta property="og:url" content="https://bakinggreatbread.com/recipes" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-10/free-artisan-bread-recipes-no-ads-or-pop-ups/recipes-thumbnail.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Artisan Bread Recipes - No Ads or Pop-ups" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Bread Recipes - Baking Great Bread at Home" />
        <meta name="twitter:description" content="Professional artisan bread recipes with no ads, no pop-ups. Just great recipes from Henry Hunter's Baking Great Bread at Home." />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-10/free-artisan-bread-recipes-no-ads-or-pop-ups/recipes-thumbnail.png" />
        <meta name="twitter:image:alt" content="Free Artisan Bread Recipes - No Ads or Pop-ups" />
      </Helmet>
      
      <main id="main-content" role="main" tabIndex={-1}>
        {/* Hero Section */}
        <div className="relative h-[600px] overflow-hidden">
          <ResponsiveImage 
            src="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-10/free-artisan-bread-recipes-no-ads-or-pop-ups/recipes-thumbnail.png"
            alt="Artisan sourdough bread loaf with deep golden crust and flour dusting on wooden cutting board, surrounded by wheat stalks, fresh figs, and baking tools in a bright home kitchen"
            className="w-full h-full object-cover"
            loading="eager"
            priority={true}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Find Your Perfect Recipe Search */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Start Baking Now
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Jump right into your next favorite recipe. No intimidation, just great bread.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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

          {/* Featured Recipes Section */}
          {!loading && featuredRecipes.length > 0 && (
            <FeaturedRecipes 
              featuredRecipes={featuredRecipes}
              onRecipeClick={handleRecipeClick}
            />
          )}

          {/* Recipe Grid with Book Section Inserted */}
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
            {recipes.map((recipe, index) => {
                // Insert book section after 6th recipe (index 5) - moved down for better flow
                if (index === 5) {
                  return (
                    <React.Fragment key={recipe.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 * index }}
                      >
                        <SeasonalRecipeCard 
                          recipe={recipe} 
                          onRecipeClick={handleRecipeClick}
                        />
                      </motion.div>
                      
                      {/* Compact Book Section */}
                      <motion.div
                        key="book-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 * (index + 1) }}
                        className="col-span-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 my-6 border border-amber-200/30 dark:border-amber-800/30"
                      >
                        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6">
                          {/* Book Image */}
                          <div className="flex-shrink-0">
                            <ResponsiveImage 
                              src="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/sourdough-for-the-rest-of-us/sound-note-for-the-rest-of-us-1200-x-675-px-1200-x-675-px-1200-x-400-px.png"
                              alt="Sourdough for the Rest of Us book cover"
                              className="w-32 h-auto rounded-lg shadow-md"
                              loading="lazy"
                            />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-foreground mb-3">
                              Get the Intuition
                            </h2>
                            <p className="text-base text-muted-foreground mb-4">
                              Skip the intimidation. Practical techniques that turn flour, water, and time into something your family will ask for again and again.
                            </p>
                            <a 
                              href="https://a.co/d/i5p2huV"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                              Get Your Copy
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                }
                
                return (
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
                );
              })}
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
      
      {/* Handle recipe URL parameters */}
      <RecipeModalUrlHandler onRecipeSelect={handleRecipeSelect} />
      
      {/* Krusty AI Assistant */}
      <Suspense fallback={null}>
        <LazyAIAssistantSidebar
          recipeContext={selectedRecipe}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </Suspense>
    </div>
  );
};

export default Recipes;