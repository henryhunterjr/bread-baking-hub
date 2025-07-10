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
      tags,
      publishAsNewsletter,
      isDraft
    } = postData;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Create the post data object
    const postRecord = {
      title,
      subtitle,
      content,
      hero_image_url: heroImageUrl,
      tags: tags || [],
      publish_as_newsletter: publishAsNewsletter,
      is_draft: isDraft,
      slug,
      user_id: user.id,
      published_at: isDraft ? null : new Date().toISOString(),
    };

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