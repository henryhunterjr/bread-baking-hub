import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import pdfParse from "npm:pdf-parse@1.1.1";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    // Strict environment validation
    if (!OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return new Response(
        JSON.stringify({ 
          error: 'We can\'t reach the formatter right now. Please retry.', 
          code: 'MISSING_OPENAI_KEY',
          message: 'Server is missing OPENAI_API_KEY.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ 
          error: 'We can\'t reach the formatter right now. Please retry.', 
          code: 'MISSING_SUPABASE_CONFIG',
          message: 'Server is missing Supabase configuration.' 
        }),
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

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Resolve user id (optional)
    const authHeader = req.headers.get('Authorization') ?? '';
    let userId = 'anonymous';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } = { user: null }, error: userError } = await supabase.auth.getUser(token);
      if (user && !userError) userId = user.id;
    }

    // Content-Type detection and routing
    const contentType = file.type;
    let recipeContent = '';

    if (contentType === 'application/pdf') {
      // PDF text extraction path
      console.log('Processing PDF file for text extraction...');
      
      try {
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const parsed = await pdfParse(uint8Array);
        const text = (parsed.text || "").trim();
        
        if (!text) {
          return new Response(
            JSON.stringify({ 
              error: 'This PDF appears to be scanned or image-based. Try OCR mode or upload images instead.', 
              code: 'NO_TEXT_IN_PDF',
              message: 'This PDF appears to be scanned. Try OCR mode or upload images.'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          );
        }

        recipeContent = text;
        console.log('Successfully extracted text from PDF:', text.length, 'characters');
        
        // Use text model for PDF content
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an expert recipe formatter. Normalize the following recipe text into JSON with these exact keys: title, introduction, prep_time, cook_time, total_time, servings, course, cuisine, equipment, ingredients, method, tips, troubleshooting. Structure requirements: ingredients[] must include {item, amount_metric, amount_volume, note?}, method[] must include {step, instruction}, tips[] is string array, troubleshooting[] contains {issue, solution} objects. Preserve units and be precise. Output ONLY valid JSON.'
              },
              {
                role: 'user',
                content: `Please format this recipe text into the specified JSON structure:\n\n${text}`
              }
            ],
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('OpenAI API error (PDF text):', { status: response.status, statusText: response.statusText, error: errorData });
          
          // Log to error_logs with detailed info
          await supabase.from('error_logs').insert({
            function_name: 'format-recipe',
            error_type: 'OpenAI_API_Error',
            error_message: `OpenAI API failed: ${response.status} ${response.statusText}`,
            error_stack: errorData,
            request_payload: {
              file_type: contentType,
              file_size: file.size,
              user_id: userId,
              model: 'gpt-4o-mini',
              path: 'pdf_text'
            },
            timestamp: new Date().toISOString(),
            severity: 'error'
          });

          if (response.status === 401) {
            return new Response(
              JSON.stringify({ 
                error: 'We can\'t reach the formatter right now. Please retry.', 
                code: 'openai_auth_error' 
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          } else {
            return new Response(
              JSON.stringify({ 
                error: 'We can\'t reach the formatter right now. Please retry.', 
                code: 'openai_error' 
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
          }
        }

        const data = await response.json();
        const recipeText = data.choices[0].message.content;
        
        // Parse and return JSON
        let cleanedText = recipeText.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        const recipe = JSON.parse(cleanedText);
        console.log('Successfully parsed PDF recipe:', recipe.title);
        
        return new Response(JSON.stringify({ 
          recipe, 
          source: 'pdf_text_extraction',
          originalText: text.substring(0, 500) + '...' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        
        await supabase.from('error_logs').insert({
          function_name: 'format-recipe',
          error_type: 'PDF_Processing_Error',
          error_message: pdfError.message || 'Failed to extract text from PDF',
          error_stack: pdfError.stack,
          request_payload: {
            file_type: contentType,
            file_size: file.size,
            user_id: userId
          },
          timestamp: new Date().toISOString(),
          severity: 'error'
        });

        return new Response(
          JSON.stringify({ 
            error: 'Unable to process this PDF. Please try converting to images or use a different file.', 
            code: 'pdf_processing_error' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

    } else if (contentType.startsWith('image/')) {
      // Image vision path
      console.log('Processing image file with OpenAI Vision...');
      
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64 = encodeBase64(uint8Array);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
                    url: `data:${contentType};base64,${base64}` 
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
        console.error('OpenAI API error (image vision):', { status: response.status, statusText: response.statusText, error: errorData });
        
        await supabase.from('error_logs').insert({
          function_name: 'format-recipe',
          error_type: 'OpenAI_Vision_Error',
          error_message: `OpenAI Vision API failed: ${response.status} ${response.statusText}`,
          error_stack: errorData,
          request_payload: {
            file_type: contentType,
            file_size: file.size,
            user_id: userId,
            model: 'gpt-4o',
            path: 'image_vision'
          },
          timestamp: new Date().toISOString(),
          severity: 'error'
        });

        if (response.status === 401) {
          return new Response(
            JSON.stringify({ 
              error: 'We can\'t reach the formatter right now. Please retry.', 
              code: 'openai_auth_error' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        } else {
          return new Response(
            JSON.stringify({ 
              error: 'We can\'t reach the formatter right now. Please retry.', 
              code: 'openai_error' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
      }

      const data = await response.json();
      const recipeText = data.choices[0].message.content;
      
      // Parse and return JSON
      let cleanedText = recipeText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const recipe = JSON.parse(cleanedText);
      console.log('Successfully parsed image recipe:', recipe.title);
      
      return new Response(JSON.stringify({ 
        recipe, 
        source: 'image_vision' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Unsupported content type. Please upload JPG, PNG, or PDF files.', 
          code: 'unsupported_content_type' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

  } catch (error) {
    console.error('Error in format-recipe function:', error);
    
    // Log structured error to Supabase
    try {
      const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '');
      await supabase.from('error_logs').insert({
        function_name: 'format-recipe',
        error_type: error.name || 'UnknownError',
        error_message: error.message || 'Failed to process recipe',
        error_stack: error.stack,
        request_payload: {
          timestamp: new Date().toISOString(),
          hasFile: !!formData?.get('file')
        },
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'We can\'t reach the formatter right now. Please retry.',
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