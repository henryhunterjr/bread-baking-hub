import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RecipeVersion {
  id: string;
  recipe_id: string;
  version_number: number;
  title: string;
  data: any;
  image_url?: string;
  folder?: string;
  tags?: string[];
  is_public?: boolean;
  slug?: string;
  version_notes?: string;
  created_at: string;
  created_by: string;
}

export const useRecipeVersions = (recipeId?: string) => {
  const { user } = useAuth();
  const [versions, setVersions] = useState<RecipeVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = async (id: string) => {
    if (!user || !id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('recipe_versions')
        .select('*')
        .eq('recipe_id', id)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (err) {
      console.error('Error fetching recipe versions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch versions');
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (recipeId: string, versionNotes?: string) => {
    if (!user) return null;
    
    try {
      // First get the current recipe data
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (recipeError) throw recipeError;

      // Get next version number
      const { data: existingVersions } = await supabase
        .from('recipe_versions')
        .select('version_number')
        .eq('recipe_id', recipeId)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersion = (existingVersions?.[0]?.version_number || 0) + 1;

      const { data, error } = await supabase
        .from('recipe_versions')
        .insert({
          recipe_id: recipeId,
          version_number: nextVersion,
          title: recipe.title,
          data: recipe.data,
          image_url: recipe.image_url,
          folder: recipe.folder,
          tags: recipe.tags,
          is_public: recipe.is_public,
          slug: recipe.slug,
          version_notes: versionNotes || `Manual version ${nextVersion}`,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh versions
      if (recipeId) await fetchVersions(recipeId);
      
      return data;
    } catch (err) {
      console.error('Error creating version:', err);
      throw err;
    }
  };

  const revertToVersion = async (recipeId: string, versionId: string) => {
    if (!user) return null;
    
    try {
      // Get the version data
      const { data: version, error: versionError } = await supabase
        .from('recipe_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      // Update the main recipe with version data
      const { data, error } = await supabase
        .from('recipes')
        .update({
          title: version.title,
          data: version.data,
          image_url: version.image_url,
          folder: version.folder,
          tags: version.tags,
          is_public: version.is_public,
          slug: version.slug
        })
        .eq('id', recipeId)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error('Error reverting to version:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (recipeId) {
      fetchVersions(recipeId);
    }
  }, [recipeId, user]);

  return {
    versions,
    loading,
    error,
    fetchVersions,
    createVersion,
    revertToVersion
  };
};