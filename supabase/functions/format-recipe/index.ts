import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument } from "https://cdn.skypack.dev/pdf-lib@1.17.1";
import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check file size (limit to 20MB)
    if (file.size > 20 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File too large. Please use files under 20MB.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload JPG, PNG, or PDF.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Persist a temporary copy to Storage for debugging/auditing
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const ext = file.name.split('.').pop() || (file.type === 'application/pdf' ? 'pdf' : 'bin');
    const uploadPath = `raw-uploads/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    let uploadedUrl = '';

    try {
      const { data: up, error: upErr } = await supabase.storage
        .from('recipe-uploads')
        .upload(uploadPath, file, { cacheControl: '3600', upsert: false });
      if (!upErr && up?.path) {
        const { data: pub } = supabase.storage.from('recipe-uploads').getPublicUrl(up.path);
        uploadedUrl = pub.publicUrl;
      } else if (upErr) {
        console.warn('Temp upload failed (non-fatal):', upErr.message);
      }
    } catch (e) {
      console.warn('Temp upload exception (non-fatal):', e);
    }

    let base64 = '';
    let mimeType = file.type || 'image/jpeg';

    // Handle both PDF and image files
    if (file.type === 'application/pdf') {
      try {
        console.log('Processing PDF file...');
        const arrayBuffer = await file.arrayBuffer();
        
        // For PDFs, we'll send them directly to OpenAI as GPT-4o can handle PDFs
        let binary = '';
        const chunkSize = 8192;
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, Array.from(chunk));
        }
        
        base64 = btoa(binary);
        mimeType = 'application/pdf';
        
        console.log('Successfully processed PDF file');
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        return new Response(
          JSON.stringify({ error: 'Unable to process PDF. Please try again or upload an image instead.' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    } else {
      // Handle regular image files
      console.log('Processing image file...');
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to base64 in chunks to avoid stack overflow
      let binary = '';
      const chunkSize = 8192;
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      base64 = btoa(binary);
      console.log('Successfully processed image file');
    }

    console.log('Processing recipe image with OpenAI Vision...', { fileType: mimeType, fileSize: file.size });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert recipe formatter. When given a handwritten or scanned recipe image, extract the full recipe details and return it in JSON format with these exact keys: title, introduction, prep_time, cook_time, total_time, servings, course, cuisine, equipment, ingredients, method, tips, troubleshooting. Structure requirements: ingredients[] must include {item, amount_metric, amount_volume, note?}, method[] must include {step, instruction}, tips[] is string array, troubleshooting[] contains {issue, solution} objects. Focus on clarity and completeness. If any data is missing, reconstruct or infer it based on the recipe context. Output ONLY valid JSON.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { 
                  url: `data:${mimeType};base64,${base64}` 
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const recipeText = data.choices[0].message.content;
    
    console.log('Raw OpenAI response:', recipeText);
    
    try {
      // Clean the response text - sometimes OpenAI adds markdown formatting
      let cleanedText = recipeText.trim();
      
      // Remove any markdown code block formatting
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const recipe = JSON.parse(cleanedText);
      console.log('Successfully parsed recipe:', recipe.title);
      
      return new Response(JSON.stringify({ recipe, uploadedUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse recipe JSON. Raw text:', recipeText);
      console.error('Parse error:', parseError.message);
      throw new Error(`Failed to parse recipe data: ${parseError.message}`);
    }

  } catch (error) {
    console.error('Error in format-recipe function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process recipe' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});