import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

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
    // Check for authorization header
    const authHeader = req.headers.get('Authorization');
    const expectedToken = Deno.env.get('AUTO_DRAFT_TOKEN');
    
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== expectedToken) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData = await req.json();
    const { type, payload, runDate } = requestData;

    // Validate required fields
    if (!type || !payload || !['blog', 'newsletter'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert draft into ai_drafts table
    console.log('Inserting draft with data:', { type, payload, runDate });
    const { data: draft, error: insertError } = await supabaseClient
      .from('ai_drafts')
      .insert({
        type,
        payload,
        run_date: runDate || new Date().toISOString().split('T')[0]
      })
      .select()
      .single();
    
    console.log('Insert result:', { draft, insertError });

    if (insertError) {
      console.error('Error inserting draft:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save draft' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send notification email
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const title = payload.blogDraft?.title || payload.title || 'Untitled Draft';
    
    try {
      await resend.emails.send({
        from: "AI Draft System <noreply@vitalesourdoughco.com>",
        to: ["vitalesourdoughco@gmail.com"],
        subject: `New AI Draft: ${title}`,
        html: `
          <h2>New AI Draft Received</h2>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Run Date:</strong> ${draft.run_date}</p>
          <p><a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/dashboard?tab=inbox">View in Dashboard Inbox</a></p>
        `,
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        draftId: draft.id,
        message: 'Draft submitted successfully'
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in submit-content function:', error);
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