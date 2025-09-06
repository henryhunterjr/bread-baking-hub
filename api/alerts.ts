/**
 * Alerting System
 * Compares 24h deltas vs 7-day baseline and triggers alerts
 */

import { NextRequest } from 'next/server'

export const runtime = 'edge'

interface AlertThreshold {
  metric: string
  current: number
  baseline: number
  threshold: number
  change: number
  changePercent: number
  status: 'ok' | 'warning' | 'critical'
  description: string
}

interface AlertSummary {
  timestamp: string
  overallStatus: 'healthy' | 'warning' | 'critical'
  alerts: AlertThreshold[]
  summary: string
}

async function getMetricData(metric: string, hours: number = 24) {
  const supabaseUrl = `https://ojyckskucneljvuqzrsw.supabase.co/rest/v1/rpc/get_analytics_health_status`
  
  try {
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch analytics: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.warn(`Failed to fetch ${metric}:`, error)
    return null
  }
}

async function getTrafficMetrics() {
  const supabaseUrl = `https://ojyckskucneljvuqzrsw.supabase.co/rest/v1/app_analytics_events`
  
  try {
    // Get 24h data
    const current24h = await fetch(`${supabaseUrl}?select=count()&created_at=gte.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}&event_type=eq.page_view`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    })
    
    // Get 7-day baseline (average per day)
    const baseline7d = await fetch(`${supabaseUrl}?select=count()&created_at=gte.${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}&created_at=lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}&event_type=eq.page_view`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    })
    
    if (!current24h.ok || !baseline7d.ok) {
      throw new Error('Failed to fetch traffic data')
    }
    
    const currentData = await current24h.json()
    const baselineData = await baseline7d.json()
    
    const current = currentData[0]?.count || 0
    const baseline = Math.round((baselineData[0]?.count || 0) / 6) // Average per day over 6 days
    
    return { current, baseline }
  } catch (error) {
    console.warn('Failed to fetch traffic metrics:', error)
    return { current: 0, baseline: 0 }
  }
}

async function getErrorMetrics() {
  const supabaseUrl = `https://ojyckskucneljvuqzrsw.supabase.co/rest/v1/app_analytics_events`
  
  try {
    // Get 24h error data
    const current24h = await fetch(`${supabaseUrl}?select=count()&created_at=gte.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}&event_type=in.(error_404,error_5xx)`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    })
    
    // Get 7-day baseline
    const baseline7d = await fetch(`${supabaseUrl}?select=count()&created_at=gte.${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}&created_at=lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}&event_type=in.(error_404,error_5xx)`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    })
    
    if (!current24h.ok || !baseline7d.ok) {
      throw new Error('Failed to fetch error data')
    }
    
    const currentData = await current24h.json()
    const baselineData = await baseline7d.json()
    
    const current = currentData[0]?.count || 0
    const baseline = Math.round((baselineData[0]?.count || 0) / 6) // Average per day
    
    return { current, baseline }
  } catch (error) {
    console.warn('Failed to fetch error metrics:', error)
    return { current: 0, baseline: 0 }
  }
}

async function getLCPMetrics() {
  const supabaseUrl = `https://ojyckskucneljvuqzrsw.supabase.co/rest/v1/app_analytics_events`
  
  try {
    // Get 24h LCP data for mobile
    const current24h = await fetch(`${supabaseUrl}?select=event_data&created_at=gte.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}&event_type=eq.cwv_metric&event_data->>metric=eq.lcp&device=eq.mobile`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    })
    
    if (!current24h.ok) {
      throw new Error('Failed to fetch LCP data')
    }
    
    const currentData = await current24h.json()
    const lcpValues = currentData
      .map((row: any) => parseFloat(row.event_data?.value))
      .filter((val: number) => !isNaN(val))
      .sort((a: number, b: number) => a - b)
    
    if (lcpValues.length === 0) {
      return { current: 0, baseline: 0 }
    }
    
    // Calculate P95
    const p95Index = Math.floor(lcpValues.length * 0.95)
    const currentP95 = lcpValues[p95Index] || 0
    
    return { current: currentP95, baseline: 2500 } // 2.5s baseline for good LCP
  } catch (error) {
    console.warn('Failed to fetch LCP metrics:', error)
    return { current: 0, baseline: 2500 }
  }
}

async function getOGCoverage() {
  try {
    // Check recent OG health scan results
    const response = await fetch(`/api/cron/og-health?secret=${process.env.CRON_SECRET}`)
    if (!response.ok) {
      throw new Error('Failed to get OG health data')
    }
    
    const ogData = await response.json()
    return {
      current: ogData.coveragePercent || 0,
      baseline: 95 // 95% coverage baseline
    }
  } catch (error) {
    console.warn('Failed to fetch OG coverage:', error)
    return { current: 0, baseline: 95 }
  }
}

