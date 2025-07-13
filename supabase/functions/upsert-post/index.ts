import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from './cors.ts';
import { validateImageAltText } from './validation.ts';
import { generateSlug } from './slug.ts';
import { preparePostRecord } from './data.ts';
import { PostData } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    console.log('Upsert-post function started');
    
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
      return createErrorResponse('Unauthorized', 401);
    }

    const postData: PostData = await req.json();
    const {
      id,
      title,
      inlineImageUrl,
      socialImageUrl,
    } = postData;

    // Validate alt-text for images
    const validationError = await validateImageAltText(
      supabaseClient,
      inlineImageUrl,
      socialImageUrl
    );

    if (validationError) {
      return createErrorResponse(validationError, 400);
    }

    // Generate slug
    const slug = await generateSlug(supabaseClient, user.id, title, id);

    // Prepare post record
    const postRecord = preparePostRecord(postData, user.id, slug);

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

    return createSuccessResponse({ 
      success: true, 
      post: result,
      slug: result.slug 
    });

  } catch (error) {
    console.error('Error in upsert-post function:', error);
    return createErrorResponse(
      error.message || 'Internal server error',
      500
    );
  }
});