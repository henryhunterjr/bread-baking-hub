import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePublicRecipe = (slug: string) => {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicRecipe = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('slug', slug)
          .eq('is_public', true)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            setError('Recipe not found or not public');
          } else {
            setError('Failed to load recipe');
          }
          console.error('Error fetching public recipe:', error);
        } else {
          setRecipe(data);
        }
      } catch (error) {
        setError('An unexpected error occurred');
        console.error('Error fetching public recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicRecipe();
  }, [slug]);

  return { recipe, loading, error };
};