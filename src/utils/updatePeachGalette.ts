import { supabase } from "@/integrations/supabase/client";

/**
 * One-time utility to update the Rustic Peach Galette recipe with missing metadata
 * Run this from the browser console: import('@/utils/updatePeachGalette').then(m => m.updatePeachGaletteMetadata())
 */
export const updatePeachGaletteMetadata = async () => {
  try {
    console.log('Updating Rustic Peach Galette metadata...');
    
    const introduction = "This free-form peach galette delivers summer in every bite with tender, flaky crust wrapped around sweet cinnamon peaches. Made with affordable Jiffy Pie Crust Mix and fresh peaches, it's bakery-quality results without the stress. The secret weapon? A touch of banana extract that brightens the fruit in an unexpected way.";
    
    // First, get the existing recipe
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('slug', 'rustic-peach-galette')
      .single();
    
    if (fetchError || !recipe) {
      console.error('Error fetching recipe:', fetchError);
      return { success: false, error: fetchError };
    }
    
    // Update the data field with introduction and author_name
    const existingData = (recipe.data && typeof recipe.data === 'object') ? recipe.data : {};
    const updatedData = {
      ...existingData,
      introduction,
      summary: introduction,
      author_name: "Henry Hunter"
    } as Record<string, any>;
    
    // Update the recipe
    const { data, error } = await supabase
      .from('recipes')
      .update({
        data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('slug', 'rustic-peach-galette')
      .select();
    
    if (error) {
      console.error('Error updating recipe:', error);
      return { success: false, error };
    }
    
    console.log('✅ Recipe updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
};
