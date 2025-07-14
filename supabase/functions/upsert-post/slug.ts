import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function generateSlug(
  supabase: any,
  userId: string,
  title: string,
  existingPostId?: string
): Promise<string> {
  console.log('generateSlug called with:', { userId, title, existingPostId });
  
  // If updating an existing post, get its current slug
  if (existingPostId) {
    try {
      const { data: existingPost, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('id', existingPostId)
        .eq('user_id', userId)
        .single();
      
      console.log('Existing post query result:', { existingPost, error });
      
      if (error) {
        console.error('Error fetching existing post:', error);
        // Don't throw here - fall through to generate new slug
      } else if (existingPost && existingPost.slug) {
        console.log('Returning existing slug:', existingPost.slug);
        return existingPost.slug;
      }
    } catch (err) {
      console.error('Exception in existing post query:', err);
    }
  }

  // Generate new slug from title
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
  
  // Ensure slug is not empty
  if (!baseSlug) {
    baseSlug = 'untitled-post';
  }
  
  let slug = baseSlug;
  let suffix = 1;

  // Check for duplicates and add suffix if needed
  while (true) {
    try {
      const query = supabase
        .from('blog_posts')
        .select('id')
        .eq('user_id', userId)
        .eq('slug', slug);
      
      // Exclude current post if updating
      if (existingPostId) {
        query.neq('id', existingPostId);
      }
      
      const { data: existing, error } = await query;
      
      if (error) {
        console.error('Error checking slug uniqueness:', error);
        throw error;
      }
      
      if (!existing || existing.length === 0) {
        console.log('Generated unique slug:', slug);
        return slug;
      }
      
      // Try next suffix
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    } catch (err) {
      console.error('Exception in slug uniqueness check:', err);
      throw err;
    }
  }
}
