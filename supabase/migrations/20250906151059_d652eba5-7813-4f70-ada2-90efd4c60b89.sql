-- Create analytics views and optimize existing tables for Phase A
-- Note: analytics_events table already exists, we'll add indexes and views

-- Add indexes for better query performance (without CONCURRENTLY since we're in a transaction)
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_created 
ON analytics_events(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type_created 
ON analytics_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_page_url 
ON analytics_events(page_url);

-- Create sessions view for aggregated session metrics
CREATE OR REPLACE VIEW analytics_sessions AS
WITH session_stats AS (
  SELECT 
    session_id,
    MIN(created_at) as session_start,
    MAX(created_at) as session_end,
    COUNT(*) as event_count,
    COUNT(DISTINCT page_url) as page_count,
    COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as pageviews,
    COUNT(CASE WHEN event_type IN ('error_404', 'error_5xx') THEN 1 END) as errors,
    (event_data->>'source')::text as traffic_source,
    (event_data->>'medium')::text as traffic_medium,
    (event_data->>'campaign')::text as traffic_campaign,
    (event_data->>'device')::text as device_type,
    (event_data->>'country')::text as country
  FROM analytics_events
  WHERE session_id IS NOT NULL
  GROUP BY session_id, 
           (event_data->>'source')::text,
           (event_data->>'medium')::text,
           (event_data->>'campaign')::text,
           (event_data->>'device')::text,
           (event_data->>'country')::text
)
SELECT 
  session_id,
  session_start,
  session_end,
  EXTRACT(EPOCH FROM (session_end - session_start)) as duration_seconds,
  event_count,
  page_count,
  pageviews,
  errors,
  CASE WHEN page_count <= 1 THEN true ELSE false END as is_bounce,
  COALESCE(traffic_source, 'direct') as source,
  COALESCE(traffic_medium, 'none') as medium,
  traffic_campaign as campaign,
  COALESCE(device_type, 'unknown') as device,
  COALESCE(country, 'unknown') as country,
  date_trunc('day', session_start) as session_date,
  date_trunc('hour', session_start) as session_hour
FROM session_stats;

-- Create daily metrics view for dashboard
CREATE OR REPLACE VIEW analytics_daily_metrics AS
WITH daily_stats AS (
  SELECT 
    date_trunc('day', created_at) as metric_date,
    COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as pageviews,
    COUNT(DISTINCT session_id) as sessions,
    COUNT(CASE WHEN event_type IN ('subscribe_submit', 'affiliate_click') THEN 1 END) as conversions,
    COUNT(CASE WHEN event_type IN ('error_404', 'error_5xx') THEN 1 END) as errors,
    COUNT(CASE WHEN event_type = 'search' THEN 1 END) as searches
  FROM analytics_events
  WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY date_trunc('day', created_at)
),
session_stats AS (
  SELECT 
    session_date as metric_date,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN is_bounce THEN 1 END) as bounced_sessions,
    AVG(duration_seconds) as avg_session_duration,
    AVG(pageviews) as avg_pageviews_per_session
  FROM analytics_sessions
  WHERE session_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY session_date
)
SELECT 
  COALESCE(d.metric_date, s.metric_date) as metric_date,
  COALESCE(d.pageviews, 0) as pageviews,
  COALESCE(d.sessions, 0) as sessions,
  COALESCE(d.conversions, 0) as conversions,
  COALESCE(d.errors, 0) as errors,
  COALESCE(d.searches, 0) as searches,
  COALESCE(s.bounced_sessions, 0) as bounced_sessions,
  CASE 
    WHEN s.total_sessions > 0 THEN s.bounced_sessions::float / s.total_sessions 
    ELSE 0 
  END as bounce_rate,
  COALESCE(s.avg_session_duration, 0) as avg_session_duration,
  COALESCE(s.avg_pageviews_per_session, 0) as avg_pageviews_per_session
FROM daily_stats d
FULL OUTER JOIN session_stats s ON d.metric_date = s.metric_date
ORDER BY metric_date DESC;

-- Create function for real-time health check
CREATE OR REPLACE FUNCTION get_analytics_health_status()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_events_count integer;
  error_rate float;
  health_status text;
  avg_response_time float;
BEGIN
  -- Count events in last hour
  SELECT COUNT(*) INTO recent_events_count
  FROM analytics_events 
  WHERE created_at >= NOW() - INTERVAL '1 hour';
  
  -- Calculate error rate in last 24 hours
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN 
        COUNT(CASE WHEN event_type IN ('error_404', 'error_5xx') THEN 1 END)::float / COUNT(*)
      ELSE 0 
    END INTO error_rate
  FROM analytics_events 
  WHERE created_at >= NOW() - INTERVAL '24 hours';
  
  -- Determine health status
  IF error_rate > 0.05 THEN
    health_status := 'critical';
  ELSIF error_rate > 0.01 THEN
    health_status := 'warning';
  ELSE
    health_status := 'healthy';
  END IF;
  
  -- Get average Core Web Vitals
  SELECT AVG((event_data->>'value')::float) INTO avg_response_time
  FROM analytics_events 
  WHERE event_type = 'cwv_metric' 
    AND event_data->>'metric' = 'lcp'
    AND created_at >= NOW() - INTERVAL '24 hours';
  
  RETURN jsonb_build_object(
    'status', health_status,
    'recent_events', recent_events_count,
    'error_rate', ROUND(error_rate * 100, 2),
    'avg_lcp', COALESCE(ROUND(avg_response_time, 0), 0),
    'timestamp', NOW()
  );
END;
$$;

-- Grant permissions for the analytics views
GRANT SELECT ON analytics_sessions TO authenticated;
GRANT SELECT ON analytics_daily_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION get_analytics_health_status() TO authenticated;