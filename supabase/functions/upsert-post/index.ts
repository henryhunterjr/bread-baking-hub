import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define interfaces directly in this file
interface PostData {
  id?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  heroImageUrl?: string;
  inlineImageUrl?: string;
  socialImageUrl?: string;
  tags?: string[];
  publishAsNewsletter?: boolean;
  isDraft?: boolean;
  slug?: string;
}

interface PostRecord {
  id?: string;
  user_id: string;
  title?: string;
  subtitle?: string;
  content?: string;
  hero_image_url?: string;
  inline_image_url?: string;
  social_image_url?: string;
  tags?: string[];
  publish_as_newsletter?: boolean;
  is_draft?: boolean;
  slug?: string;
  published_at?: string | null;
  updated_at?: string;
}

// Data preparation function
function preparePostRecord(postData: PostData, userId: string, slug?: string): PostRecord {
  const {
    id,
    title,
    subtitle,
    content,
    heroImageUrl,
    inlineImageUrl,
    socialImageUrl,
    tags,
    publishAsNewsletter,
    isDraft
  } = postData;

  const postRecord: PostRecord = {
    user_id: userId,
  };

  // Include id for updates (if provided)
  if (id !== undefined) postRecord.id = id;
  
  // Only include fields that are provided in the request
  if (title !== undefined) postRecord.title = title;
  if (subtitle !== undefined) postRecord.subtitle = subtitle;
  if (content !== undefined) postRecord.content = content;
  if (heroImageUrl !== undefined) postRecord.hero_image_url = heroImageUrl;
  if (inlineImageUrl !== undefined) postRecord.inline_image_url = inlineImageUrl;
  if (socialImageUrl !== undefined) postRecord.social_image_url = socialImageUrl;
  if (tags !== undefined) postRecord.tags = tags || [];
  if (publishAsNewsletter !== undefined) postRecord.publish_as_newsletter = publishAsNewsletter;
  if (isDraft !== undefined) postRecord.is_draft = isDraft;
  if (slug !== undefined) postRecord.slug = slug;
  
  // Set published_at for new posts or when changing draft status
  if (isDraft !== undefined) {
    postRecord.published_at = isDraft ? null : new Date().toISOString();
  }

  return postRecord;
}

// Slug generation function with conflict resolution
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) || 'untitled-post';
}

// Function to find unique slug for user
async function findUniqueSlug(supabaseClient: any, baseSlug: string, userId: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    console.log(`🔍 Checking slug availability: "${slug}" for user: ${userId}`);
    
    // Check if slug exists for this user
    let query = supabaseClient
      .from('blog_posts')
      .select('id, slug')
      .eq('user_id', userId)
      .eq('slug', slug);
    
    // Exclude current post if updating
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data: existingPosts, error } = await query;
    
    if (error) {
      console.error('❌ Error checking slug uniqueness:', error);
      throw error;
    }
    
    if (!existingPosts || existingPosts.length === 0) {
      console.log(`✅ Slug "${slug}" is available`);
      return slug;
    }
    
    console.log(`⚠️  Slug "${slug}" already exists, trying variation ${counter}`);
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Prevent infinite loops
    if (counter > 100) {
      console.error('❌ Too many slug conflicts, using timestamp fallback');
      return `${baseSlug}-${Date.now()}`;
    }
  }
}

serve(async (req) => {
  console.log('=== UPSERT POST FUNCTION STARTED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Environment variables check
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    console.log('Environment check:', {
      hasUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
      urlPreview: SUPABASE_URL ? SUPABASE_URL.substring(0, 20) + '...' : 'null'
    });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ Missing environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Server misconfigured - missing environment variables",
          details: {
            hasUrl: !!SUPABASE_URL,
            hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse request body
    const body = await req.json();
    console.log('📥 Request body received:', body);

    const { postData, userId } = body;

    if (!postData || !userId) {
      console.error("❌ Missing required data:", { hasPostData: !!postData, hasUserId: !!userId });
      return new Response(
        JSON.stringify({ error: "Missing postData or userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle slug generation and uniqueness
    let finalSlug = postData.slug;
    
    if (!finalSlug && postData.title) {
      const baseSlug = generateSlug(postData.title);
      console.log('🔗 Generated base slug from title:', baseSlug);
      
      // Find unique slug for this user
      finalSlug = await findUniqueSlug(supabaseClient, baseSlug, userId, postData.id);
    } else if (!finalSlug) {
      finalSlug = 'untitled-post-' + Date.now();
      console.log('🔗 Using timestamp fallback slug:', finalSlug);
    } else {
      // User provided slug - ensure it's unique
      console.log('🔗 User provided slug, checking uniqueness:', finalSlug);
      finalSlug = await findUniqueSlug(supabaseClient, finalSlug, userId, postData.id);
    }

    console.log('🎯 Final unique slug:', finalSlug);

    // Prepare post record with verified unique slug
    const postRecord = preparePostRecord(postData, userId, finalSlug);
    postRecord.updated_at = new Date().toISOString();

    console.log('💾 Prepared post record:', JSON.stringify(postRecord, null, 2));

    // Determine if this is an update or insert
    const isUpdate = postData.id && postData.id.trim() !== '';
    
    let data, error;
    
    if (isUpdate) {
      console.log('📤 Updating existing post with ID:', postData.id);
      // For updates, use the ID to identify the record
      const { data: updateData, error: updateError } = await supabaseClient
        .from('blog_posts')
        .update(postRecord)
        .eq('id', postData.id)
        .eq('user_id', userId) // Security: ensure user owns the post
        .select()
        .single();
      
      data = updateData;
      error = updateError;
    } else {
      console.log('📤 Inserting new post to database...');
      // For new posts, insert directly
      const { data: insertData, error: insertError } = await supabaseClient
        .from('blog_posts')
        .insert(postRecord)
        .select()
        .single();
      
      data = insertData;
      error = insertError;
    }

    if (error) {
      console.error('❌ Database operation failed:', error);
      return new Response(
        JSON.stringify({ 
          error: "Database operation failed", 
          message: error.message,
          code: error.code,
          details: error.details,
          operation: isUpdate ? 'update' : 'insert'
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data) {
      console.error('❌ No data returned from database operation');
      return new Response(
        JSON.stringify({ 
          error: "No data returned from database operation",
          operation: isUpdate ? 'update' : 'insert'
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('✅ Post operation successful:', { operation: isUpdate ? 'update' : 'insert', id: data.id, slug: data.slug });
    return new Response(
      JSON.stringify({ 
        success: true, 
        post: data, 
        slug: data.slug,
        operation: isUpdate ? 'updated' : 'created'
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('❌ Critical error in upsert-post function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Critical function error", 
        message: error.message || 'Unknown error',
        type: error.name || 'UnknownError'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});