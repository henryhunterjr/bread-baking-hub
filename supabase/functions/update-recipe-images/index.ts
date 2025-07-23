import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Recipe slug to image URL mapping
const recipeImageMapping: Record<string, string> = {
  'why-summer-changes-your-dough': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/why-summer-changes-your-dough.png',
  'proofing-yeasted-dough-guide': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/proofing-yeasted-dough-guide.png',
  'blueberry-white-chocolate-chip-scones': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/blueberry-white-chocolate-chip-scones.jpg',
  'bulk-fermentation': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/bulk-fermentation.png',
  'this-keeps-it-simple-readable-and-keyword-friendly': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/this-keeps-it-simple-readable-and-keyword-friendly.jpg',
};

const USER_ID = '66d74ee0-b848-4b4d-b37c-6197d5d01d66';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('🖼️ Starting recipe image update process...');
    
    // Fetch all recipes for the user that don't have images
    const { data: recipes, error: fetchError } = await supabaseAdmin
      .from('recipes')
      .select('id, slug, title, image_url')
      .eq('user_id', USER_ID)
      .or('image_url.is.null,image_url.eq.');

    if (fetchError) {
      console.error('Error fetching recipes:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch recipes', details: fetchError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${recipes?.length || 0} recipes without images`);

    if (!recipes || recipes.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No recipes need image updates', updated: 0, skipped: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let updatedCount = 0;
    let skippedCount = 0;
    const updates = [];

    for (const recipe of recipes) {
      // Check if we have a mapping for this recipe's slug
      if (recipe.slug && recipeImageMapping[recipe.slug]) {
        const imageUrl = recipeImageMapping[recipe.slug];
        
        console.log(`🔄 Updating "${recipe.title}" with image: ${imageUrl}`);
        
        const { error: updateError } = await supabaseAdmin
          .from('recipes')
          .update({ image_url: imageUrl })
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`❌ Error updating recipe "${recipe.title}":`, updateError);
          updates.push({ recipe: recipe.title, status: 'error', error: updateError });
        } else {
          updatedCount++;
          console.log(`✅ Updated "${recipe.title}"`);
          updates.push({ recipe: recipe.title, status: 'updated', imageUrl });
        }
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped "${recipe.title}" - no image mapping found for slug: ${recipe.slug}`);
        updates.push({ recipe: recipe.title, status: 'skipped', reason: 'No mapping found', slug: recipe.slug });
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`✅ Updated: ${updatedCount} recipes`);
    console.log(`⏭️ Skipped: ${skippedCount} recipes`);
    console.log(`📝 Total processed: ${recipes.length} recipes`);

    return new Response(
      JSON.stringify({ 
        message: 'Recipe image update completed',
        updated: updatedCount,
        skipped: skippedCount,
        total: recipes.length,
        details: updates
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})