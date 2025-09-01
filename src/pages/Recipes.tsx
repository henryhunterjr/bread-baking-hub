import { useState, Suspense, lazy } from 'react';
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
        <link rel="canonical" href="https://bread-baking-hub.vercel.app/recipes" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Recipes | Sourdough for the Rest of Us" />
        <meta property="og:description" content="Skip the intimidation. Practical sourdough techniques that turn flour, water, and time into something your family will ask for again and again." />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app/recipes" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/bread-recipes-baking-great-bread-at-home-the-bakers-bench/the-bakers-bench2.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Freshly baked artisan sourdough loaf on wooden cutting board next to open recipe book in warm kitchen setting - The Baker's Bench Recipes" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recipes | Sourdough for the Rest of Us" />
        <meta name="twitter:description" content="Skip the intimidation. Practical sourdough techniques that turn flour, water, and time into something your family will ask for again and again." />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/bread-recipes-baking-great-bread-at-home-the-bakers-bench/the-bakers-bench2.png" />
        <meta name="twitter:image:alt" content="Freshly baked artisan sourdough loaf on wooden cutting board next to open recipe book in warm kitchen setting - The Baker's Bench Recipes" />
      </Helmet>
      
      <main id="main-content" role="main" tabIndex={-1}>
        {/* Hero Section */}
        <div className="relative h-[600px] overflow-hidden">
          <ResponsiveImage 
            src="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/sourdough-for-the-rest-of-us/sound-note-for-the-rest-of-us-1200-x-675-px-1200-x-675-px-1200-x-400-px.png"
            alt="Sourdough for the Rest of Us"
            className="w-full h-full object-cover"
            loading="lazy"
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
                // Insert book section after 5th recipe (index 4)
                if (index === 4) {
                  return (
                    <>
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
                      
                      {/* Book Section - spans full width */}
                      <motion.div
                        key="book-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 * (index + 1) }}
                        className="col-span-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-8 my-8 border border-amber-200/30 dark:border-amber-800/30"
                      >
                        <div className="max-w-4xl mx-auto text-center">
                          <h2 className="text-3xl font-bold text-foreground mb-6">
                            Sourdough for the Rest of Us
                          </h2>
                          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
                            Skip the intimidation. This isn't about perfect Instagram loaves or complex schedules that don't fit real life.
                          </p>
                          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            No fancy equipment. No rigid timelines. Just practical techniques that turn flour, water, and time into something your family will ask for again and again.
                          </p>
                          <p className="text-xl font-semibold text-foreground mb-6">
                            Ready to make sourdough work for you?
                          </p>
                          <a 
                            href="https://a.co/d/i5p2huV"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg"
                          >
                            Get Your Copy
                          </a>
                        </div>
                      </motion.div>
                    </>
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