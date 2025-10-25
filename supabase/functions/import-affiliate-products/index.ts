import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  description: string;
  brand?: string;
  category: string;
  price: string;
  affiliate_link: string;
  keywords: string[];
  regions: string[];
  featured: boolean;
  seasonal_tags: string[];
  offer_text: string;
  image_url?: string;
  utm_params?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roles) {
      throw new Error('Admin access required');
    }

    // Get products from request body or use default data
    const { products } = await req.json() as { products: Product[] };

    if (!products || !Array.isArray(products)) {
      throw new Error('Products array is required');
    }

    // Upsert products into the database
    const { data, error: upsertError } = await supabase
      .from('affiliate_products')
      .upsert(
        products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          brand: p.brand || null,
          category: p.category,
          price: p.price,
          affiliate_link: p.affiliate_link,
          keywords: p.keywords || [],
          regions: p.regions || [],
          featured: p.featured || false,
          seasonal_tags: p.seasonal_tags || [],
          offer_text: p.offer_text || '',
          image_url: p.image_url || null,
          utm_params: p.utm_params || null
        })),
        { 
          onConflict: 'id',
          ignoreDuplicates: false 
        }
      );

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      throw upsertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: products.length,
        message: `Successfully imported ${products.length} products`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
