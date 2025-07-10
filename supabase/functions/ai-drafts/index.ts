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
    console.log('ai-drafts function called, method:', req.method);
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    // Only check user authentication if we have an auth header
    if (authHeader) {
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (userError || !user) {
        console.error('User authentication failed:', userError);
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      console.log('User authenticated:', user.email);
    }

    const url = new URL(req.url);
    const draftId = url.pathname.split('/').pop();

    if (req.method === 'GET') {
      if (draftId && draftId !== 'ai-drafts') {
        // Get specific draft
        const { data: draft, error } = await supabaseClient
          .from('ai_drafts')
          .select('*')
          .eq('id', draftId)
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Draft not found' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify(draft),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Get all drafts with optional filtering
        const imported = url.searchParams.get('imported');
        let query = supabaseClient
          .from('ai_drafts')
          .select('*')
          .eq('discarded', false)
          .order('created_at', { ascending: false });

        if (imported !== null) {
          query = query.eq('imported', imported === 'true');
        }

        const { data: drafts, error } = await query;
        console.log('Database query result:', { drafts, error, count: drafts?.length });

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch drafts' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify(drafts),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    if (req.method === 'DELETE' && draftId) {
      // Mark draft as discarded
      const { error } = await supabaseClient
        .from('ai_drafts')
        .update({ discarded: true, updated_at: new Date().toISOString() })
        .eq('id', draftId);

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to discard draft' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-drafts function:', error);
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