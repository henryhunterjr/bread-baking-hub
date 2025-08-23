import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useUserRecipes = () => {
  const { user } = useAuth();
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    } else {
      setSavedRecipeIds(new Set());
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('recipe_id');

      if (error) throw error;

      const ids = new Set(data.map(item => item.recipe_id));
      setSavedRecipeIds(ids);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  const saveRecipe = async (recipeId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save recipes to your library.",
        variant: "destructive",
      });
      return false;
    }

    if (savedRecipeIds.has(recipeId)) {
      toast({
        title: "Already saved",
        description: "This recipe is already in your library.",
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_recipes')
        .insert({
          user_id: user.id,
          recipe_id: recipeId,
        });

      if (error) throw error;

      setSavedRecipeIds(prev => new Set([...prev, recipeId]));
      toast({
        title: "Recipe saved",
        description: "Recipe has been added to your library.",
      });
      return true;
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeRecipe = async (recipeId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      setSavedRecipeIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });
      toast({
        title: "Recipe removed",
        description: "Recipe has been removed from your library.",
      });
      return true;
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast({
        title: "Error",
        description: "Failed to remove recipe. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isRecipeSaved = (recipeId: string) => savedRecipeIds.has(recipeId);

  return {
    saveRecipe,
    removeRecipe,
    isRecipeSaved,
    loading,
    savedRecipeIds,
  };
};