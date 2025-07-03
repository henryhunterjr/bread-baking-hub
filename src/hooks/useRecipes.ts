import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch user recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching recipes:', error);
        } else {
          setRecipes(data || []);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  const updateRecipe = async (recipeId: string, updates: { title?: string; data?: any; image_url?: string; folder?: string; tags?: string[]; is_public?: boolean; slug?: string }) => {
    if (!user) return false;

    try {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return false;

      const updatePayload: any = {};
      
      if (updates.title !== undefined) {
        updatePayload.title = updates.title.trim();
      }
      
      if (updates.data !== undefined) {
        updatePayload.data = updates.data;
      }
      
      if (updates.image_url !== undefined) {
        updatePayload.image_url = updates.image_url;
      }
      
      if (updates.folder !== undefined) {
        updatePayload.folder = updates.folder;
      }
      
      if (updates.tags !== undefined) {
        updatePayload.tags = updates.tags;
      }
      
      if (updates.is_public !== undefined) {
        updatePayload.is_public = updates.is_public;
      }
      
      if (updates.slug !== undefined) {
        updatePayload.slug = updates.slug;
      }

      const { error } = await supabase
        .from('recipes')
        .update(updatePayload)
        .eq('id', recipeId)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update recipe. Please try again.",
          variant: "destructive",
        });
        console.error('Error updating recipe:', error);
        return false;
      } else {
        // Update local state
        setRecipes(prevRecipes => 
          prevRecipes.map(r => 
            r.id === recipeId 
              ? { 
                  ...r,
                  ...updatePayload
                }
              : r
          )
        );
        
        toast({
          title: "Success",
          description: "Recipe updated successfully!",
        });
        return true;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating recipe:', error);
      return false;
    }
  };

  const updateRecipeTitle = async (recipeId: string, title: string) => {
    return updateRecipe(recipeId, { 
      title: title.trim(),
      data: { 
        ...recipes.find(r => r.id === recipeId)?.data,
        title: title.trim()
      }
    });
  };

  return {
    recipes,
    loading,
    updateRecipe,
    updateRecipeTitle
  };
};