import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Recipe mappings from heroImageMapping
const recipeImageMapping: Record<string, string> = {
  'blueberry-lemon-scones': 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/blueberry-white-chocolate-chip-scones.jpg',
  'pumpernickel-bread': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'light-sourdough-batard': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'rustic-italian-ciabatta': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'easter-paska': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'sourdough-bagels': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'cheddar-chive-biscuits': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'olive-rosemary-focaccia': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'sourdough-pizza-dough': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'jalapeno-cheddar-cornbread': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'sourdough-english-muffins': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'honey-oatmeal-bread': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'rosemary-garlic-focaccia': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'sun-dried-tomato-feta-bread': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'apricot-almond-sourdough': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'cherry-vanilla-sourdough': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'fig-walnut-sourdough': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'multigrain-sandwich-loaf': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'caramelized-onion-gruyere-fougasse': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'spiced-pear-bread': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'sourdough-pretzels': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'buttermilk-potato-rolls': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'apple-cider-bread': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'spiced-holiday-bread': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'nutty-whole-grain-sourdough': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'roasted-garlic-rosemary-sourdough': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'spiced-chocolate-bread': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'basic-sourdough-loaf': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'brioche-hamburger-buns': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'hot-dog-buns': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'grilled-flatbread-with-toppings': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'zucchini-bread': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'spring-herb-rolls': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'cranberry-walnut-loaf': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'classic-white-sandwich-bread': '/lovable-uploads/553d716d-ca1f-4d6d-9eba-398960554293.png',
  'hanukkah-challah': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'henrys-crusty-white-bread': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'hot-cross-buns': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'japanese-milk-bread': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'lemon-thyme-focaccia': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'maple-walnut-sticky-buns': '/lovable-uploads/e3feea0f-3490-46d6-8908-d7266d64d39a.png',
  'millet-flaxseed-bread': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'no-knead-white-bread': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'pumpkin-sourdough': '/lovable-uploads/7529d53a-2efe-482b-b5df-be4bf3fb21d9.png',
  'rye-sourdough-caraway': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
  'sourdough-discard-crackers': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'sourdough-discard-pancakes': '/lovable-uploads/2ebc1150-eed1-4535-aa19-282e47c68bb1.png',
  'spring-herb-focaccia': '/lovable-uploads/1e1cfe9e-b38d-428f-8b31-e859c70af35c.png',
  'stollen': '/lovable-uploads/8953cab1-3f46-4839-b581-3dda74a41269.png',
  'super-seeded-sourdough-loaf': '/lovable-uploads/79f7899f-9604-48d0-bc57-347d69da9f8a.png',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const USER_ID = '66d74ee0-b848-4b4d-b37c-6197d5d01d66';
    
    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🖼️  Starting recipe image backfill process...');
    
    // Fetch all recipes for the user that don't have images
    const { data: recipes, error: fetchError } = await supabase
      .from('recipes')
      .select('id, slug, title, image_url')
      .eq('user_id', USER_ID)
      .or('image_url.is.null,image_url.eq.');

    if (fetchError) {
      console.error('Error fetching recipes:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: fetchError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📋 Found ${recipes?.length || 0} recipes without images`);

    if (!recipes || recipes.length === 0) {
      console.log('✅ No recipes need image updates');
      return new Response(
        JSON.stringify({ success: true, message: 'No recipes need image updates', updated: 0, skipped: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let updatedCount = 0;
    let skippedCount = 0;
    const results = [];

    for (const recipe of recipes) {
      // Check if we have a mapping for this recipe's slug
      if (recipe.slug && recipeImageMapping[recipe.slug]) {
        const imageUrl = recipeImageMapping[recipe.slug];
        
        console.log(`🔄 Updating "${recipe.title}" with image: ${imageUrl}`);
        
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ image_url: imageUrl })
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`❌ Error updating recipe "${recipe.title}":`, updateError);
          results.push({ recipe: recipe.title, status: 'error', error: updateError.message });
        } else {
          updatedCount++;
          console.log(`✅ Updated "${recipe.title}"`);
          results.push({ recipe: recipe.title, status: 'updated', imageUrl });
        }
      } else {
        skippedCount++;
        console.log(`⏭️  Skipped "${recipe.title}" - no image mapping found for slug: ${recipe.slug}`);
        results.push({ recipe: recipe.title, status: 'skipped', slug: recipe.slug });
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`✅ Updated: ${updatedCount} recipes`);
    console.log(`⏭️  Skipped: ${skippedCount} recipes`);
    console.log(`📝 Total processed: ${recipes.length} recipes`);

    // Final verification - check for any remaining null images
    const { data: remainingNulls, error: verifyError } = await supabase
      .from('recipes')
      .select('id, slug, title, image_url')
      .eq('user_id', USER_ID)
      .or('image_url.is.null,image_url.eq.');

    if (verifyError) {
      console.error('Error verifying results:', verifyError);
    } else {
      console.log(`\n🔍 Verification: ${remainingNulls?.length || 0} recipes still have null image_url`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated: updatedCount, 
        skipped: skippedCount, 
        processed: recipes.length,
        remainingNulls: remainingNulls?.length || 0,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});