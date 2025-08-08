import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getRecipeImage } from '@/utils/recipeImageMapping';

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

        console.log('🔍 SEASONAL RECIPES FETCH DEBUG:', {
          total_count: data?.length || 0,
          error: error,
          sample_recipes: data?.slice(0, 3).map(r => ({ slug: r.slug, title: r.title, image_url: r.image_url }))
        });
        
        if (error) {
          console.error('Error fetching seasonal recipes:', error);
        } else {
          // Type-safe conversion of the data with proper recipe image mapping
          const typedRecipes = (data || []).map(recipe => {
            const finalImageUrl = getRecipeImage(recipe.slug, recipe.image_url);
            
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

  // One-time ensure Henry's Whole Wheat Sourdough is present
  useEffect(() => {
    const ensureHenryRecipe = async () => {
      if (loading) return;
      const targetSlug = 'henrys-whole-wheat-sourdough-recipe';
      if (recipes.some(r => r.slug === targetSlug)) return;

      try {
        const season = getCurrentSeason();
        const featuredDatesBySeason: Record<Season, { start: string; end: string }> = {
          Winter: { start: '12-01', end: '02-28' },
          Spring: { start: '03-01', end: '05-31' },
          Summer: { start: '06-01', end: '08-31' },
          Fall: { start: '09-01', end: '11-30' },
        };

        const ingredients = [
          'Bread flour — 400g (3¼ cups)',
          'King Arthur White Whole Wheat flour — 100g (¾ cup)',
          'Warm water — 385g (1⅝ cups)',
          'Active sourdough starter — 100g (½ cup)',
          'Salt — 10g (2 tsp)',
        ];

        const method = [
          'Mix flours, water, and starter until combined; rest 45 minutes.',
          'Add salt and mix using Rubaud method for ~10 minutes until smooth.',
          'Perform 3 sets of coil folds every 45 minutes to build strength.',
          'Rest 30 minutes, then shape gently to preserve gas.',
          'Place seam-side up in floured banneton; rest 1 hour, then refrigerate 8–24 hours.',
          'Preheat oven and vessel to 475°F (245°C). Optionally chill dough 15 minutes for cleaner scoring.',
          'Score and bake: 22 minutes covered, then 12–17 minutes uncovered until deep golden or 205°F internal.',
          'Cool completely before slicing.',
        ];

        const data: SeasonalRecipeData = {
          season,
          holidays: [],
          featuredDates: featuredDatesBySeason[season],
          category: ['sourdough', 'whole grain'],
          occasion: ['healthy baking'],
          prepTime: '10 min active + 45 min rest + folds',
          bakeTime: '22 min covered + 12–17 min uncovered',
          totalTime: 'Approximately 4–6 hours including folds and rest',
          difficulty: 'intermediate',
          yield: '1 loaf',
          ingredients,
          method,
          notes: '20% King Arthur White Whole Wheat maintains an open crumb with added nutrition; use gentle coil folds.',
          equipment: [
            'Mixing bowl',
            'Bench scraper',
            'Proofing basket (banneton)',
            'Dutch oven or Brød & Taylor Baking Shell',
            'Digital scale',
            'Lame or sharp knife',
          ],
        };

        const imageUrl = getRecipeImage(targetSlug, undefined);

        const { data: res, error } = await supabase.functions.invoke('upsert-recipe', {
          body: {
            title: "Henry's Whole Wheat Sourdough Recipe - Healthy & Delicious",
            slug: targetSlug,
            data,
            imageUrl,
            tags: ['sourdough', 'whole wheat', 'healthy bread', 'bread recipe', 'home baking'],
            folder: 'Seasonal',
            isPublic: true,
          },
        });

        if (error) {
          console.error('Failed to upsert recipe via edge function:', error);
          return;
        }

        // Optimistically add to UI
        const created = res?.data;
        const newRecipe: SeasonalRecipe = {
          id: created?.id || crypto.randomUUID(),
          title: "Henry's Whole Wheat Sourdough Recipe - Healthy & Delicious",
          slug: targetSlug,
          folder: 'Seasonal',
          tags: ['sourdough', 'whole wheat', 'healthy bread', 'bread recipe', 'home baking'],
          is_public: true,
          image_url: imageUrl,
          created_at: created?.created_at || new Date().toISOString(),
          data,
        };
        setRecipes(prev => [newRecipe, ...prev]);
      } catch (e) {
        console.error('ensureHenryRecipe error', e);
      }
    };

    ensureHenryRecipe();
  }, [loading, recipes]);

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
        
        // Upcoming holiday recipes - add safety check for featuredDates
        if (recipe.data.featuredDates) {
          const { start, end } = recipe.data.featuredDates;
          return currentDate >= start && currentDate <= end;
        }
        
        return false;
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