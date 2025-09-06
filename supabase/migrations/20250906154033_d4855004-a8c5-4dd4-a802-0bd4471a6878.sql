-- Phase B: Fixed Data Model with namespaced tables and materialized views

-- Create the new analytics events table with proper schema
CREATE TABLE public.app_analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ts timestamptz NOT NULL DEFAULT now(),
    event text NOT NULL,
    event_id text NOT NULL,
    session_id text,
    user_id uuid,
    path text,
    title text,
    slug text,
    content_type text,
    source text,
    medium text,
    campaign text,
    device text,
    country text,
    referrer text,
    value_cents int,
    sample_rate int DEFAULT 1,
    meta jsonb DEFAULT '{}'::jsonb
);

-- Migrate existing data from analytics_events to new table
INSERT INTO public.app_analytics_events (
    ts, event, event_id, session_id, user_id, path, title, 
    device, country, referrer, value_cents, meta
)
SELECT 
    created_at as ts,
    event_type as event,
    COALESCE((event_data->>'event_id')::text, gen_random_uuid()::text) as event_id,
    session_id,
    user_id,
    page_url as path,
    (event_data->>'title')::text as title,
    CASE 
        WHEN user_agent ILIKE '%mobile%' THEN 'mobile'
        ELSE 'desktop'
    END as device,
    (event_data->>'country')::text as country,
    referrer,
    (event_data->>'value_cents')::int as value_cents,
    event_data as meta
FROM public.analytics_events;

-- Create indexes for performance
CREATE INDEX idx_app_analytics_events_ts ON public.app_analytics_events (ts);
CREATE INDEX idx_app_analytics_events_event ON public.app_analytics_events (event);
CREATE INDEX idx_app_analytics_events_path ON public.app_analytics_events (path);
CREATE INDEX idx_app_analytics_events_slug ON public.app_analytics_events (slug);
CREATE INDEX idx_app_analytics_events_session_id ON public.app_analytics_events (session_id);

-- Create unique index for recent event IDs (without time-based predicate)
CREATE UNIQUE INDEX idx_app_analytics_events_event_id_unique 
    ON public.app_analytics_events (event_id, ts);

-- Enable RLS
ALTER TABLE public.app_analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Service role can insert analytics events" 
    ON public.app_analytics_events 
    FOR INSERT 
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all analytics events" 
    ON public.app_analytics_events 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));

-- Materialized View: Sessions by Source per Day
CREATE MATERIALIZED VIEW public.app_analytics_mv_sessions_by_source_day AS
SELECT 
    date_trunc('day', ts) as metric_date,
    COALESCE(source, 'direct') as source,
    COALESCE(medium, 'none') as medium,
    COUNT(DISTINCT session_id) as sessions,
    COUNT(*) as events
FROM public.app_analytics_events
WHERE event = 'page_view'
GROUP BY date_trunc('day', ts), source, medium;

CREATE UNIQUE INDEX idx_app_analytics_mv_sessions_by_source_day_unique 
    ON public.app_analytics_mv_sessions_by_source_day (metric_date, source, medium);

-- Materialized View: Page Performance per Day
CREATE MATERIALIZED VIEW public.app_analytics_mv_page_perf_day AS
SELECT 
    date_trunc('day', ts) as metric_date,
    path,
    COUNT(*) as pageviews,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(CASE 
        WHEN event = 'cwv_metric' AND (meta->>'metric') = 'lcp' 
        THEN (meta->>'value')::numeric 
    END) as avg_lcp,
    AVG(CASE 
        WHEN event = 'cwv_metric' AND (meta->>'metric') = 'cls' 
        THEN (meta->>'value')::numeric 
    END) as avg_cls,
    AVG(CASE 
        WHEN event = 'cwv_metric' AND (meta->>'metric') = 'inp' 
        THEN (meta->>'value')::numeric 
    END) as avg_inp
FROM public.app_analytics_events
WHERE event IN ('page_view', 'cwv_metric')
GROUP BY date_trunc('day', ts), path;

CREATE UNIQUE INDEX idx_app_analytics_mv_page_perf_day_unique 
    ON public.app_analytics_mv_page_perf_day (metric_date, path);

-- Materialized View: Subscribers per Day
CREATE MATERIALIZED VIEW public.app_analytics_mv_subscribers_day AS
SELECT 
    date_trunc('day', ae.ts) as metric_date,
    COUNT(CASE WHEN ae.event = 'subscribe_view' THEN 1 END) as subscribe_views,
    COUNT(CASE WHEN ae.event = 'subscribe_submit' THEN 1 END) as subscribe_attempts,
    COALESCE(ns.daily_subscribers, 0) as actual_subscribers
FROM public.app_analytics_events ae
LEFT JOIN (
    SELECT 
        date_trunc('day', created_at) as metric_date,
        COUNT(*) as daily_subscribers
    FROM public.newsletter_subscribers
    WHERE active = true
    GROUP BY date_trunc('day', created_at)
) ns ON date_trunc('day', ae.ts) = ns.metric_date
WHERE ae.event IN ('subscribe_view', 'subscribe_submit')
GROUP BY date_trunc('day', ae.ts), ns.daily_subscribers;

