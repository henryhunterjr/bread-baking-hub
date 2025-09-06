import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OverviewMetrics {
  users: number;
  sessions: number;
  pageviews: number;
  avgReadTime: number;
  signups: number;
  conversionRate: number;
  searches: number;
  errors404: number;
  lcpP95: number;
  netSubscribers: number;
  sessionsBySource: Array<{
    date: string;
    direct: number;
    organic: number;
    social: number;
    referral: number;
    email: number;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body for filters
    const body = await req.json()
    const {
      start_date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date = new Date().toISOString(),
      device,
      source,
      campaign
    } = body

    console.log('Analytics overview request:', { start_date, end_date, device, source, campaign })

    // Build base query with filters
    let baseQuery = supabaseClient
      .from('app_analytics_events')
      .select('*')
      .gte('ts', start_date)
      .lte('ts', end_date)

    if (device) baseQuery = baseQuery.eq('device', device)
    if (source) baseQuery = baseQuery.eq('source', source)
    if (campaign) baseQuery = baseQuery.eq('campaign', campaign)

    const { data: events, error: eventsError } = await baseQuery

    if (eventsError) {
      console.error('Events query error:', eventsError)
      throw new Error('Failed to fetch analytics events')
    }

    console.log(`Fetched ${events?.length || 0} events`)

    // Process metrics
    const pageViews = events?.filter(e => e.event === 'page_view') || []
    const sessions = new Set(events?.map(e => e.session_id) || []).size
    
    // Users ≈ sessions deduplicated per day
    const dailySessions = new Map<string, Set<string>>()
    events?.forEach(event => {
      const date = new Date(event.ts).toISOString().split('T')[0]
      if (!dailySessions.has(date)) {
        dailySessions.set(date, new Set())
      }
      dailySessions.get(date)?.add(event.session_id)
    })
    const users = Array.from(dailySessions.values())
      .reduce((sum, sessions) => sum + sessions.size, 0)

    // Calculate read time (session duration approximation)
    const sessionDurations = new Map<string, { start: Date; end: Date }>()
    pageViews.forEach(event => {
      const sessionId = event.session_id
      const eventTime = new Date(event.ts)
      
      if (!sessionDurations.has(sessionId)) {
        sessionDurations.set(sessionId, { start: eventTime, end: eventTime })
      } else {
        const session = sessionDurations.get(sessionId)!
        if (eventTime < session.start) session.start = eventTime
        if (eventTime > session.end) session.end = eventTime
      }
    })

    const totalReadTime = Array.from(sessionDurations.values())
      .reduce((sum, session) => sum + (session.end.getTime() - session.start.getTime()), 0)
    const avgReadTime = sessions > 0 ? totalReadTime / sessions / 1000 : 0

    // Other metrics
    const signups = events?.filter(e => e.event === 'subscribe_submit').length || 0
    const conversionRate = pageViews.length > 0 ? (signups / pageViews.length) * 100 : 0
    const searches = events?.filter(e => e.event === 'search').length || 0
    const errors404 = events?.filter(e => e.event === 'error_404').length || 0

    // LCP P95 calculation
    const lcpEvents = events?.filter(e => 
      e.event === 'cwv_metric' && e.meta?.metric === 'lcp'
    ) || []
    const lcpValues = lcpEvents.map(e => e.meta?.value || 0).sort((a, b) => a - b)
    const lcpP95 = lcpValues.length > 0 
      ? lcpValues[Math.floor(lcpValues.length * 0.95)] 
      : 0

    // Sessions by source over time
    const sourcesByDate = new Map<string, Map<string, number>>()
    pageViews.forEach(event => {
      const date = new Date(event.ts).toISOString().split('T')[0]
      const eventSource = event.source || 'direct'
      
      if (!sourcesByDate.has(date)) {
        sourcesByDate.set(date, new Map())
      }
      
      const dailySources = sourcesByDate.get(date)!
      dailySources.set(eventSource, (dailySources.get(eventSource) || 0) + 1)
    })

    const sessionsBySource = Array.from(sourcesByDate.entries())
      .map(([date, sources]) => ({
        date,
        direct: sources.get('direct') || 0,
        organic: (sources.get('google') || 0) + (sources.get('bing') || 0),
        social: (sources.get('facebook') || 0) + (sources.get('twitter') || 0) + (sources.get('instagram') || 0),
        referral: sources.get('referral') || 0,
        email: sources.get('email') || 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Net subscribers (from newsletter_subscribers table)
    const { data: subscribers } = await supabaseClient
      .from('newsletter_subscribers')
      .select('created_at, active')
      .gte('created_at', start_date)
      .lte('created_at', end_date)

    const netSubscribers = subscribers?.filter(s => s.active).length || 0

    const metrics: OverviewMetrics = {
      users,
      sessions,
      pageviews: pageViews.length,
      avgReadTime: Math.round(avgReadTime),
      signups,
      conversionRate: Math.round(conversionRate * 100) / 100,
      searches,
      errors404,
      lcpP95: Math.round(lcpP95),
      netSubscribers,
      sessionsBySource
    }

    console.log('Returning metrics:', metrics)

    return new Response(JSON.stringify(metrics), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
    })

  } catch (error) {
    console.error('Overview analytics error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
