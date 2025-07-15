import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getHeroImageBySlugOrTitle } from '@/utils/heroImageMapping';

export type Season = 'Winter' | 'Spring' | 'Summer' | 'Fall';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'yeast bread' | 'quick bread' | 'sourdough' | 'enriched' | 'holiday bread' | 'whole grain';

export interface SeasonalRecipeData {
  season: Season;
  holidays: string[];
  featuredDates: { start: string; end: string };
  category: Category[];
  occasion: string[];
  prepTime: string;
  bakeTime: string;
  totalTime: string;
  difficulty: Difficulty;
  yield: string;
  ingredients: string[];
  method: string[];
  notes: string;
  equipment: string[];
}

export interface SeasonalRecipe {
  id: string;
  title: string;
  slug?: string;
  folder?: string;
  tags?: string[];
  is_public?: boolean;
  image_url?: string;
  created_at: string;
  data: SeasonalRecipeData;
}

export const getCurrentSeason = (): Season => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  
  if (month >= 12 || month <= 2) return 'Winter';
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  return 'Fall';
};

export const getSeasonalColors = (season: Season) => {
  switch (season) {
    case 'Winter':
      return {
        primary: 'hsl(210, 100%, 90%)', // ice blue
        secondary: 'hsl(210, 15%, 55%)', // slate
        accent: 'hsl(210, 100%, 95%)', // white
        background: 'linear-gradient(135deg, hsl(210, 100%, 98%), hsl(210, 30%, 95%))',
      };
    case 'Spring':
      return {
        primary: 'hsl(120, 100%, 97%)', // mint
        secondary: 'hsl(120, 50%, 70%)', // spring green
        accent: 'hsl(15, 100%, 92%)', // blush
        background: 'linear-gradient(135deg, hsl(120, 100%, 98%), hsl(15, 50%, 95%))',
      };
    case 'Summer':
      return {
        primary: 'hsl(55, 100%, 95%)', // cream
        secondary: 'hsl(51, 100%, 50%)', // gold
        accent: 'hsl(197, 71%, 73%)', // sky
        background: 'linear-gradient(135deg, hsl(55, 100%, 98%), hsl(51, 80%, 90%))',
      };
    case 'Fall':
      return {
        primary: 'hsl(28, 69%, 69%)', // peru
        secondary: 'hsl(25, 75%, 47%)', // chocolate
        accent: 'hsl(33, 100%, 50%)', // dark orange
        background: 'linear-gradient(135deg, hsl(28, 40%, 90%), hsl(25, 60%, 85%))',
      };
  }
};

export const useSeasonalRecipes = () => {
  const [recipes, setRecipes] = useState<SeasonalRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSeason] = useState<Season>(getCurrentSeason());
  const [selectedSeason, setSelectedSeason] = useState<Season | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch public seasonal recipes
  useEffect(() => {
    const fetchSeasonalRecipes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('is_public', true)
          .eq('folder', 'Seasonal')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching seasonal recipes:', error);
        } else {
          // Type-safe conversion of the data with hero image mapping
          const typedRecipes = (data || []).map(recipe => {
            const heroImageUrl = getHeroImageBySlugOrTitle(recipe.slug, recipe.title);
            // Use placeholder for seasonal recipes if no hero image is found
            const finalImageUrl = heroImageUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80';
            
            return {
              ...recipe,
              data: recipe.data as unknown as SeasonalRecipeData,
              image_url: finalImageUrl
            };
          }) as SeasonalRecipe[];
          setRecipes(typedRecipes);
        }
      } catch (error) {
        console.error('Error fetching seasonal recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonalRecipes();
  }, []);

  // Filter recipes based on current filters
  const filteredRecipes = recipes.filter(recipe => {
    if (selectedSeason !== 'All' && recipe.data.season !== selectedSeason) return false;
    if (selectedCategory !== 'All' && !recipe.data.category.includes(selectedCategory)) return false;
    if (selectedDifficulty !== 'All' && recipe.data.difficulty !== selectedDifficulty) return false;
    if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !recipe.data.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    
    return true;
  });

  // Get featured recipes (current season + upcoming holidays)
  const getFeaturedRecipes = () => {
    const now = new Date();
    const currentDate = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    return recipes
      .filter(recipe => {
        // Current season recipes
        if (recipe.data.season === currentSeason) return true;
        
        // Upcoming holiday recipes
        const { start, end } = recipe.data.featuredDates;
        return currentDate >= start && currentDate <= end;
      })
      .slice(0, 3);
  };

  // Get recipe counts by season
  const getSeasonCounts = () => {
    const counts = { Winter: 0, Spring: 0, Summer: 0, Fall: 0 };
    recipes.forEach(recipe => {
      counts[recipe.data.season]++;
    });
    return counts;
  };

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    loading,
    currentSeason,
    selectedSeason,
    setSelectedSeason,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    searchQuery,
    setSearchQuery,
    featuredRecipes: getFeaturedRecipes(),
    seasonCounts: getSeasonCounts(),
  };
};