function evaluateThreshold(
  metric: string,
  current: number,
  baseline: number,
  thresholdConfig: { warning: number; critical: number; direction: 'above' | 'below' },
  description: string
): AlertThreshold {
  const change = current - baseline
  const changePercent = baseline > 0 ? (change / baseline) * 100 : 0
  
  let status: 'ok' | 'warning' | 'critical' = 'ok'
  
  if (thresholdConfig.direction === 'above') {
    // Alert when value is above threshold (errors, LCP)
    if (current >= thresholdConfig.critical || changePercent >= thresholdConfig.critical) {
      status = 'critical'
    } else if (current >= thresholdConfig.warning || changePercent >= thresholdConfig.warning) {
      status = 'warning'
    }
  } else {
    // Alert when value is below threshold (traffic, coverage)
    if (current <= thresholdConfig.critical || changePercent <= -thresholdConfig.critical) {
      status = 'critical'
    } else if (current <= thresholdConfig.warning || changePercent <= -thresholdConfig.warning) {
      status = 'warning'
    }
  }
  
  return {
    metric,
    current,
    baseline,
    threshold: thresholdConfig.warning,
    change,
    changePercent,
    status,
    description
  }
}

async function sendAlertEmail(alertSummary: AlertSummary) {
  if (!process.env.ALERT_EMAIL) {
    console.log('No ALERT_EMAIL configured, skipping email notification')
    return
  }
  
  try {
    // Use Supabase Edge Function for email sending
    const response = await fetch(`https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/send-alert-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        to: process.env.ALERT_EMAIL,
        alertSummary
      })
    })
    
    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.status}`)
    }
    
    console.log('Alert email sent successfully')
  } catch (error) {
    console.error('Failed to send alert email:', error)
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
  
  try {
    console.log('Running alerting system...')
    
    // Collect metrics
    const [trafficData, errorData, lcpData, ogData] = await Promise.all([
      getTrafficMetrics(),
      getErrorMetrics(),
      getLCPMetrics(),
      getOGCoverage()
    ])
    
    // Evaluate thresholds
    const alerts: AlertThreshold[] = [
      evaluateThreshold(
        'traffic',
        trafficData.current,
        trafficData.baseline,
        { warning: 20, critical: 30, direction: 'below' },
        'Page view traffic compared to 7-day average'
      ),
      evaluateThreshold(
        'errors',
        errorData.current,
        errorData.baseline || 1, // Avoid division by zero
        { warning: 200, critical: 300, direction: 'above' },
        '404/5xx errors compared to 7-day average'
      ),
      evaluateThreshold(
        'lcp_mobile',
        lcpData.current,
        lcpData.baseline,
        { warning: 4000, critical: 6000, direction: 'above' },
        'Largest Contentful Paint P95 for mobile devices (ms)'
      ),
      evaluateThreshold(
        'og_coverage',
        ogData.current,
        ogData.baseline,
        { warning: 90, critical: 85, direction: 'below' },
        'Open Graph image coverage percentage'
      )
    ]
    
    // Determine overall status
    const hasCritical = alerts.some(alert => alert.status === 'critical')
    const hasWarning = alerts.some(alert => alert.status === 'warning')
    const overallStatus = hasCritical ? 'critical' : hasWarning ? 'warning' : 'healthy'
    
    // Generate summary
    const criticalAlerts = alerts.filter(alert => alert.status === 'critical')
    const warningAlerts = alerts.filter(alert => alert.status === 'warning')
    
    let summary = `System is ${overallStatus.toUpperCase()}`
    if (criticalAlerts.length > 0) {
      summary += ` - ${criticalAlerts.length} critical issue(s): ${criticalAlerts.map(a => a.metric).join(', ')}`
    }
    if (warningAlerts.length > 0) {
      summary += ` - ${warningAlerts.length} warning(s): ${warningAlerts.map(a => a.metric).join(', ')}`
    }
    
    const alertSummary: AlertSummary = {
      timestamp: new Date().toISOString(),
      overallStatus,
      alerts,
      summary
    }
    
    // Send email if there are alerts and email is configured
    if ((hasCritical || hasWarning) && process.env.ALERT_EMAIL) {
      await sendAlertEmail(alertSummary)
    }
    
    console.log('Alert check completed:', {
      status: overallStatus,
      criticalCount: criticalAlerts.length,
      warningCount: warningAlerts.length
    })
    
    return new Response(JSON.stringify(alertSummary), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error('Alert system failed:', error)
    
    return new Response(JSON.stringify({
      error: 'Alert system failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}