import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlogClickData {
  post_id: string;
  post_title: string;
  post_url: string;
  category_names?: string[];
  referrer_page?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Environment validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing SUPABASE_URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const clickData: BlogClickData = await req.json()
    
    // Validate required fields
    if (!clickData.post_id || !clickData.post_title || !clickData.post_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: post_id, post_title, post_url' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user ID from auth header if available
    const authHeader = req.headers.get('Authorization')
    let userId = null
    
    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
        userId = user?.id || null
      } catch (error) {
        console.log('Could not get user from token:', error)
        // Continue without user ID for anonymous tracking
      }
    }

    // Insert click data
    const { data, error } = await supabase
      .from('blog_clicks')
      .insert({
        post_id: clickData.post_id.toString(),
        post_title: clickData.post_title,
        post_url: clickData.post_url,
        category_names: clickData.category_names || [],
        user_id: userId,
        referrer_page: clickData.referrer_page || null
      })
      .select()

    if (error) {
      console.error('Error logging blog click:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to log click' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Blog click logged successfully:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Blog click tracking error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})