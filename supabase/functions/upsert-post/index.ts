import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const postData = await req.json();
    const {
      id,
      title,
      subtitle,
      content,
      heroImageUrl,
      inlineImageUrl,
      socialImageUrl,
      tags,
      publishAsNewsletter,
      isDraft
    } = postData;

    // Validate alt-text for images
    if (inlineImageUrl || socialImageUrl) {
      const imagesToCheck = [];
      if (inlineImageUrl) imagesToCheck.push(inlineImageUrl);
      if (socialImageUrl) imagesToCheck.push(socialImageUrl);

      for (const imageUrl of imagesToCheck) {
        console.log('Checking alt-text for image:', imageUrl);
        
        const { data: imageMetadata, error: metadataError } = await supabaseClient
          .from('blog_images_metadata')
          .select('alt_text')
          .eq('public_url', imageUrl)
          .single();

        console.log('Image metadata result:', { imageMetadata, metadataError });

        if (metadataError || !imageMetadata) {
          return new Response(
            JSON.stringify({ 
              error: `Image not found in metadata table: ${imageUrl}. Please upload the image through the blog image uploader to add alt text.` 
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        if (!imageMetadata.alt_text) {
          return new Response(
            JSON.stringify({ 
              error: `Alt text is required for the image: ${imageUrl}. Please add alt text through the image manager.` 
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
    }

    // Generate base slug from title (only if title is provided)
    let slug;
    
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
      slug = baseSlug;
      let counter = 1;
      
      // Only check for conflicts when creating a new post (no id)
      if (!id) {
        while (true) {
          const { data: existingPost } = await supabaseClient
            .from('blog_posts')
            .select('id')
            .eq('user_id', user.id)
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
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (currentPost) {
          slug = currentPost.slug;
        }
      }
    } else if (id) {
      // For updates without title, keep existing slug
      const { data: currentPost } = await supabaseClient
        .from('blog_posts')
        .select('slug')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (currentPost) {
        slug = currentPost.slug;
      }
    }

    // Create the post data object - only include fields that are provided
    const postRecord: any = {
      user_id: user.id,
    };

    // Only include fields that are provided in the request
    if (title !== undefined) postRecord.title = title;
    if (subtitle !== undefined) postRecord.subtitle = subtitle;
    if (content !== undefined) postRecord.content = content;
    if (heroImageUrl !== undefined) postRecord.hero_image_url = heroImageUrl;
    if (inlineImageUrl !== undefined) postRecord.inline_image_url = inlineImageUrl;
    if (socialImageUrl !== undefined) postRecord.social_image_url = socialImageUrl;
    if (tags !== undefined) postRecord.tags = tags || [];
    if (publishAsNewsletter !== undefined) postRecord.publish_as_newsletter = publishAsNewsletter;
    if (isDraft !== undefined) postRecord.is_draft = isDraft;
    if (slug !== undefined) postRecord.slug = slug;
    
    // Set published_at for new posts or when changing draft status
    if (isDraft !== undefined) {
      postRecord.published_at = isDraft ? null : new Date().toISOString();
    }

    let result;
    if (id) {
      // Update existing post
      const { data, error } = await supabaseClient
        .from('blog_posts')
        .update(postRecord)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new post
      const { data, error } = await supabaseClient
        .from('blog_posts')
        .insert(postRecord)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    console.log('Post upserted successfully:', result.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: result,
        slug: result.slug 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in upsert-post function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});