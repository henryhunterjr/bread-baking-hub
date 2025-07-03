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

  const updateRecipe = async (recipeId: string, title: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('recipes')
        .update({ 
          title: title.trim(),
          data: { 
            ...recipes.find(r => r.id === recipeId)?.data,
            title: title.trim()
          }
        })
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
          prevRecipes.map(recipe => 
            recipe.id === recipeId 
              ? { 
                  ...recipe, 
                  title: title.trim(),
                  data: { 
                    ...recipe.data, 
                    title: title.trim() 
                  }
                }
              : recipe
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

  return {
    recipes,
    loading,
    updateRecipe
  };
};