CREATE UNIQUE INDEX idx_app_analytics_mv_subscribers_day_unique 
    ON public.app_analytics_mv_subscribers_day (metric_date);

-- Materialized View: Errors by Route per Day
CREATE MATERIALIZED VIEW public.app_analytics_mv_errors_by_route_day AS
SELECT 
    date_trunc('day', ts) as metric_date,
    path,
    event as error_type,
    COUNT(*) as error_count,
    COUNT(DISTINCT session_id) as affected_sessions
FROM public.app_analytics_events
WHERE event IN ('error_404', 'error_5xx', 'og_missing')
GROUP BY date_trunc('day', ts), path, event;

CREATE UNIQUE INDEX idx_app_analytics_mv_errors_by_route_day_unique 
    ON public.app_analytics_mv_errors_by_route_day (metric_date, path, error_type);

-- Materialized View: Core Web Vitals by Page per Day
CREATE MATERIALIZED VIEW public.app_analytics_mv_cwv_by_page_day AS
SELECT 
    date_trunc('day', ts) as metric_date,
    path,
    (meta->>'metric') as metric_name,
    AVG((meta->>'value')::numeric) as avg_value,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY (meta->>'value')::numeric) as p75_value,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY (meta->>'value')::numeric) as p90_value,
    COUNT(*) as sample_count
FROM public.app_analytics_events
WHERE event = 'cwv_metric' 
    AND (meta->>'metric') IN ('lcp', 'cls', 'inp')
    AND (meta->>'value') IS NOT NULL
GROUP BY date_trunc('day', ts), path, (meta->>'metric');

CREATE UNIQUE INDEX idx_app_analytics_mv_cwv_by_page_day_unique 
    ON public.app_analytics_mv_cwv_by_page_day (metric_date, path, metric_name);

-- GDPR Helper Functions
CREATE OR REPLACE FUNCTION public.app_analytics_gdpr_delete_by_session(p_session_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count int;
BEGIN
    -- Only allow admins to delete analytics data
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required for GDPR deletion';
    END IF;
    
    DELETE FROM public.app_analytics_events 
    WHERE session_id = p_session_id;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the deletion for audit
    INSERT INTO public.security_audit_log (
        user_id,
        event_type,
        event_data,
        ip_address
    ) VALUES (
        auth.uid(),
        'gdpr_analytics_deletion',
        jsonb_build_object(
            'session_id', p_session_id,
            'deleted_events', deleted_count
        ),
        inet_client_addr()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'deleted_events', deleted_count,
        'session_id', p_session_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.app_analytics_gdpr_delete_by_user(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count int;
BEGIN
    -- Only allow admins to delete analytics data
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Unauthorized: Admin role required for GDPR deletion';
    END IF;
    
    DELETE FROM public.app_analytics_events 
    WHERE user_id = p_user_id;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the deletion for audit
    INSERT INTO public.security_audit_log (
        user_id,
        event_type,
        event_data,
        ip_address
    ) VALUES (
        auth.uid(),
        'gdpr_analytics_deletion',
        jsonb_build_object(
            'target_user_id', p_user_id,
            'deleted_events', deleted_count
        ),
        inet_client_addr()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'deleted_events', deleted_count,
        'user_id', p_user_id
    );
END;
$$;

-- Data Retention Function
CREATE OR REPLACE FUNCTION public.app_analytics_cleanup_old_events()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count int;
    retention_date timestamptz;
BEGIN
    -- Calculate retention date (180 days ago)
    retention_date := now() - interval '180 days';
    
    -- Delete old events
    DELETE FROM public.app_analytics_events 
    WHERE ts < retention_date;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the cleanup
    INSERT INTO public.security_audit_log (
        event_type,
        event_data,
        ip_address
    ) VALUES (
        'analytics_data_retention_cleanup',
        jsonb_build_object(
            'deleted_events', deleted_count,
            'retention_date', retention_date
        ),
        inet_client_addr()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'deleted_events', deleted_count,
        'retention_date', retention_date
    );
END;
$$;

-- Function to refresh all materialized views (without CONCURRENTLY)
CREATE OR REPLACE FUNCTION public.app_analytics_refresh_materialized_views()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW public.app_analytics_mv_sessions_by_source_day;
    REFRESH MATERIALIZED VIEW public.app_analytics_mv_page_perf_day;
    REFRESH MATERIALIZED VIEW public.app_analytics_mv_subscribers_day;
    REFRESH MATERIALIZED VIEW public.app_analytics_mv_errors_by_route_day;
    REFRESH MATERIALIZED VIEW public.app_analytics_mv_cwv_by_page_day;
    
    RETURN jsonb_build_object(
        'success', true,
        'refreshed_at', now(),
        'views_refreshed', 5
    );
END;
$$;