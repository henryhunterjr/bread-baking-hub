import { createClient } from '@supabase/supabase-js';
import { recipeImageMapping } from '../src/utils/recipeImageMapping';

// Initialize Supabase client with service role key for admin operations
const SUPABASE_URL = 'https://ojyckskucneljvuqzrsw.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const USER_ID = '66d74ee0-b848-4b4d-b37c-6197d5d01d66';

async function updateRecipeImages() {
  console.log('🖼️  Starting recipe image update process...');
  
  try {
    // Fetch all recipes for the user that don't have images
    const { data: recipes, error: fetchError } = await supabase
      .from('recipes')
      .select('id, slug, title, image_url')
      .eq('user_id', USER_ID)
      .or('image_url.is.null,image_url.eq.');

    if (fetchError) {
      console.error('Error fetching recipes:', fetchError);
      return;
    }

    console.log(`📋 Found ${recipes?.length || 0} recipes without images`);

    if (!recipes || recipes.length === 0) {
      console.log('✅ No recipes need image updates');
      return;
    }

    let updatedCount = 0;
    let skippedCount = 0;

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
        } else {
          updatedCount++;
          console.log(`✅ Updated "${recipe.title}"`);
        }
      } else {
        skippedCount++;
        console.log(`⏭️  Skipped "${recipe.title}" - no image mapping found for slug: ${recipe.slug}`);
      }
    }

    console.log('\n📊 Update Summary:');
    console.log(`✅ Updated: ${updatedCount} recipes`);
    console.log(`⏭️  Skipped: ${skippedCount} recipes`);
    console.log(`📝 Total processed: ${recipes.length} recipes`);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the script
updateRecipeImages();