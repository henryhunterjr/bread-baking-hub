import { supabase } from '@/integrations/supabase/client';
import { updatedProductsData } from './updateAffiliateProducts';

/**
 * Import affiliate products from CSV data into the database
 * Requires admin authentication
 */
export async function importAffiliateProducts() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/import-affiliate-products',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProductsData)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Import failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to import affiliate products:', error);
    throw error;
  }
}
