import { supabase } from '../src/integrations/supabase/client';
import helpTopics from './seeds/help_topics.json';

export async function seedHelpTopics() {
  console.log('Seeding help topics...');
  
  try {
    // Clear existing help topics
    const { error: deleteError } = await supabase
      .from('help_topics')
      .delete()
      .neq('key', ''); // Delete all rows
    
    if (deleteError) {
      console.error('Error clearing help topics:', deleteError);
      return;
    }

    // Insert new help topics
    const { error: insertError } = await supabase
      .from('help_topics')
      .insert(helpTopics);

    if (insertError) {
      console.error('Error inserting help topics:', insertError);
      return;
    }

    console.log(`Successfully seeded ${helpTopics.length} help topics`);
  } catch (error) {
    console.error('Error seeding help topics:', error);
  }
}

// Run if called directly
if (import.meta.url.includes('seedHelpTopics')) {
  seedHelpTopics();
}