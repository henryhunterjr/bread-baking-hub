import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { SeasonalRecipe, getCurrentSeason } from '@/hooks/useSeasonalRecipes';
import { SeasonalRecipeCard } from './SeasonalRecipeCard';

interface FeaturedRecipesProps {
  featuredRecipes: SeasonalRecipe[];
  onRecipeClick: (recipe: SeasonalRecipe) => void;
}

export const FeaturedRecipes = ({ featuredRecipes, onRecipeClick }: FeaturedRecipesProps) => {
  const currentSeason = getCurrentSeason();
  
  if (featuredRecipes.length === 0) return null;

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Baking Now
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Perfect recipes for the current season and upcoming holidays
        </motion.p>
      </div>

      {/* Holiday Countdown Banner */}
      {featuredRecipes.some(recipe => recipe.data.holidays && recipe.data.holidays.length > 0) && (
        <motion.div 
          className="mb-8 p-4 bg-primary/10 rounded-lg border-l-4 border-primary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Seasonal Favorites</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Discover breads perfect for this time of year
          </p>
        </motion.div>
      )}

      {/* Featured Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <SeasonalRecipeCard 
              recipe={recipe} 
              onRecipeClick={onRecipeClick}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
          <Clock className="w-4 h-4" />
          Updated for {currentSeason} baking
        </div>
      </div>
    </section>
  );
};