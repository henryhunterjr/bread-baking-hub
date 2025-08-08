import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server misconfigured - missing environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json();
    const {
      title,
      slug: providedSlug,
      data,
      imageUrl,
      tags = ['sourdough', 'whole grain'],
      folder = 'Seasonal',
      isPublic = true,
      userId,
    } = body || {};

    if (!title || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create slug
    const baseSlug = (providedSlug || String(title))
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    // Determine owner user id: use provided or fallback to an existing seasonal recipe owner
    let ownerId = userId as string | null;
    if (!ownerId) {
      const { data: anySeasonal } = await supabase
        .from('recipes')
        .select('user_id')
        .eq('is_public', true)
        .eq('folder', 'Seasonal')
        .limit(1)
        .maybeSingle();
      ownerId = anySeasonal?.user_id || null;
    }

    if (!ownerId) {
      return new Response(
        JSON.stringify({ error: 'Unable to resolve owner user_id for recipe insert' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ensure unique slug for this owner
    let finalSlug = baseSlug;
    let counter = 0;
    while (true) {
      const { data: existing } = await supabase
        .from('recipes')
        .select('id')
        .eq('user_id', ownerId)
        .eq('slug', finalSlug)
        .limit(1)
        .maybeSingle();
      if (!existing) break;
      counter += 1;
      finalSlug = `${baseSlug}-${counter}`;
    }

    // Check if a recipe with same title exists for this owner
    const { data: maybeExisting } = await supabase
      .from('recipes')
      .select('id')
      .eq('user_id', ownerId)
      .eq('title', title)
      .limit(1)
      .maybeSingle();

    let result;
    if (maybeExisting?.id) {
      const { data: updated, error } = await supabase
        .from('recipes')
        .update({
          data,
          image_url: imageUrl ?? null,
          tags,
          folder,
          is_public: isPublic,
          slug: finalSlug,
          updated_at: new Date().toISOString(),
          title,
        })
        .eq('id', maybeExisting.id)
        .select()
        .single();
      if (error) throw error;
      result = updated;
    } else {
      const { data: inserted, error } = await supabase
        .from('recipes')
        .insert({
          user_id: ownerId,
          title,
          data,
          image_url: imageUrl ?? null,
          tags,
          folder,
          is_public: isPublic,
          slug: finalSlug,
        })
        .select()
        .single();
      if (error) throw error;
      result = inserted;
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('upsert-recipe error', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
