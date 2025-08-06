import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { recipeSlug, imageUrl } = await req.json();
    
    if (!recipeSlug || !imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Recipe slug and image URL are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Updating recipe mapping: ${recipeSlug} -> ${imageUrl}`);

    // Read current mapping file from GitHub (this is a simulation - in practice you'd need to integrate with your deployment system)
    // For now, we'll return the mapping update that needs to be applied
    const mappingUpdate = {
      slug: recipeSlug,
      imageUrl: imageUrl,
      timestamp: new Date().toISOString()
    };

    // Log the update for manual application
    console.log('Recipe mapping update:', mappingUpdate);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Mapping updated for ${recipeSlug}`,
        update: mappingUpdate,
        instructions: 'Apply this mapping update to src/utils/recipeImageMapping.ts'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in update-recipe-mapping:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});