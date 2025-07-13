import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    
    console.log('Environment check:', {
      hasUrl: !!SUPABASE_URL,
      hasKey: !!SUPABASE_ANON_KEY,
      urlPreview: SUPABASE_URL ? SUPABASE_URL.substring(0, 20) + '...' : 'null'
    });

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Server misconfigured - missing environment variables",
          details: {
            hasUrl: !!SUPABASE_URL,
            hasKey: !!SUPABASE_ANON_KEY
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Simple test response for now
    console.log('Returning test success response');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Function is working - environment variables found",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
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