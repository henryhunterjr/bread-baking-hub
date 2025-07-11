import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { BlogPost } from '@/utils/blogFetcher';
import { convertSupabasePostToBlogPost } from '@/utils/blogUtils';

export const useBlogPost = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [supabasePost, setSupabasePost] = useState<Tables<'blog_posts'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Looking for blog post with slug:', slug);
        console.log('Full URL pathname:', window.location.pathname);
        
        // Find the post in Supabase (dashboard-created posts only)
        console.log('Searching for Supabase post with slug:', slug);
        
        // First try with is_draft = false (published posts)
        let { data: supabasePost, error: supabaseError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_draft', false)
          .single();

        // If not found, try with any draft status (in case it's still marked as draft)
        if (!supabasePost && supabaseError) {
          console.log('Post not found with is_draft=false, trying any draft status...');
          const { data: draftPost, error: draftError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();
          
          if (draftPost) {
            console.log('Found post with draft status:', draftPost.is_draft);
            supabasePost = draftPost;
            supabaseError = draftError;
          }
        }

        if (supabasePost && !supabaseError) {
          console.log('Found Supabase post:', supabasePost.title, 'Draft status:', supabasePost.is_draft);
          
          // Convert Supabase post to BlogPost format
          const convertedPost = convertSupabasePostToBlogPost(supabasePost);
          
          setPost(convertedPost);
          setSupabasePost(supabasePost);
          return;
        } else {
          console.log('Supabase query error:', supabaseError);
          console.log('No Supabase post found with slug:', slug);
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  return { post, supabasePost, loading, error };
};