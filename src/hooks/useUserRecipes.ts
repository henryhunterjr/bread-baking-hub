import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface UserRecipe {
  id: string;
  recipe_id: string;
  title: string;
  slug?: string;
  folder?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

interface SaveRecipeParams {
  recipe_id: string;
  title: string;
  slug?: string;
  folder?: string;
}

export const useUserRecipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRecipes, setUserRecipes] = useState<UserRecipe[]>([]);
  const [favorites, setFavorites] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  // Save a recipe to user's library
  const saveRecipe = async ({ recipe_id, title, slug, folder }: SaveRecipeParams) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save recipes",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .upsert(
          {
            user_id: user.id,
            recipe_id,
            title,
            slug,
            folder,
            is_favorite: false,
          },
          {
            onConflict: 'user_id,recipe_id'
          }
        )
        .select()
        .single();

      if (error) {
        logger.error('Error saving recipe:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save recipe to your library",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setUserRecipes(prev => {
        const existing = prev.find(r => r.recipe_id === recipe_id);
        if (existing) {
          return prev.map(r => r.recipe_id === recipe_id ? data : r);
        } else {
          return [...prev, data];
        }
      });

      toast({
        title: "Recipe Saved",
        description: "Recipe added to your library",
      });
      return true;
    } catch (error) {
      logger.error('Error saving recipe:', error);
      toast({
        title: "Save Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (recipe_id: string, is_favorite: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to favorite recipes",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .update({ is_favorite })
        .eq('user_id', user.id)
        .eq('recipe_id', recipe_id)
        .select()
        .single();

      if (error) {
        logger.error('Error toggling favorite:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update favorite status",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setUserRecipes(prev => 
        prev.map(r => r.recipe_id === recipe_id ? data : r)
      );

      setFavorites(prev => {
        if (is_favorite) {
          return [...prev.filter(r => r.recipe_id !== recipe_id), data];
        } else {
          return prev.filter(r => r.recipe_id !== recipe_id);
        }
      });

      toast({
        title: is_favorite ? "Added to Favorites" : "Removed from Favorites",
        description: is_favorite ? "Recipe favorited" : "Recipe unfavorited",
      });
      return true;
    } catch (error) {
      logger.error('Error toggling favorite:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get all user's saved recipes
  const getMyRecipes = async () => {
    if (!user) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching user recipes:', error);
        toast({
          title: "Load Failed",
          description: "Failed to load your recipes",
          variant: "destructive",
        });
        return [];
      }

      setUserRecipes(data || []);
      return data || [];
    } catch (error) {
      logger.error('Error fetching user recipes:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get user's favorite recipes
  const getMyFavorites = async () => {
    if (!user) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching favorites:', error);
        toast({
          title: "Load Failed",
          description: "Failed to load your favorites",
          variant: "destructive",
        });
        return [];
      }

      setFavorites(data || []);
      return data || [];
    } catch (error) {
      logger.error('Error fetching favorites:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Remove recipe from library
  const removeRecipe = async (recipe_id: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipe_id);

      if (error) {
        logger.error('Error removing recipe:', error);
        toast({
          title: "Remove Failed",
          description: "Failed to remove recipe from your library",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setUserRecipes(prev => prev.filter(r => r.recipe_id !== recipe_id));
      setFavorites(prev => prev.filter(r => r.recipe_id !== recipe_id));

      toast({
        title: "Recipe Removed",
        description: "Recipe removed from your library",
      });
      return true;
    } catch (error) {
      logger.error('Error removing recipe:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if a recipe is saved
  const isRecipeSaved = (recipe_id: string) => {
    return userRecipes.some(r => r.recipe_id === recipe_id);
  };

  // Check if a recipe is favorited
  const isRecipeFavorited = (recipe_id: string) => {
    return userRecipes.some(r => r.recipe_id === recipe_id && r.is_favorite);
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      getMyRecipes();
      getMyFavorites();
    } else {
      setUserRecipes([]);
      setFavorites([]);
    }
  }, [user]);

  return {
    userRecipes,
    favorites,
    loading,
    saveRecipe,
    removeRecipe,
    toggleFavorite,
    getMyRecipes,
    getMyFavorites,
    isRecipeSaved,
    isRecipeFavorited,
    // Legacy support
    savedRecipeIds: new Set(userRecipes.map(r => r.recipe_id)),
  };
};