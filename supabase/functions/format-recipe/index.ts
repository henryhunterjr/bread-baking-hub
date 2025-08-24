import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
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
    // Validate required environment variables
    if (!openAIApiKey) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return new Response(
        JSON.stringify({ error: 'Configuration error: Missing API key', code: 'missing_config' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Debug: Log if API key is present (without exposing the key)
    console.log('OpenAI API Key status:', { 
      hasKey: !!openAIApiKey, 
      keyLength: openAIApiKey?.length || 0,
      keyPrefix: openAIApiKey?.substring(0, 3) || 'none'
    });

    if (!Deno.env.get('SUPABASE_URL') || !Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Configuration error: Missing Supabase config', code: 'missing_config' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided', code: 'missing_file' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check file size (limit to 20MB)
    if (file.size > 20 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File too large. Please use files under 20MB.', code: 'file_too_large' }),
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
        JSON.stringify({ error: 'Unsupported file type. Please upload JPG, PNG, or PDF.', code: 'invalid_file_type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Persist a temporary copy to Storage for debugging/auditing
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Resolve user id (optional)
    const authHeader = req.headers.get('Authorization') ?? '';
    let userId = 'anonymous';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } = { user: null }, error: userError } = await supabase.auth.getUser(token);
      if (user && !userError) userId = user.id;
    }

    const ext = file.name.split('.').pop() || (file.type === 'application/pdf' ? 'pdf' : 'bin');
    const safeName = (file.name || `upload.${ext}`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadPath = `raw-uploads/${userId}/${Date.now()}-${safeName}`;
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
      // PDF files are not supported by OpenAI's vision API
      return new Response(
        JSON.stringify({ 
          error: 'PDF files are not supported. Please convert your PDF to images (JPG or PNG) and upload those instead. You can take screenshots of each page or use a PDF-to-image converter.', 
          code: 'pdf_not_supported',
          suggestion: 'Convert PDF pages to images and upload them individually'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    } else {
      // Handle regular image files
      console.log('Processing image file...');
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      base64 = encodeBase64(uint8Array);
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
        model: mimeType === 'application/pdf' ? 'gpt-4o' : 'gpt-4o',
        messages: mimeType === 'application/pdf' 
          ? [
              {
                role: 'system',
                content: 'You are an expert recipe formatter. The user has uploaded a PDF file containing a recipe. Since you cannot directly view PDFs, please inform the user that PDF processing requires image conversion. Ask them to either: 1) Convert the PDF pages to images (JPG/PNG) and upload those instead, or 2) Take screenshots of the recipe pages and upload those images. Explain this limitation clearly and provide helpful guidance.'
              },
              {
                role: 'user',
                content: 'I uploaded a PDF file containing a recipe. Please help me understand how to proceed.'
              }
            ]
          : [
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
      console.error('OpenAI API error:', { status: response.status, statusText: response.statusText, error: errorData });
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid OpenAI API key', code: 'openai_auth_error' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      } else if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'OpenAI rate limit exceeded. Please try again later.', code: 'openai_rate_limit' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'OpenAI API request failed', code: 'openai_error', details: errorData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
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
      
      return new Response(JSON.stringify({ recipe, uploadedUrl, mime: mimeType, size: file.size }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse recipe JSON. Raw text:', recipeText);
      console.error('Parse error:', parseError.message);
      throw new Error(`Failed to parse recipe data: ${parseError.message}`);
    }

  } catch (error) {
    console.error('Error in format-recipe function:', error);
    
    // Log structured error to Supabase
    try {
      await supabase.from('error_logs').insert({
        function_name: 'format-recipe',
        error_type: error.name || 'UnknownError',
        error_message: error.message || 'Failed to process recipe',
        error_stack: error.stack,
        request_payload: {
          file_type: file?.type,
          file_size: file?.size,
          user_id: userId
        },
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process recipe',
        code: 'internal_error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});