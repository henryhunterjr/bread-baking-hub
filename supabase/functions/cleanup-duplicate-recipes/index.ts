// Deno Edge Function: cleanup-duplicate-recipes
// Deletes duplicate recipes for provided slugs, keeping the most recent by created_at

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { slug, slugs } = body as { slug?: string; slugs?: string[] };

    const targets = Array.from(new Set((slugs || (slug ? [slug] : [])).filter(Boolean)));
    if (targets.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Provide slug or slugs[]' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Supabase env' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const results: Record<string, { kept?: string; deleted?: string[]; count: number; error?: string }> = {};

    for (const s of targets) {
      // Fetch all recipes with this slug
      const { data, error } = await supabase
        .from('recipes')
        .select('id, created_at')
        .eq('slug', s)
        .order('created_at', { ascending: false });

      if (error) {
        results[s] = { count: 0, error: error.message };
        continue;
      }

      const rows = data || [];
      if (rows.length <= 1) {
        results[s] = { count: rows.length, kept: rows[0]?.id };
        continue;
      }

      const [keep, ...rest] = rows; // keep the newest
      const idsToDelete = rest.map(r => r.id);

      const { error: delErr } = await supabase
        .from('recipes')
        .delete()
        .in('id', idsToDelete);

      if (delErr) {
        results[s] = { count: rows.length, kept: keep.id, error: delErr.message };
      } else {
        results[s] = { count: rows.length, kept: keep.id, deleted: idsToDelete };
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
