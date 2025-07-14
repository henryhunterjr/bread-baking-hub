import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateSlug } from './slug.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== UPSERT POST FUNCTION STARTED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check environment variables first
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    console.log('Environment check:', {
      hasUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
      urlPreview: SUPABASE_URL ? SUPABASE_URL.substring(0, 20) + '...' : 'null'
    });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Server misconfigured - missing environment variables",
          details: {
            hasUrl: !!SUPABASE_URL,
            hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse request body
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    const { postData, userId } = body;
    
    if (!postData || !userId) {
      console.error('Missing required fields:', { hasPostData: !!postData, hasUserId: !!userId });
      return new Response(
        JSON.stringify({ error: "Missing postData or userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate slug
    console.log('Generating slug for title:', postData.title, 'existing ID:', postData.id);
    const slug = await generateSlug(supabaseClient, userId, postData.title, postData.id);
    console.log('Generated slug:', slug);
    
    // Ensure slug is never empty (fallback protection)
    if (!slug || slug.trim() === '') {
      console.error('Failed to generate slug or slug is empty, using fallback');
      const fallbackSlug = postData.title
        ?.toLowerCase()
        ?.replace(/[^a-z0-9]+/g, '-')
        ?.replace(/^-+|-+$/g, '')
        ?.substring(0, 100) || 'untitled-post';
      
      const finalSlug = fallbackSlug || 'untitled-post';
      console.log('Using fallback slug:', finalSlug);
      
      return new Response(
        JSON.stringify({ error: "Failed to generate unique slug", fallbackUsed: finalSlug }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use the data preparation function to properly map fields
    const { preparePostRecord } = await import('./data.ts');
    const postWithSlug = preparePostRecord(postData, userId, slug);
    postWithSlug.updated_at = new Date().toISOString();

    console.log('Upserting post with data:', JSON.stringify(postWithSlug, null, 2));

    // Upsert the post
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .upsert(postWithSlug, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Post upserted successfully:', data);
    return new Response(
      JSON.stringify({ success: true, data, slug }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Critical error in function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Critical function error", 
        message: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});