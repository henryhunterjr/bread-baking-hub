import { motion } from 'framer-motion';
import { Clock, ChefHat, Users, Snowflake, Flower, Sun, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SeasonalRecipe, Season, getSeasonalColors } from '@/hooks/useSeasonalRecipes';
import { getRecipeImage } from '@/utils/recipeImageMapping';

interface SeasonalRecipeCardProps {
  recipe: SeasonalRecipe;
  onRecipeClick: (recipe: SeasonalRecipe) => void;
  className?: string;
}

const seasonIcons = {
  Winter: Snowflake,
  Spring: Flower,
  Summer: Sun,
  Fall: Leaf,
};

const getDifficultyDots = (difficulty: string) => {
  const level = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
  return Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className={`w-2 h-2 rounded-full ${
        i < level ? 'bg-primary' : 'bg-muted'
      }`}
    />
  ));
};

export const SeasonalRecipeCard = ({ recipe, onRecipeClick, className = '' }: SeasonalRecipeCardProps) => {
  const season = recipe.data.season as Season;
  const colors = getSeasonalColors(season) || getSeasonalColors('Winter'); // fallback to Winter
  const SeasonIcon = seasonIcons[season] || seasonIcons.Winter; // fallback to Winter icon

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card 
        className="cursor-pointer overflow-hidden relative group h-full"
        onClick={() => onRecipeClick(recipe)}
        style={{
          boxShadow: `0 4px 20px -4px ${colors.primary}40`,
        }}
      >
        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={(() => {
              const recipeImageUrl = getRecipeImage(recipe.slug, recipe.image_url);
              console.log("RECIPE IMAGE DEBUG:", {
                slug: recipe.slug,
                image_url: recipe.image_url,
                getRecipeImage_result: recipeImageUrl
              });
              // Add cache busting for problematic recipes
              const cacheBreaker = ['spiced-holiday-bread', 'nutty-whole-grain-sourdough', 'spiced-chocolate-bread', 'basic-sourdough-loaf'].includes(recipe.slug) 
                ? `?v=${Date.now()}` 
                : '';
              return recipeImageUrl + cacheBreaker;
            })()}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error("Image failed to load for:", recipe.slug, "URL:", e.currentTarget.src);
              e.currentTarget.src = "https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/01/henry-s-foolproof-sourdough-loaf.png";
            }}
          />
          
          {/* Season Badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
            >
              <SeasonIcon className="w-3 h-3" />
              {season}
            </Badge>
          </div>
          
          {/* Seasonal Watermark */}
          <div className="absolute bottom-3 left-3 opacity-20">
            <SeasonIcon className="w-8 h-8" style={{ color: colors.accent }} />
          </div>
        </div>

        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Time Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
              <Clock className="w-3 h-3" />
              <span>Prep: {recipe.data.prepTime.replace('0 hours ', '')}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
              <ChefHat className="w-3 h-3" />
              <span>Bake: {recipe.data.bakeTime.replace('0 hours ', '')}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {recipe.data.category.slice(0, 2).map((cat) => (
              <Badge key={cat} variant="outline" className="text-xs">
                {cat}
              </Badge>
            ))}
            {recipe.data.category.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.data.category.length - 2}
              </Badge>
            )}
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-2">
            {/* Yield */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {recipe.data.yield}
            </div>

            {/* Difficulty Dots */}
            <div className="flex items-center gap-1">
              {getDifficultyDots(recipe.data.difficulty)}
            </div>
          </div>

          {/* Holiday indicator */}
          {recipe.data.holidays && recipe.data.holidays.length > 0 && (
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Perfect for: {recipe.data.holidays.join(', ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};