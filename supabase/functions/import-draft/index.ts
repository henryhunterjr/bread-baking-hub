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

    const { draftId } = await req.json();

    if (!draftId) {
      return new Response(
        JSON.stringify({ error: 'Draft ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the draft
    const { data: draft, error: draftError } = await supabaseClient
      .from('ai_drafts')
      .select('*')
      .eq('id', draftId)
      .single();

    if (draftError || !draft) {
      return new Response(
        JSON.stringify({ error: 'Draft not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Mark draft as imported
    const { error: updateError } = await supabaseClient
      .from('ai_drafts')
      .update({ imported: true, updated_at: new Date().toISOString() })
      .eq('id', draftId);

    if (updateError) {
      console.error('Error marking draft as imported:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update draft status' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extract content based on type
    const payload = draft.payload;
    let postData;

    if (draft.type === 'blog') {
      const blogDraft = payload.blogDraft || payload;
      postData = {
        title: blogDraft.title || '',
        subtitle: blogDraft.excerpt || blogDraft.subtitle || '',
        content: blogDraft.body || blogDraft.content || '',
        heroImageUrl: blogDraft.imageUrl || (blogDraft.imageUrls && blogDraft.imageUrls[0]) || '',
        tags: blogDraft.tags || [],
        publishAsNewsletter: false,
        isDraft: true
      };
    } else if (draft.type === 'newsletter') {
      const newsletterDraft = payload.newsletterDraft || payload;
      postData = {
        title: newsletterDraft.title || '',
        subtitle: newsletterDraft.excerpt || newsletterDraft.subtitle || '',
        content: newsletterDraft.body || newsletterDraft.content || '',
        heroImageUrl: newsletterDraft.imageUrl || (newsletterDraft.imageUrls && newsletterDraft.imageUrls[0]) || '',
        tags: newsletterDraft.tags || [],
        publishAsNewsletter: true,
        isDraft: true
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        draftId: draft.id,
        postData,
        message: 'Draft imported successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in import-draft function:', error);
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