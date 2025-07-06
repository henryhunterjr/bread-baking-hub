import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Symptom categories for AI reference
const symptomCategories = [
  'collapse', 'crumb', 'proofing', 'baking', 'shaping'
];

// Sample symptom IDs for AI reference (these should match your symptoms.json)
const availableSymptoms = [
  'sunken-middle', 'gummy-crumb', 'burnt-bottom', 'no-oven-spring', 'poor-scoring',
  'overproofed-dough', 'underproofed-dough', 'weak-gluten', 'thick-crust', 'pale-crust',
  'large-holes', 'sour-taste', 'flat-loaf', 'sticky-dough', 'uneven-crumb',
  'dense-bread', 'splitting-crust', 'weak-starter', 'shaping-tears', 'no-browning',
  'yeasty-smell', 'tough-texture'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are a bread troubleshooting expert. Analyze the given text and identify potential bread baking problems.

Available symptom categories: ${symptomCategories.join(', ')}
Available symptom IDs: ${availableSymptoms.join(', ')}

Return a JSON array of objects with "id" (symptom identifier) and "score" (confidence 0-1). Only include symptoms you're confident about (score >= 0.3). If no symptoms are detected, return an empty array.

Example response: [{"id": "gummy-crumb", "score": 0.8}, {"id": "underproofed-dough", "score": 0.6}]`
          },
          {
            role: 'user',
            content: `Analyze this bread-related text for troubleshooting symptoms: "${text}"`
          }
        ],
        functions: [
          {
            name: 'identify_bread_symptoms',
            description: 'Identify bread baking problems from text description',
            parameters: {
              type: 'object',
              properties: {
                symptoms: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'Symptom identifier from the available list'
                      },
                      score: {
                        type: 'number',
                        minimum: 0,
                        maximum: 1,
                        description: 'Confidence score for this symptom'
                      }
                    },
                    required: ['id', 'score']
                  }
                }
              },
              required: ['symptoms']
            }
          }
        ],
        function_call: { name: 'identify_bread_symptoms' },
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return new Response(JSON.stringify({ error: 'AI analysis failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    // Extract function call result
    const functionCall = data.choices[0]?.message?.function_call;
    if (!functionCall || functionCall.name !== 'identify_bread_symptoms') {
      console.error('Unexpected response format:', data);
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let symptoms;
    try {
      const functionResult = JSON.parse(functionCall.arguments);
      symptoms = functionResult.symptoms || [];
    } catch (parseError) {
      console.error('Failed to parse function result:', parseError);
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate and filter results
    const validSymptoms = symptoms.filter((symptom: any) => 
      symptom && 
      typeof symptom.id === 'string' && 
      typeof symptom.score === 'number' &&
      symptom.score >= 0.3 && 
      symptom.score <= 1 &&
      availableSymptoms.includes(symptom.id)
    );

    return new Response(JSON.stringify(validSymptoms), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scan-symptoms function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});