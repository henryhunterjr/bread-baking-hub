import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useContentIndexing = () => {
  const [isIndexing, setIsIndexing] = useState(false);
  const { toast } = useToast();

  const indexContent = async (type: 'recipes' | 'blog' | 'help' | 'all' = 'all') => {
    setIsIndexing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('index-content', {
        body: { type }
      });

      if (error) throw error;

      toast({
        title: "Content Indexing Complete",
        description: `Successfully indexed ${data.indexed_count} items of type: ${type}`,
      });

      return data;
    } catch (error) {
      console.error('Content indexing failed:', error);
      toast({
        title: "Indexing Failed",
        description: "Failed to index content. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsIndexing(false);
    }
  };

  const searchContent = async (
    query: string, 
    contentTypes: string[] = ['recipe', 'blog', 'help'],
    maxResults: number = 5
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('search-content', {
        body: {
          query,
          content_types: contentTypes,
          max_results: maxResults
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Content search failed:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search content. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    indexContent,
    searchContent,
    isIndexing
  };
};