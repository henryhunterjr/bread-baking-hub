-- Analytics Export Functions for CSV Generation

-- Function 1: Get daily analytics metrics
CREATE OR REPLACE FUNCTION public.get_daily_analytics(
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  date DATE,
  page_views BIGINT,
  unique_visitors BIGINT,
  sessions BIGINT,
  avg_session_duration NUMERIC,
  bounce_rate NUMERIC
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(ts) as date,
    COUNT(*) FILTER (WHERE event = 'page_view') as page_views,
    COUNT(DISTINCT (meta->>'visitor_id')) FILTER (WHERE meta->>'visitor_id' IS NOT NULL) as unique_visitors,
    COUNT(DISTINCT session_id) as sessions,
    AVG((meta->>'duration')::NUMERIC) FILTER (WHERE event = 'session_end' AND meta->>'duration' IS NOT NULL) as avg_session_duration,
    ROUND(
      COALESCE(
        COUNT(*) FILTER (WHERE event = 'bounce')::NUMERIC / 
        NULLIF(COUNT(DISTINCT session_id), 0)::NUMERIC,
        0
      ) * 100,
      2
    ) as bounce_rate
  FROM public.app_analytics_events
  WHERE DATE(ts) BETWEEN start_date AND end_date
  GROUP BY DATE(ts)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Get traffic sources (aggregated over date range)
CREATE OR REPLACE FUNCTION public.get_traffic_sources(
  start_date DATE,
  end_date DATE
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'organic', COUNT(*) FILTER (WHERE meta->>'traffic_type' = 'organic'),
    'direct', COUNT(*) FILTER (WHERE meta->>'traffic_type' = 'direct'),
    'social', COUNT(*) FILTER (WHERE meta->>'traffic_type' = 'social'),
    'referral', COUNT(*) FILTER (WHERE meta->>'traffic_type' = 'referral')
  )
  FROM public.app_analytics_events
  WHERE DATE(ts) BETWEEN start_date AND end_date
  AND event = 'page_view';
$$ LANGUAGE sql;

-- Function 3: Get top pages by views
CREATE OR REPLACE FUNCTION public.get_top_pages(
  start_date DATE,
  end_date DATE,
  page_limit INT DEFAULT 20
)
RETURNS TABLE (
  path TEXT,
  views BIGINT,
  unique_visitors BIGINT,
  avg_time_on_page NUMERIC,
  bounce_rate NUMERIC
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.path as path,
    COUNT(*) as views,
    COUNT(DISTINCT e.meta->>'visitor_id') as unique_visitors,
    AVG((e.meta->>'time_on_page')::NUMERIC) FILTER (WHERE e.meta->>'time_on_page' IS NOT NULL) as avg_time_on_page,
    ROUND(
      COALESCE(
        COUNT(*) FILTER (WHERE e.meta->>'is_bounce' = 'true')::NUMERIC / 
        NULLIF(COUNT(*), 0)::NUMERIC,
        0
      ) * 100,
      2
    ) as bounce_rate
  FROM public.app_analytics_events e
  WHERE DATE(e.ts) BETWEEN start_date AND end_date
  AND e.event = 'page_view'
  AND e.path IS NOT NULL
  GROUP BY e.path
  ORDER BY views DESC
  LIMIT page_limit;
END;
$$ LANGUAGE plpgsql;

-- Function 4: Get comprehensive analytics export data
CREATE OR REPLACE FUNCTION public.get_analytics_export(
  start_date DATE,
  end_date DATE
)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daily_data JSON;
  traffic_data JSON;
  top_pages_data JSON;
  summary_data JSON;
BEGIN
  -- Get daily metrics
  SELECT json_agg(row_to_json(t))
  INTO daily_data
  FROM (
    SELECT * FROM public.get_daily_analytics(start_date, end_date)
  ) t;
  
  -- Get traffic sources
  SELECT public.get_traffic_sources(start_date, end_date)
  INTO traffic_data;
  
  -- Get top pages
  SELECT json_agg(row_to_json(t))
  INTO top_pages_data
  FROM (
    SELECT * FROM public.get_top_pages(start_date, end_date, 20)
  ) t;
  
  -- Get summary
  SELECT json_build_object(
    'total_pageviews', COUNT(*) FILTER (WHERE event = 'page_view'),
    'total_sessions', COUNT(DISTINCT session_id),
    'total_unique_visitors', COUNT(DISTINCT (meta->>'visitor_id')),
    'date_range', json_build_object(
      'start', start_date,
      'end', end_date
    )
  )
  INTO summary_data
  FROM public.app_analytics_events
  WHERE DATE(ts) BETWEEN start_date AND end_date;
  
  -- Combine all data
  RETURN json_build_object(
    'generated_at', now(),
    'summary', summary_data,
    'daily_metrics', COALESCE(daily_data, '[]'::json),
    'traffic_sources', COALESCE(traffic_data, '{}'::json),
    'top_pages', COALESCE(top_pages_data, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql;