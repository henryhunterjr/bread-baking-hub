/**
 * Materialized Views Refresh
 * Refreshes all analytics materialized views on schedule
 */

import { NextRequest } from 'next/server'

export const runtime = 'edge'

interface RefreshResult {
  view: string
  status: 'success' | 'error'
  duration: number
  error?: string
}

const MATERIALIZED_VIEWS = [
  'app_analytics_mv_sessions_by_source_day',
  'app_analytics_mv_page_perf_day', 
  'app_analytics_mv_subscribers_day',
  'app_analytics_mv_errors_by_route_day',
  'app_analytics_mv_cwv_by_page_day'
]

async function refreshMaterializedView(viewName: string): Promise<RefreshResult> {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`https://ojyckskucneljvuqzrsw.supabase.co/rest/v1/rpc/app_analytics_refresh_materialized_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    
    const duration = Date.now() - startTime
    
    return {
      view: viewName,
      status: 'success',
      duration
    }
  } catch (error: any) {
    return {
      view: viewName,
      status: 'error',
      duration: Date.now() - startTime,
      error: error.message
    }
  }
}

export default async function handler(req: NextRequest) {
  // Verify cron secret
  const cronSecret = req.nextUrl.searchParams.get('secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }
  
  const startTime = Date.now()
  
  try {
    console.log('Starting materialized views refresh...')
    
    // Check if this is a "hot" refresh (hourly) or full refresh (nightly)
    const refreshType = req.nextUrl.searchParams.get('type') || 'full'
    
    let results: RefreshResult[]
    
    if (refreshType === 'hot') {
      // Hot refresh: only refresh smaller, frequently-used views
      const hotViews = [
        'app_analytics_mv_sessions_by_source_day',
        'app_analytics_mv_page_perf_day'
      ]
      
      console.log('Performing hot refresh of views:', hotViews)
      results = await Promise.all(
        hotViews.map(view => refreshMaterializedView(view))
      )
    } else {
      // Full refresh: all views
      console.log('Performing full refresh of all views:', MATERIALIZED_VIEWS)
      
      // Use the database function that refreshes all views at once
      const result = await refreshMaterializedView('all_views')
      results = [result]
    }
    
    const totalDuration = Date.now() - startTime
    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length
    
    const summary = {
      timestamp: new Date().toISOString(),
      refreshType,
      totalViews: refreshType === 'hot' ? 2 : MATERIALIZED_VIEWS.length,
      successCount,
      errorCount,
      totalDurationMs: totalDuration,
      results
    }
    
    if (errorCount > 0) {
      console.error('Some materialized views failed to refresh:', {
        errors: results.filter(r => r.status === 'error')
      })
    } else {
      console.log('All materialized views refreshed successfully:', {
        type: refreshType,
        duration: totalDuration,
        count: successCount
      })
    }
    
    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error('Materialized views refresh failed:', error)
    
    return new Response(JSON.stringify({
      error: 'Materialized views refresh failed',
      details: error.message,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startTime
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}