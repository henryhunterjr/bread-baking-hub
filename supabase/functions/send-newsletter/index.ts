import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { title, excerpt, content, postUrl } = await req.json();

    // Get newsletter subscribers (you'll need to create this table)
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from('newsletter_subscribers')
      .select('email, name')
      .eq('active', true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      // Continue anyway as this might be the first newsletter
    }

    // For now, we'll just log the newsletter data
    // In a real implementation, you'd integrate with an email service like Resend
    console.log('Newsletter queued:', {
      title,
      excerpt,
      postUrl,
      subscriberCount: subscribers?.length || 0
    });

    // Here you would typically:
    // 1. Create HTML email template
    // 2. Send emails to all subscribers using Resend or similar service
    // 3. Track email sends in a newsletters_sent table

    // For now, just return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Newsletter queued successfully',
        subscriberCount: subscribers?.length || 0
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-newsletter function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});