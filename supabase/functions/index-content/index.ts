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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type } = await req.json();
    console.log('Starting content indexing for type:', type);

    let indexedCount = 0;

    if (type === 'recipes' || type === 'all') {
      // Index public recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('id, title, slug, data, tags, image_url, created_at')
        .eq('is_public', true);

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
      } else {
        for (const recipe of recipes) {
          try {
            const ingredients = recipe.data?.ingredients || [];
            const method = recipe.data?.method || [];
            const summary = `${recipe.title}. Ingredients: ${ingredients.slice(0, 5).join(', ')}. Method: ${method.slice(0, 2).join(' ')}`;
            
            // Generate embedding for the summary
            const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'text-embedding-3-small',
                input: summary,
              }),
            });

            if (!embeddingResponse.ok) {
              console.error('Failed to generate embedding for recipe:', recipe.title);
              continue;
            }

            const embeddingData = await embeddingResponse.json();
            const embedding = embeddingData.data[0].embedding;

            // Store in content_items
            await supabase.from('content_items').upsert({
              id: recipe.id,
              type: 'recipe',
              title: recipe.title,
              slug: recipe.slug,
              url: `/recipes/${recipe.slug}`,
              summary: summary.substring(0, 500),
              body_text: summary,
              tags: recipe.data?.tags || recipe.tags || [],
              excerpt: summary.substring(0, 200),
              ingredients: ingredients,
              method_steps: method,
              difficulty: recipe.data?.difficulty,
              prep_time: recipe.data?.prepTime || recipe.data?.prep_time,
              indexed_at: new Date().toISOString()
            });

            // Store embedding
            await supabase.from('content_embeddings').upsert({
              content_id: recipe.id,
              chunk_index: 0,
              text_chunk: summary,
              embedding: `[${embedding.join(',')}]`,
            });

            indexedCount++;
          } catch (error) {
            console.error('Error indexing recipe:', recipe.title, error);
          }
        }
      }
    }

    if (type === 'blog' || type === 'all') {
      // Index blog posts
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, tags, created_at')
        .eq('is_draft', false)
        .not('published_at', 'is', null);

      if (blogError) {
        console.error('Error fetching blog posts:', blogError);
      } else {
        for (const post of blogPosts) {
          try {
            const summary = post.excerpt || post.content?.substring(0, 300) || '';
            
            // Generate embedding
            const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'text-embedding-3-small',
                input: `${post.title}. ${summary}`,
              }),
            });

            if (!embeddingResponse.ok) {
              console.error('Failed to generate embedding for blog post:', post.title);
              continue;
            }

            const embeddingData = await embeddingResponse.json();
            const embedding = embeddingData.data[0].embedding;

            // Store in content_items
            await supabase.from('content_items').upsert({
              id: post.id,
              type: 'blog',
              title: post.title,
              slug: post.slug,
              url: `/blog/${post.slug}`,
              summary: summary,
              body_text: post.content || '',
              tags: post.tags || [],
              excerpt: summary.substring(0, 200),
              indexed_at: new Date().toISOString()
            });

            // Store embedding
            await supabase.from('content_embeddings').upsert({
              content_id: post.id,
              chunk_index: 0,
              text_chunk: `${post.title}. ${summary}`,
              embedding: `[${embedding.join(',')}]`,
            });

            indexedCount++;
          } catch (error) {
            console.error('Error indexing blog post:', post.title, error);
          }
        }
      }
    }

    if (type === 'help' || type === 'all') {
      // Index help topics
      const { data: helpTopics, error: helpError } = await supabase
        .from('help_topics')
        .select('*');

      if (helpError) {
        console.error('Error fetching help topics:', helpError);
      } else {
        for (const topic of helpTopics) {
          try {
            const summary = `${topic.title}. ${topic.summary}. Steps: ${topic.steps?.join(' ') || ''}`;
            
            // Generate embedding
            const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'text-embedding-3-small',
                input: summary,
              }),
            });

            if (!embeddingResponse.ok) {
              console.error('Failed to generate embedding for help topic:', topic.title);
              continue;
            }

            const embeddingData = await embeddingResponse.json();
            const embedding = embeddingData.data[0].embedding;

            // Store in content_items
            await supabase.from('content_items').upsert({
              id: topic.key,
              type: 'help',
              title: topic.title,
              slug: topic.key,
              url: `/help#${topic.key}`,
              summary: topic.summary,
              body_text: summary,
              tags: ['help', 'how-to'],
              excerpt: topic.summary.substring(0, 200),
              indexed_at: new Date().toISOString()
            });

            // Store embedding
            await supabase.from('content_embeddings').upsert({
              content_id: topic.key,
              chunk_index: 0,
              text_chunk: summary,
              embedding: `[${embedding.join(',')}]`,
            });

            indexedCount++;
          } catch (error) {
            console.error('Error indexing help topic:', topic.title, error);
          }
        }
      }
    }

    console.log(`Content indexing completed. Indexed ${indexedCount} items.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        indexed_count: indexedCount,
        type: type 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content indexing:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});