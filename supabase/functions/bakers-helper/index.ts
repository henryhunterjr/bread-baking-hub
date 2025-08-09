import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, recipeContext, mode, systemMessage } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context-aware prompt
    let contextPrompt = systemMessage || "You are Baker's Helper, an expert baking assistant.";
    
    if (recipeContext) {
      contextPrompt += `\n\nCurrent recipe context:\n`;
      if (recipeContext.title) {
        contextPrompt += `Title: ${recipeContext.title}\n`;
      }
      if (recipeContext.ingredients) {
        contextPrompt += `Ingredients: ${JSON.stringify(recipeContext.ingredients, null, 2)}\n`;
      }
      if (recipeContext.method) {
        contextPrompt += `Method: ${JSON.stringify(recipeContext.method, null, 2)}\n`;
      }
      contextPrompt += "\nUse this recipe context to provide specific, relevant advice.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: contextPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      // Some upstream failures are not JSON; capture safely
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error?.message || 'Failed to get AI response');
      } catch (_) {
        throw new Error(errorText || 'Failed to get AI response');
      }
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in bakers-helper function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});