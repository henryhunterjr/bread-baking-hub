import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConvertRequest {
  recipeText: string;
  imageUrl?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !openAIApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { recipeText, imageUrl }: ConvertRequest = await req.json();

    if (!recipeText?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Recipe text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the newsletter conversion prompt
    const systemPrompt = `You are an expert newsletter writer specializing in food content. Your task is to convert a raw recipe into an engaging newsletter format.

Requirements for the newsletter:
1. Create an engaging subject line that makes people want to open the email
2. Write a compelling preheader (preview text)
3. Structure the content with:
   - Warm, personal introduction (2-3 paragraphs)
   - Recipe title as a header
   - Ingredients list (nicely formatted)
   - Step-by-step instructions (numbered and clear)
   - Personal tips or story about the recipe
   - Call-to-action encouraging engagement
   - Warm closing

Style guidelines:
- Use a conversational, friendly tone
- Include personal touches and storytelling
- Make it feel like a letter from a friend
- Add enthusiasm about the recipe
- Include seasonal or contextual references when appropriate
- Format using HTML for proper newsletter display

Return your response as JSON with these fields:
{
  "subject": "Engaging subject line",
  "preheader": "Preview text that appears after subject",
  "content": "Full HTML newsletter content"
}`;

    const userPrompt = `Convert this recipe into an engaging newsletter:

${recipeText}

${imageUrl ? `Recipe image URL: ${imageUrl}` : ''}

Make it personal, engaging, and newsletter-ready with proper HTML formatting.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Strip markdown code blocks if present
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    // Parse the JSON response
    let newsletterData;
    try {
      newsletterData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      console.error('Parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Validate the response structure
    if (!newsletterData.subject || !newsletterData.content) {
      throw new Error('Invalid newsletter format returned by AI');
    }

    // Log the successful conversion
    console.log('Successfully converted recipe to newsletter for user:', user.id);

    return new Response(JSON.stringify(newsletterData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in convert-recipe-to-newsletter function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});