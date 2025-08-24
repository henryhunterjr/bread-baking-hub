import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, content_types = ['recipe', 'blog', 'help'], max_results = 5 } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Searching for:', query);

    let results = [];

    if (openAIApiKey) {
      try {
        // Generate embedding for the query
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: query,
          }),
        });

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json();
          const queryEmbedding = embeddingData.data[0].embedding;

          // Search using vector similarity
          const { data: vectorResults, error: vectorError } = await supabase.rpc('match_content', {
            query_embedding: `[${queryEmbedding.join(',')}]`,
            match_count: max_results,
            filter_type: null
          });

          if (!vectorError && vectorResults?.length > 0) {
            // Get full content details for matches
            const contentIds = vectorResults.map(r => r.content_id);
            const { data: contentItems } = await supabase
              .from('content_items')
              .select('*')
              .in('id', contentIds)
              .in('type', content_types);

            if (contentItems) {
              results = contentItems.map(item => {
                const vectorResult = vectorResults.find(v => v.content_id === item.id);
                return {
                  content_type: item.type,
                  title: item.title,
                  slug: item.slug,
                  excerpt: item.excerpt || item.summary,
                  url: item.url,
                  similarity_score: vectorResult?.score || 0,
                  metadata: {
                    ingredients: item.ingredients,
                    method_steps: item.method_steps,
                    difficulty: item.difficulty,
                    prep_time: item.prep_time,
                    tags: item.tags
                  }
                };
              });
            }
          }
        }
      } catch (error) {
        console.error('Vector search failed, falling back to text search:', error);
      }
    }

    // Fallback to text-based search if vector search fails or no results
    if (results.length === 0) {
      const { data: textResults, error: textError } = await supabase.rpc('search_site_content', {
        query_text: query,
        content_types: content_types,
        max_results: max_results
      });

      if (!textError && textResults) {
        results = textResults;
      }
    }

    // Add guardrails and formatting
    const formattedResults = results.map(result => ({
      ...result,
      confidence: result.similarity_score > 0.7 ? 'high' : 
                  result.similarity_score > 0.4 ? 'medium' : 'low',
      match_type: result.similarity_score > 0.8 ? 'exact' : 'similar'
    }));

    console.log(`Found ${formattedResults.length} results for query: ${query}`);

    return new Response(
      JSON.stringify({ 
        results: formattedResults,
        query: query,
        total_count: formattedResults.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content search:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        results: [],
        query: '',
        total_count: 0
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});