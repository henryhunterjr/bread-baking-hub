/**
 * Analytics Track - Event Ingestion Endpoint
 * Receives analytics events from firstPartyAnalytics and stores them in Supabase
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-analytics-key, x-analytics-ts',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { events } = await req.json()

    if (!events || !Array.isArray(events) || events.length === 0) {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    console.log(`Received ${events.length} analytics events`)

    // Transform events to match database schema
    const dbEvents = events.map((event: any) => ({
      event_id: event.event_id,
      ts: new Date(event.ts).toISOString(),
      event: event.event_type || 'page_view', // Map event_type to event column
      session_id: event.session_id,
      user_id: event.user_id || null,
      path: event.path,
      title: event.title,
      slug: event.slug || null,
      content_type: event.content_type || null,
      source: event.source || null,
      medium: event.medium || null,
      campaign: event.campaign || null,
      device: event.device || 'desktop',
      country: event.country || null,
      referrer: event.referrer || null,
      value_cents: event.value_cents || null,
      sample_rate: 100, // Default to 100% sampling
      meta: event.meta || null
    }))

    // Insert events into database
    const { error } = await supabase
      .from('app_analytics_events')
      .insert(dbEvents)

    if (error) {
      console.error('Database insert error:', error)
      // Still return 204 to avoid retry loops
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    console.log(`Successfully inserted ${dbEvents.length} events`)

    // Always return 204 No Content (privacy-first, no response body)
    return new Response(null, { status: 204, headers: corsHeaders })
  } catch (error) {
    console.error('Analytics track error:', error)
    // Return 204 even on error to prevent client retry loops
    return new Response(null, { status: 204, headers: corsHeaders })
  }
})
