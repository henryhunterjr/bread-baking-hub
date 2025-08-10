import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse form data to get the uploaded file
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const recipeSlug = (formData.get('recipeSlug') as string) || '';
    
    // Try to resolve user id from Authorization header (optional)
    const authHeader = req.headers.get('Authorization') ?? '';
    let userId = 'anonymous';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } = { user: null }, error: userError } = await supabase.auth.getUser(token);
      if (user && !userError) userId = user.id;
    }
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // recipeSlug is optional for backward compatibility

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.', code: 'invalid_file_type' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 20MB.', code: 'file_too_large' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate storage path inside bucket
    const originalName = file.name || `${recipeSlug || 'upload'}`;
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `raw-uploads/${userId}/${Date.now()}-${safeName}`;

    console.log(`Uploading file: ${fileName} for recipe: ${recipeSlug}`);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recipe-uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload image', details: uploadError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-uploads')
      .getPublicUrl(uploadData.path);

    console.log(`Upload successful. Public URL: ${publicUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        uploadedUrl: publicUrl,
        mime: file.type,
        size: file.size,
        path: uploadData.path,
        recipeSlug
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in upload-recipe-image:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});