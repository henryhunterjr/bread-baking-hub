/**
 * Analytics CSV Export Endpoint
 * Provides CSV download for AI dashboard integration
 * Requires API key authentication
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // API Key authentication
    const apiKey = req.headers.get('x-api-key')
    const expectedKey = Deno.env.get('ANALYTICS_EXPORT_KEY')
    
    if (!apiKey || apiKey !== expectedKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const url = new URL(req.url)
    const startDate = url.searchParams.get('start_date') || getDateDaysAgo(7)
    const endDate = url.searchParams.get('end_date') || getToday()
    const format = url.searchParams.get('format') || 'csv' // csv or json

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`Generating ${format} export from ${startDate} to ${endDate}`)

    // Get comprehensive analytics data
    const { data: exportData, error } = await supabase
      .rpc('get_analytics_export', {
        start_date: startDate,
        end_date: endDate
      })

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch analytics data')
    }

    if (format === 'json') {
      // Return JSON format
      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="analytics-${startDate}-to-${endDate}.json"`
        }
      })
    }

    // Generate CSV format
    const csv = generateCSV(exportData)

    return new Response(csv, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-${startDate}-to-${endDate}.csv"`
      }
    })

  } catch (error) {
    console.error('Export error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateCSV(data: any): string {
  const dailyMetrics = data.daily_metrics || []
  const trafficSources = data.traffic_sources || {}
  const topPages = data.top_pages || []
  
  // CSV Header
  let csv = 'Section,Metric,Value\n'
  
  // Summary section
  csv += `Summary,Total Pageviews,${data.summary?.total_pageviews || 0}\n`
  csv += `Summary,Total Sessions,${data.summary?.total_sessions || 0}\n`
  csv += `Summary,Total Unique Visitors,${data.summary?.total_unique_visitors || 0}\n`
  csv += `Summary,Date Range Start,${data.summary?.date_range?.start || ''}\n`
  csv += `Summary,Date Range End,${data.summary?.date_range?.end || ''}\n`
  csv += '\n'
  
  // Traffic Sources
  csv += `Traffic,Organic,${trafficSources.organic || 0}\n`
  csv += `Traffic,Direct,${trafficSources.direct || 0}\n`
  csv += `Traffic,Social,${trafficSources.social || 0}\n`
  csv += `Traffic,Referral,${trafficSources.referral || 0}\n`
  csv += '\n'
  
  // Daily Metrics Header
  csv += 'Date,Page Views,Unique Visitors,Sessions,Avg Session Duration (sec),Bounce Rate (%)\n'
  
  // Daily Metrics Data
  dailyMetrics.forEach((day: any) => {
    csv += `${day.date},${day.page_views || 0},${day.unique_visitors || 0},${day.sessions || 0},`
    csv += `${day.avg_session_duration || 0},${day.bounce_rate || 0}\n`
  })
  
  csv += '\n'
  
  // Top Pages Header
  csv += 'Rank,Page Path,Views,Unique Visitors,Avg Time on Page (sec),Bounce Rate (%)\n'
  
  // Top Pages Data
  topPages.forEach((page: any, index: number) => {
    csv += `${index + 1},${escapeCSV(page.path)},${page.views || 0},${page.unique_visitors || 0},`
    csv += `${page.avg_time_on_page || 0},${page.bounce_rate || 0}\n`
  })
  
  return csv
}

function escapeCSV(value: string): string {
  if (!value) return ''
  // Escape quotes and wrap in quotes if contains comma or quote
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function getDateDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}
