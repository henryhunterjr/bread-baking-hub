import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";
import pdfParse from "npm:pdf-parse@1.1.1";

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

  // Initialize environment and Supabase client
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  let supabase: any = null;
  let userId: string | null = null;
  let sourceType: string | null = null;
  let rawText: string | null = null;

  // Helper function to log failures and return typed errors
  const fail = async (code: string, message: string, httpStatus: number = 200) => {
    try {
      if (supabase) {
        await supabase.from('format_jobs').insert({
          user_id: userId,
          source_type: sourceType,
          raw_text: rawText,
          status: 'failed',
          error_code: code,
          error_detail: message,
        });
      }
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
    return new Response(
      JSON.stringify({ ok: false, code, message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: httpStatus }
    );
  };

  try {
    // Strict environment validation
    if (!OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      return await fail('MISSING_OPENAI_KEY', 'We can\'t reach the formatter right now. Please retry.', 500);
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase configuration');
      return await fail('MISSING_SUPABASE_CONFIG', 'We can\'t reach the formatter right now. Please retry.', 500);
    }

    // Initialize Supabase client
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Resolve user id (optional)
    const authHeader = req.headers.get('Authorization') ?? '';
    if (authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } = { user: null }, error: userError } = await supabase.auth.getUser(token);
        if (user && !userError) userId = user.id;
      } catch (authError) {
        console.error('Auth error:', authError);
        // Continue as anonymous user
      }
    }

    // Check request content type and parse accordingly  
    const contentTypeHeader = req.headers.get('content-type') || '';
    
    if (contentTypeHeader.includes('application/json')) {
      // JSON request - text input
      try {
        const jsonBody = await req.json();
        if (jsonBody.source_type === 'text' && jsonBody.text) {
          sourceType = 'text';
          rawText = jsonBody.text;
          
          if (!rawText || rawText.trim().length < 10) {
            return await fail('EMPTY_TEXT', 'Please provide a longer recipe text.');
          }
          
          console.log('Processing text input:', rawText.length, 'characters');
        } else {
          return await fail('BAD_REQUEST', 'Invalid JSON request. Expected { source_type: "text", text: "..." }');
        }
      } catch (jsonError) {
        return await fail('INVALID_JSON', 'Invalid JSON request body.');
      }
    } else {
      // FormData request - file input
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return await fail('MISSING_FILE', 'No file provided', 400);
      }

      // Check file size (limit to 20MB)
      if (file.size > 20 * 1024 * 1024) {
        return await fail('FILE_TOO_LARGE', 'File too large. Please use files under 20MB.', 400);
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return await fail('INVALID_FILE_TYPE', 'Unsupported file type. Please upload JPG, PNG, or PDF.', 400);
      }

      // Content-Type detection and routing
      const contentType = file.type;
      sourceType = contentType === 'application/pdf' ? 'pdf' : contentType.startsWith('image/') ? 'image' : 'unknown';

      if (contentType === 'application/pdf') {
      // PDF text extraction path
      console.log('Processing PDF file for text extraction...');
      
      try {
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const parsed = await pdfParse(uint8Array);
        const text = (parsed.text || "").trim();
        rawText = text;
        
        if (!text || text.length < 20) {
          return await fail('NO_TEXT_IN_PDF', 'This PDF appears to be scanned or image-based. Try OCR mode or upload images instead.');
        }

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
                content: 'You are an expert recipe formatter. Normalize the following recipe text into JSON with these exact keys: title, introduction, prep_time, cook_time, total_time, servings, course, cuisine, equipment, ingredients, method, tips, troubleshooting, tags. Structure requirements: ingredients[] must include {item, amount_metric, amount_volume, note?} OR {header: string} for section headers (preserve markdown headers like ###, #### as section headers), method[] must include {step, instruction}, tips[] is string array, troubleshooting[] contains {issue, solution} objects, tags[] should be a string array of 3-5 relevant keywords/categories based on the recipe content (e.g., bread, sourdough, breakfast, dessert, etc.). IMPORTANT: When you encounter markdown headers (###, ####) in ingredient lists, convert them to {header: "Header Text"} entries in the ingredients array to preserve recipe section organization. Preserve units and be precise. Output ONLY valid JSON.'
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
          
          // Log to error_logs
          try {
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
          } catch {}

          return await fail('OPENAI_API_ERROR', 'We can\'t reach the formatter right now. Please retry.');
        }

        const data = await response.json();
        const recipeText = data.choices[0]?.message?.content;
        
        if (!recipeText) {
          return await fail('EMPTY_RESPONSE', 'No response from formatting service. Please retry.');
        }
        
        // Parse and return JSON
        let cleanedText = recipeText.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        try {
          const recipe = JSON.parse(cleanedText);
          console.log('Successfully parsed PDF recipe:', recipe.title);
          
          // Log success
          try {
            await supabase.from('format_jobs').insert({
              user_id: userId,
              source_type: 'pdf',
              raw_text: text,
              status: 'success',
            });
          } catch {}
          
          return new Response(JSON.stringify({ 
            ok: true,
            recipe, 
            source: 'pdf_text_extraction',
            originalText: text.substring(0, 500) + '...' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          return await fail('JSON_PARSE_ERROR', 'Failed to parse recipe format. Please try again.');
        }

      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        return await fail('PDF_PROCESSING_ERROR', 'Unable to process this PDF. Please try converting to images or use a different file.');
      }

    } else if (contentType.startsWith('image/')) {
      // Image vision path
      console.log('Processing image file with OpenAI Vision...');
      sourceType = 'image';
      
      try {
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
                content: 'You are an expert recipe formatter. When given a handwritten or scanned recipe image, extract the full recipe details and return it in JSON format with these exact keys: title, introduction, prep_time, cook_time, total_time, servings, course, cuisine, equipment, ingredients, method, tips, troubleshooting, tags. Structure requirements: ingredients[] must include {item, amount_metric, amount_volume, note?} OR {header: string} for section headers (preserve any section headers or component names), method[] must include {step, instruction}, tips[] is string array, troubleshooting[] contains {issue, solution} objects, tags[] should be a string array of 3-5 relevant keywords/categories based on the recipe content (e.g., bread, sourdough, breakfast, dessert, etc.). IMPORTANT: When you see ingredient sections or component names (like "For the sauce:", "For the filling:", etc.), convert them to {header: "Header Text"} entries in the ingredients array to preserve recipe organization. Focus on clarity and completeness. If any data is missing, reconstruct or infer it based on the recipe context. Output ONLY valid JSON.'
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
          
          // Log to error_logs
          try {
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
          } catch {}

          return await fail('OPENAI_VISION_ERROR', 'We can\'t reach the formatter right now. Please retry.');
        }

        const data = await response.json();
        const recipeText = data.choices[0]?.message?.content;
        
        if (!recipeText) {
          return await fail('EMPTY_RESPONSE', 'No response from formatting service. Please retry.');
        }
        
        // Parse and return JSON
        let cleanedText = recipeText.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        try {
          const recipe = JSON.parse(cleanedText);
          console.log('Successfully parsed image recipe:', recipe.title);
          
          // Log success
          try {
            await supabase.from('format_jobs').insert({
              user_id: userId,
              source_type: 'image',
              raw_text: 'Image processed successfully',
              status: 'success',
            });
          } catch {}
          
          return new Response(JSON.stringify({ 
            ok: true,
            recipe, 
            source: 'image_vision' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          return await fail('JSON_PARSE_ERROR', 'Failed to parse recipe format. Please try again.');
        }

      } catch (imageError) {
        console.error('Image processing error:', imageError);
        return await fail('IMAGE_PROCESSING_ERROR', 'Unable to process this image. Please try a different file.');
      }

    } else {
      return await fail('UNSUPPORTED_FILE_TYPE', 'Unsupported content type. Please upload JPG, PNG, or PDF files.');
    }
    }

    // Text processing path (for JSON requests)
    if (sourceType === 'text' && rawText) {
      console.log('Processing text input with OpenAI...');
      
      try {
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
                content: 'You are an expert recipe formatter. Normalize the following recipe text into JSON with these exact keys: title, introduction, prep_time, cook_time, total_time, servings, course, cuisine, equipment, ingredients, method, tips, troubleshooting, tags. Structure requirements: ingredients[] must include {item, amount_metric, amount_volume, note?} OR {header: string} for section headers (preserve markdown headers like ###, #### as section headers), method[] must include {step, instruction}, tips[] is string array, troubleshooting[] contains {issue, solution} objects, tags[] should be a string array of 3-5 relevant keywords/categories based on the recipe content (e.g., bread, sourdough, breakfast, dessert, etc.). IMPORTANT: When you encounter markdown headers (###, ####) in ingredient lists, convert them to {header: "Header Text"} entries in the ingredients array to preserve recipe section organization. Preserve units and be precise. Output ONLY valid JSON.'
              },
              {
                role: 'user',
                content: `Please format this recipe text into the specified JSON structure:\n\n${rawText}`
              }
            ],
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('OpenAI API error (text):', { status: response.status, statusText: response.statusText, error: errorData });
          
          // Log to error_logs
          try {
            await supabase.from('error_logs').insert({
              function_name: 'format-recipe',
              error_type: 'OpenAI_API_Error',
              error_message: `OpenAI API failed: ${response.status} ${response.statusText}`,
              error_stack: errorData,
              request_payload: {
                source_type: 'text',
                text_length: rawText.length,
                user_id: userId,
                model: 'gpt-4o-mini',
                path: 'text'
              },
              timestamp: new Date().toISOString(),
              severity: 'error'
            });
          } catch {}

          return await fail('OPENAI_API_ERROR', 'We can\'t reach the formatter right now. Please retry.');
        }

        const data = await response.json();
        const recipeText = data.choices[0]?.message?.content;
        
        if (!recipeText) {
          return await fail('EMPTY_RESPONSE', 'No response from formatting service. Please retry.');
        }
        
        // Parse and return JSON
        let cleanedText = recipeText.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        try {
          const recipe = JSON.parse(cleanedText);
          console.log('Successfully parsed text recipe:', recipe.title);
          
          // Log success
          try {
            await supabase.from('format_jobs').insert({
              user_id: userId,
              source_type: 'text',
              raw_text: rawText,
              status: 'success',
            });
          } catch {}
          
          return new Response(JSON.stringify({ 
            ok: true,
            recipe, 
            source: 'text_processing'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          return await fail('JSON_PARSE_ERROR', 'Failed to parse recipe format. Please try again.');
        }

      } catch (textError) {
        console.error('Text processing error:', textError);
        return await fail('TEXT_PROCESSING_ERROR', 'Unable to process this text. Please try again.');
      }
    }

  } catch (error) {
    console.error('Unhandled error in format-recipe function:', error);
    
    // Use the fail helper for unhandled errors
    return await fail('UNHANDLED_ERROR', 'We can\'t reach the formatter right now. Please retry.');
  }
});