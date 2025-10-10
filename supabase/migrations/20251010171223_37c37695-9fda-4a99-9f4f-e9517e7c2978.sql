-- Fix Security Definer View errors for analytics views
-- Handle view dependencies correctly

-- Step 1: Drop analytics_daily_metrics first (depends on analytics_sessions)
DROP VIEW IF EXISTS public.analytics_daily_metrics CASCADE;

-- Step 2: Recreate analytics_sessions with security_invoker
DROP VIEW IF EXISTS public.analytics_sessions CASCADE;

CREATE VIEW public.analytics_sessions
WITH (security_invoker = true)
AS
WITH session_stats AS (
  SELECT 
    session_id,
    MIN(created_at) AS session_start,
    MAX(created_at) AS session_end,
    COUNT(*) AS event_count,
    COUNT(DISTINCT page_url) AS page_count,
    COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS pageviews,
    COUNT(CASE WHEN event_type IN ('error_404', 'error_5xx') THEN 1 END) AS errors,
    event_data->>'source' AS traffic_source,
    event_data->>'medium' AS traffic_medium,
    event_data->>'campaign' AS traffic_campaign,
    event_data->>'device' AS device_type,
    event_data->>'country' AS country
  FROM analytics_events
  WHERE session_id IS NOT NULL
  GROUP BY 
    session_id,
    event_data->>'source',
    event_data->>'medium',
    event_data->>'campaign',
    event_data->>'device',
    event_data->>'country'
)
SELECT 
  session_id,
  session_start,
  session_end,
  date_trunc('day', session_start) AS session_date,
  date_trunc('hour', session_start) AS session_hour,
  EXTRACT(EPOCH FROM (session_end - session_start)) AS duration_seconds,
  event_count,
  page_count,
  pageviews,
  errors,
  CASE WHEN page_count = 1 THEN true ELSE false END AS is_bounce,
  traffic_source AS source,
  traffic_medium AS medium,
  traffic_campaign AS campaign,
  device_type AS device,
  country
FROM session_stats;

-- Step 3: Recreate analytics_daily_metrics with security_invoker
CREATE VIEW public.analytics_daily_metrics
WITH (security_invoker = true)
AS
WITH daily_stats AS (
  SELECT 
    date_trunc('day', created_at) AS metric_date,
    COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS pageviews,
    COUNT(DISTINCT session_id) AS sessions,
    COUNT(CASE WHEN event_type IN ('subscribe_submit', 'affiliate_click') THEN 1 END) AS conversions,
    COUNT(CASE WHEN event_type IN ('error_404', 'error_5xx') THEN 1 END) AS errors,
    COUNT(CASE WHEN event_type = 'search' THEN 1 END) AS searches
  FROM analytics_events
  WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY date_trunc('day', created_at)
), session_stats AS (
  SELECT 
    session_date AS metric_date,
    COUNT(*) AS total_sessions,
    COUNT(CASE WHEN is_bounce THEN 1 END) AS bounced_sessions,
    AVG(duration_seconds) AS avg_session_duration,
    AVG(pageviews) AS avg_pageviews_per_session
  FROM analytics_sessions
  WHERE session_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY session_date
)
SELECT 
  COALESCE(d.metric_date, s.metric_date) AS metric_date,
  COALESCE(d.pageviews, 0) AS pageviews,
  COALESCE(d.sessions, 0) AS sessions,
  COALESCE(d.conversions, 0) AS conversions,
  COALESCE(d.errors, 0) AS errors,
  COALESCE(d.searches, 0) AS searches,
  COALESCE(s.bounced_sessions, 0) AS bounced_sessions,
  CASE 
    WHEN s.total_sessions > 0 THEN s.bounced_sessions::FLOAT / s.total_sessions::FLOAT
    ELSE 0
  END AS bounce_rate,
  COALESCE(s.avg_session_duration, 0) AS avg_session_duration,
  COALESCE(s.avg_pageviews_per_session, 0) AS avg_pageviews_per_session
FROM daily_stats d
FULL JOIN session_stats s ON d.metric_date = s.metric_date
ORDER BY COALESCE(d.metric_date, s.metric_date) DESC;

-- Add documentation comments
COMMENT ON VIEW public.analytics_sessions IS 
'Session analytics aggregated from events. Uses security_invoker to enforce caller permissions and RLS policies.';

COMMENT ON VIEW public.analytics_daily_metrics IS 
'Daily analytics metrics aggregated from events and sessions. Uses security_invoker to enforce caller permissions and RLS policies.';
