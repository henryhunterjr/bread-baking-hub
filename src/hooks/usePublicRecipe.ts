import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePublicRecipe = (slug: string) => {
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicRecipe = async () => {
      if (!slug) {
        console.log('🔍 No slug provided');
        return;
      }
      
      console.log('🔍 Fetching public recipe for slug:', slug);
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('slug', slug)
          .eq('is_public', true)
          .maybeSingle();
        
        console.log('📊 Query result:', { data, error, hasData: !!data, hasError: !!error });
        
        if (error) {
          console.error('❌ Supabase error fetching recipe:', error);
          if (error.code === 'PGRST116') {
            setError('Recipe not found or not public');
          } else {
            setError(`Failed to load recipe: ${error.message}`);
          }
        } else if (!data) {
          console.warn('⚠️ No recipe found for slug:', slug);
          setError('Recipe not found or not public');
        } else {
          console.log('✅ Recipe loaded successfully:', data.title);
          setRecipe(data);
        }
      } catch (error) {
        console.error('❌ Unexpected error fetching public recipe:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicRecipe();
  }, [slug]);

  return { recipe, loading, error };
};