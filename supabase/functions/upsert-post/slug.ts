import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function generateSlug(
  supabaseClient: ReturnType<typeof createClient>,
  userId: string,
  title?: string,
  existingPostId?: string
): Promise<string | undefined> {
  if (!title && !existingPostId) {
    return undefined;
  }

  if (title) {
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Ensure we have a valid slug
    if (!baseSlug) {
      baseSlug = 'blog-post';
    }

    // Check for existing slug and append number if needed
    let slug = baseSlug;
    let counter = 1;
    
    // Only check for conflicts when creating a new post (no id)
    if (!existingPostId) {
      while (true) {
        const { data: existingPost } = await supabaseClient
          .from('blog_posts')
          .select('id')
          .eq('user_id', userId)
          .eq('slug', slug)
          .single();

        if (!existingPost) {
          break; // Slug is unique
        }
        
        counter++;
        slug = `${baseSlug}-${counter}`;
      }
    } else {
      // For updates, keep existing slug
      const { data: currentPost } = await supabaseClient
        .from('blog_posts')
        .select('slug')
        .eq('id', existingPostId)
        .eq('user_id', userId)
        .single();
      
      if (currentPost) {
        slug = currentPost.slug;
      }
    }

    return slug;
  } else if (existingPostId) {
    // For updates without title, keep existing slug
    const { data: currentPost } = await supabaseClient
      .from('blog_posts')
      .select('slug')
      .eq('id', existingPostId)
      .eq('user_id', userId)
      .single();
    
    if (currentPost) {
      return currentPost.slug;
    }
  }

  return undefined;
}
