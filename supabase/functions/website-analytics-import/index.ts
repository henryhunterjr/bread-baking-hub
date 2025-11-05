/**
 * Website Analytics Import Function
 * Fetches analytics data from bakinggreatbread.com and imports it to CCC database
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const websiteAnalyticsKey = Deno.env.get('WEBSITE_ANALYTICS_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from request
    const authHeader = req.headers.get('Authorization')
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') || ''
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if user is admin
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (!roles) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { start_date, end_date } = await req.json()

    if (!start_date || !end_date) {
      return new Response(JSON.stringify({ error: 'start_date and end_date required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Starting analytics import from ${start_date} to ${end_date}`)

    // Create import record
    const { data: importRecord, error: importError } = await supabase
      .from('website_analytics_imports')
      .insert({
        import_type: 'manual',
        start_date,
        end_date,
        status: 'pending',
        imported_by: user.id
      })
      .select()
      .single()

    if (importError) {
      console.error('Error creating import record:', importError)
      throw new Error('Failed to create import record')
    }

    try {
      // Fetch data from bakinggreatbread.com
      const exportUrl = `https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/analytics-csv-export?start_date=${start_date}&end_date=${end_date}&format=json`
      
      console.log('Fetching from:', exportUrl)
      
      const response = await fetch(exportUrl, {
        headers: {
          'x-api-key': websiteAnalyticsKey
        }
      })

      if (!response.ok) {
        throw new Error(`Export API returned ${response.status}: ${await response.text()}`)
      }

      const analyticsData = await response.json()
      console.log('Received analytics data:', JSON.stringify(analyticsData).substring(0, 200))

      let recordsImported = 0

      // Import daily metrics
      if (analyticsData.daily_metrics && Array.isArray(analyticsData.daily_metrics)) {
        for (const day of analyticsData.daily_metrics) {
          const { error } = await supabase
            .from('website_analytics_daily')
            .upsert({
              metric_date: day.date,
              page_views: day.page_views || 0,
              unique_visitors: day.unique_visitors || 0,
              sessions: day.sessions || 0,
              avg_session_duration: day.avg_session_duration,
              bounce_rate: day.bounce_rate
            }, {
              onConflict: 'metric_date'
            })

          if (!error) recordsImported++
        }
      }

      // Import traffic sources (aggregate across date range)
      if (analyticsData.traffic_sources) {
        const { error } = await supabase
          .from('website_analytics_sources')
          .upsert({
            metric_date: end_date, // Use end date for aggregate data
            organic: analyticsData.traffic_sources.organic || 0,
            direct: analyticsData.traffic_sources.direct || 0,
            social: analyticsData.traffic_sources.social || 0,
            referral: analyticsData.traffic_sources.referral || 0
          }, {
            onConflict: 'metric_date'
          })

        if (!error) recordsImported++
      }

      // Import top pages
      if (analyticsData.top_pages && Array.isArray(analyticsData.top_pages)) {
        for (const page of analyticsData.top_pages) {
          const { error } = await supabase
            .from('website_analytics_pages')
            .upsert({
              metric_date: end_date, // Use end date for aggregate data
              path: page.path,
              views: page.views || 0,
              unique_visitors: page.unique_visitors || 0,
              avg_time_on_page: page.avg_time_on_page,
              bounce_rate: page.bounce_rate
            }, {
              onConflict: 'metric_date,path'
            })

          if (!error) recordsImported++
        }
      }

      // Update import record as successful
      await supabase
        .from('website_analytics_imports')
        .update({
          status: 'success',
          records_imported: recordsImported,
          completed_at: new Date().toISOString()
        })
        .eq('id', importRecord.id)

      console.log(`Import completed successfully. Records imported: ${recordsImported}`)

      return new Response(JSON.stringify({
        success: true,
        import_id: importRecord.id,
        records_imported: recordsImported,
        summary: analyticsData.summary
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } catch (error) {
      // Update import record as failed
      await supabase
        .from('website_analytics_imports')
        .update({
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', importRecord.id)

      throw error
    }

  } catch (error) {
    console.error('Import error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check edge function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
