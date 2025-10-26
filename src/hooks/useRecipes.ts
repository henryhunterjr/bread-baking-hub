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

  const updateRecipe = async (recipeId: string, updates: { title?: string; data?: any; image_url?: string; folder?: string; tags?: string[]; is_public?: boolean; slug?: string; author_name?: string | null }) => {
    if (!user) {
      console.log('❌ No user found');
      return false;
    }

    try {
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) {
        console.log('❌ Recipe not found:', recipeId);
        return false;
      }

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
      
      if (updates.author_name !== undefined) {
        updatePayload.author_name = updates.author_name;
      }

      console.log('📤 Updating recipe with payload:', updatePayload);

      const { error, data } = await supabase
        .from('recipes')
        .update(updatePayload)
        .eq('id', recipeId)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('❌ Supabase error:', error);
        toast({
          title: "Error",
          description: `Failed to update recipe: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!data || data.length === 0) {
        console.error('❌ No data returned after update');
        toast({
          title: "Error",
          description: "Recipe update returned no data. Please refresh the page.",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Recipe updated successfully:', data);
      
      // Update local state
      setRecipes(prevRecipes => 
        prevRecipes.map(r => 
          r.id === recipeId 
            ? data[0]
            : r
        )
      );
      
      toast({
        title: "Success",
        description: "Recipe updated successfully!",
      });
      return true;
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

  const deleteRecipe = async (recipeId: string) => {
    if (!user) {
      console.log('❌ No user found');
      return false;
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Supabase error:', error);
        toast({
          title: "Error",
          description: `Failed to delete recipe: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Recipe deleted successfully');
      
      // Update local state
      setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== recipeId));
      
      toast({
        title: "Success",
        description: "Recipe deleted successfully!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error('Error deleting recipe:', error);
      return false;
    }
  };

  return {
    recipes,
    loading,
    updateRecipe,
    updateRecipeTitle,
    deleteRecipe
  };
};