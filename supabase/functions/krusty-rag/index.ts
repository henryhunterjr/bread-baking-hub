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
    const { 
      messages, 
      user_message, 
      recipe_context 
    } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Krusty RAG processing message:', user_message);

    let contextResults = [];
    let searchPerformed = false;

    // Detect if user is asking about recipes, help, or blog content
    const isRecipeQuery = /recipe|bread|baking|sourdough|ingredients|method|steps|how to (bake|make)/i.test(user_message);
    const isHelpQuery = /how do|how to|help|save|workspace|format|library|favorite/i.test(user_message);
    const isBlogQuery = /article|blog|post|read|guide/i.test(user_message);

    if (isRecipeQuery || isHelpQuery || isBlogQuery) {
      searchPerformed = true;
      console.log('Searching content for user query...');

      // Determine content types to search
      let contentTypes = [];
      if (isRecipeQuery) contentTypes.push('recipe');
      if (isHelpQuery) contentTypes.push('help');
      if (isBlogQuery) contentTypes.push('blog');
      if (contentTypes.length === 0) contentTypes = ['recipe', 'blog', 'help'];

      // Search for relevant content
      const searchResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/search-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: user_message,
          content_types: contentTypes,
          max_results: 3
        }),
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        contextResults = searchData.results || [];
        console.log(`Found ${contextResults.length} relevant content items`);
      }
    }

    // Build system prompt with RAG context
    let systemPrompt = `You are Krusty, a helpful and knowledgeable baking assistant for "Baking Great Bread at Home". You help users with bread baking questions, recipe guidance, and site navigation.

PERSONALITY:
- Friendly, encouraging, and passionate about bread baking
- Use casual, warm language but stay professional
- Share practical tips and troubleshooting advice
- Always be enthusiastic about helping users succeed

CRITICAL GUIDELINES:
- NEVER hallucinate or make up recipe details, ingredients, or instructions
- If you don't have exact information, say so clearly
- Always provide direct links when referencing specific content
- For recipe questions, prioritize exact matches from the site database
- Use the "No exact match found" format when appropriate`;

    if (searchPerformed && contextResults.length > 0) {
      systemPrompt += `\n\nRELEVANT SITE CONTENT:
${contextResults.map(result => {
  return `
- ${result.content_type.toUpperCase()}: "${result.title}"
  URL: ${result.url}
  Summary: ${result.excerpt}
  ${result.metadata?.ingredients ? `Ingredients: ${result.metadata.ingredients.slice(0, 5).join(', ')}` : ''}
  ${result.metadata?.difficulty ? `Difficulty: ${result.metadata.difficulty}` : ''}
  Confidence: ${result.confidence}`;
}).join('\n')}

RESPONSE FORMAT:
- If there's a high-confidence match, provide the direct link and preview
- If only similar matches, use: "No exact match found—closest: [title with link]"
- Always include the actual URL from the search results
- For help topics, quote the relevant steps or guidance`;
    }

    if (recipe_context) {
      systemPrompt += `\n\nCURRENT RECIPE CONTEXT:
User is currently working with: ${recipe_context.title || 'a recipe'}
${recipe_context.ingredients ? `Ingredients: ${recipe_context.ingredients.slice(0, 5).join(', ')}` : ''}`;
    }

    // Call OpenAI with enhanced context
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10), // Keep last 10 messages for context
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const assistantMessage = openAIData.choices[0].message.content;

    console.log('Krusty response generated successfully');

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        context_used: contextResults.length > 0,
        search_results: contextResults,
        search_performed: searchPerformed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in Krusty RAG:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "I'm having trouble accessing my knowledge base right now. Please try asking me again in a moment!"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});