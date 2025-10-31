import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { months = 12 } = await req.json().catch(() => ({}))
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    console.log('Fetching analytics export:', { startDate: startDate.toISOString(), endDate: endDate.toISOString(), months })

    // Fetch all events in the time range
    const { data: events, error: eventsError } = await supabaseClient
      .from('app_analytics_events')
      .select('*')
      .gte('ts', startDate.toISOString())
      .lte('ts', endDate.toISOString())

    if (eventsError) {
      console.error('Events query error:', eventsError)
      throw new Error('Failed to fetch analytics events')
    }

    console.log(`Fetched ${events?.length || 0} events`)

    // 1. Monthly Unique Visitors
    const monthlyVisitors = new Map<string, Set<string>>()
    const monthlyPageViews = new Map<string, number>()
    const monthlySessions = new Map<string, Set<string>>()
    
    events?.forEach(event => {
      const month = new Date(event.ts).toISOString().slice(0, 7) // YYYY-MM
      
      if (!monthlyVisitors.has(month)) {
        monthlyVisitors.set(month, new Set())
        monthlyPageViews.set(month, 0)
        monthlySessions.set(month, new Set())
      }
      
      if (event.session_id) {
        monthlyVisitors.get(month)?.add(event.session_id)
        monthlySessions.get(month)?.add(event.session_id)
      }
      
      if (event.event === 'page_view') {
        monthlyPageViews.set(month, (monthlyPageViews.get(month) || 0) + 1)
      }
    })

    const monthlyData = Array.from(monthlyVisitors.entries())
      .map(([month, visitors]) => ({
        month,
        unique_visitors: visitors.size,
        sessions: monthlySessions.get(month)?.size || 0,
        pageviews: monthlyPageViews.get(month) || 0,
        pages_per_session: monthlySessions.get(month)?.size 
          ? (monthlyPageViews.get(month) || 0) / monthlySessions.get(month)!.size 
          : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // 2. Growth Trend
    const firstMonth = monthlyData[0]
    const lastMonth = monthlyData[monthlyData.length - 1]
    const growthTrend = firstMonth && lastMonth ? {
      start_month: firstMonth.month,
      start_visitors: firstMonth.unique_visitors,
      end_month: lastMonth.month,
      end_visitors: lastMonth.unique_visitors,
      growth_absolute: lastMonth.unique_visitors - firstMonth.unique_visitors,
      growth_percentage: firstMonth.unique_visitors > 0 
        ? ((lastMonth.unique_visitors - firstMonth.unique_visitors) / firstMonth.unique_visitors) * 100 
        : 0
    } : null

    // 3. Engagement Stats
    const pageViews = events?.filter(e => e.event === 'page_view') || []
    const sessionDurations = new Map<string, { start: Date; end: Date; pages: number }>()
    
    pageViews.forEach(event => {
      const sessionId = event.session_id
      const eventTime = new Date(event.ts)
      
      if (!sessionDurations.has(sessionId)) {
        sessionDurations.set(sessionId, { start: eventTime, end: eventTime, pages: 1 })
      } else {
        const session = sessionDurations.get(sessionId)!
        if (eventTime < session.start) session.start = eventTime
        if (eventTime > session.end) session.end = eventTime
        session.pages++
      }
    })

    const durations = Array.from(sessionDurations.values())
    const totalDuration = durations.reduce((sum, s) => sum + (s.end.getTime() - s.start.getTime()), 0)
    const totalPages = durations.reduce((sum, s) => sum + s.pages, 0)
    const avgTimeOnSite = durations.length > 0 ? totalDuration / durations.length / 1000 : 0
    const pagesPerSession = durations.length > 0 ? totalPages / durations.length : 0
    
    // Bounce rate (sessions with only 1 page view)
    const bouncedSessions = durations.filter(s => s.pages === 1).length
    const bounceRate = durations.length > 0 ? (bouncedSessions / durations.length) * 100 : 0

    // Returning visitors (approximate - sessions that appear multiple times)
    const sessionDates = new Map<string, Set<string>>()
    events?.forEach(event => {
      const date = new Date(event.ts).toISOString().split('T')[0]
      if (!sessionDates.has(event.session_id)) {
        sessionDates.set(event.session_id, new Set())
      }
      sessionDates.get(event.session_id)?.add(date)
    })
    const returningSessions = Array.from(sessionDates.values()).filter(dates => dates.size > 1).length
    const returningVisitorsPercent = durations.length > 0 ? (returningSessions / durations.length) * 100 : 0

    const engagementStats = {
      avg_time_on_site_seconds: Math.round(avgTimeOnSite),
      pages_per_session: Math.round(pagesPerSession * 100) / 100,
      bounce_rate: Math.round(bounceRate * 100) / 100,
      returning_visitors_percent: Math.round(returningVisitorsPercent * 100) / 100,
      total_sessions: durations.length
    }

    // 4. Top Performing Content (Last 90 Days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    const recentPageViews = pageViews.filter(e => new Date(e.ts) >= ninetyDaysAgo)
    const contentViews = new Map<string, { 
      views: number; 
      title: string; 
      path: string;
      sessions: Set<string>;
      avgDuration: number[];
    }>()

    recentPageViews.forEach(event => {
      const key = event.path || 'unknown'
      if (!contentViews.has(key)) {
        contentViews.set(key, { 
          views: 0, 
          title: event.title || 'Untitled',
          path: event.path || '',
          sessions: new Set(),
          avgDuration: []
        })
      }
      const content = contentViews.get(key)!
      content.views++
      if (event.session_id) {
        content.sessions.add(event.session_id)
      }
    })

    const topContent = Array.from(contentViews.entries())
      .map(([path, data]) => ({
        path,
        title: data.title,
        views: data.views,
        unique_sessions: data.sessions.size,
        engagement_rate: data.views > 0 ? (data.sessions.size / data.views) * 100 : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20)

    const result = {
      generated_at: new Date().toISOString(),
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        months
      },
      monthly_visitors: monthlyData,
      growth_trend: growthTrend,
      engagement_stats: engagementStats,
      top_performing_content: topContent,
      summary: {
        total_events: events?.length || 0,
        total_unique_sessions: new Set(events?.map(e => e.session_id)).size,
        total_pageviews: pageViews.length
      }
    }

    console.log('Returning analytics export')

    return new Response(JSON.stringify(result), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
    })

  } catch (error) {
    console.error('Analytics export error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})