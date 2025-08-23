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
        <title>Recipes | Baking Great Bread at Home</title>
        <meta name="description" content="Discover our collection of tried and true bread recipes, from classic sourdough to seasonal specialties. Perfect for home bakers of all skill levels." />
        <link rel="canonical" href="https://the-bakers-bench.lovable.app/recipes" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Recipes | Baking Great Bread at Home" />
        <meta property="og:description" content="Discover our collection of tried and true bread recipes, from classic sourdough to seasonal specialties. Perfect for home bakers of all skill levels." />
        <meta property="og:url" content="https://the-bakers-bench.lovable.app/recipes" />
        <meta property="og:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/218723c3-e566-4b81-a9e5-a341a5e61037.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Baking Great Bread at Home Recipes - Tried and True Favorites" />
        <meta property="og:site_name" content="Baking Great Bread at Home" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recipes | Baking Great Bread at Home" />
        <meta name="twitter:description" content="Discover our collection of tried and true bread recipes, from classic sourdough to seasonal specialties. Perfect for home bakers of all skill levels." />
        <meta name="twitter:image" content="https://the-bakers-bench.lovable.app/lovable-uploads/218723c3-e566-4b81-a9e5-a341a5e61037.png" />
        <meta name="twitter:image:alt" content="Baking Great Bread at Home Recipes - Tried and True Favorites" />
      </Helmet>
      
      <main id="main-content" role="main" tabIndex={-1}>
        {/* Hero Section with Book Card */}
        <div className="relative h-[600px] overflow-hidden">
          <ResponsiveImage 
            src="/lovable-uploads/fc6b2aed-f1bf-4707-8c25-728a6dffa9ad.png"
            alt="Baking Great Bread at Home: A Journey Through the Seasons"
            className="w-full h-full object-cover object-right"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          
          {/* Book Description Card */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Baking Great Bread at Home
              </h1>
              <p className="text-xl text-gray-700 mb-4 italic">
                A Journey through the Seasons
              </p>
              <p className="text-lg text-gray-600 mb-6">
                By Henry Hunter
              </p>
              <div className="border-t pt-6">
                <p className="text-xl font-medium text-gray-900 leading-relaxed">
                  What if this year you didn't just bake bread - You became a Baker
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Introduction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-card border rounded-2xl p-8 shadow-warm">
              <div className="text-center mb-6">
                <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  COMING DECEMBER 2025
                </div>
                <h2 className="text-3xl font-bold mb-4">Baking Great Bread at Home: A Journey Through the Seasons</h2>
              </div>
              <div className="prose prose-lg max-w-4xl mx-auto text-muted-foreground">
                <p className="text-lg mb-4">
                  This recipe collection offers you a preview of what's to come in my upcoming cookbook—a year-long adventure through the art of breadmaking, with recipes that respond to the rhythms of nature and the celebrations that mark our days.
                </p>
                <p className="text-xl font-medium text-foreground mb-4">
                  What if this year, you didn't just bake bread—you became a baker?
                </p>
                <p className="mb-4">
                  Through winter's hearth breads, spring's delicate enriched doughs, summer's quick flatbreads, and fall's harvest loaves, you'll build a real relationship with flour, fermentation, and flavor. Each recipe here is tied to its season, teaching you not just what to bake, but when and why.
                </p>
                <p className="mb-4">
                  This isn't just a cookbook preview. It's an invitation to join thousands of bakers worldwide who are discovering that bread is more than food—it's a language of care, a connection to history, and a reflection of the world around us.
                </p>
                <p className="text-lg font-medium text-foreground">
                  Explore these seasonal recipes now, save your favorites, and get ready for the full journey coming December 2025.
                </p>
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="font-medium text-foreground">- Henry Hunter</p>
                  <p className="text-sm">Founder, Baking Great Bread at Home</p>
                </div>
              </div>
            </div>
          </motion.div>
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