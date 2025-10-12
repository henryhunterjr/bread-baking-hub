import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

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
    // Environment validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing SUPABASE_URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Missing SUPABASE_ANON_KEY' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseKey,
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

    const { title, excerpt, content, postUrl, slug } = await req.json();

    // Get newsletter subscribers
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from('newsletter_subscribers')
      .select('email, name')
      .eq('active', true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscribers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No active subscribers found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing RESEND_API_KEY' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    // Create unsubscribe link
    const unsubscribeUrl = `https://bakinggreatbread.com/unsubscribe`;

    // Create HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2c3e50; margin-bottom: 10px;">${title}</h1>
    ${excerpt ? `<p style="color: #7f8c8d; font-size: 16px;">${excerpt}</p>` : ''}
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
    ${content}
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${postUrl}" style="display: inline-block; background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Full Post</a>
  </div>
  
  <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 14px;">
    <p>You're receiving this because you subscribed to <strong>Baking Great Bread</strong></p>
    <p><a href="${unsubscribeUrl}" style="color: #e74c3c; text-decoration: none;">Unsubscribe</a></p>
    <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} Baking Great Bread. All rights reserved.</p>
  </div>
</body>
</html>
    `.trim();

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    for (const batch of batches) {
      try {
        const emailPromises = batch.map(subscriber => 
          resend.emails.send({
            from: 'Baking Great Bread <newsletter@bakinggreatbread.com>',
            to: [subscriber.email],
            subject: title,
            html: htmlContent,
          })
        );

        const results = await Promise.allSettled(emailPromises);
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successCount++;
          } else {
            failureCount++;
            errors.push({
              email: batch[index].email,
              error: result.reason?.message || 'Unknown error'
            });
          }
        });

        // Small delay between batches to respect rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Batch send error:', error);
        failureCount += batch.length;
      }
    }

    console.log(`Newsletter sent: ${successCount} succeeded, ${failureCount} failed`);

    // Log the send to database
    try {
      await supabaseClient.from('security_audit_log').insert({
        event_type: 'newsletter_sent',
        event_data: {
          title,
          slug,
          subscriber_count: subscribers.length,
          success_count: successCount,
          failure_count: failureCount,
          errors: errors.slice(0, 10) // Store first 10 errors only
        },
        user_id: user.id
      });
    } catch (logError) {
      console.error('Failed to log newsletter send:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter sent to ${successCount} of ${subscribers.length} subscribers`,
        successCount,
        failureCount,
        totalSubscribers: subscribers.length,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined
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