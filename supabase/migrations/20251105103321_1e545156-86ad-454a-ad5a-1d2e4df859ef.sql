-- Create tables for storing website analytics data imported from bakinggreatbread.com

-- Table for daily analytics metrics
CREATE TABLE IF NOT EXISTS public.website_analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  page_views BIGINT NOT NULL DEFAULT 0,
  unique_visitors BIGINT NOT NULL DEFAULT 0,
  sessions BIGINT NOT NULL DEFAULT 0,
  avg_session_duration NUMERIC(10, 2),
  bounce_rate NUMERIC(5, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(metric_date)
);

-- Table for traffic sources
CREATE TABLE IF NOT EXISTS public.website_analytics_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  organic BIGINT NOT NULL DEFAULT 0,
  direct BIGINT NOT NULL DEFAULT 0,
  social BIGINT NOT NULL DEFAULT 0,
  referral BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(metric_date)
);

-- Table for top pages
CREATE TABLE IF NOT EXISTS public.website_analytics_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  path TEXT NOT NULL,
  views BIGINT NOT NULL DEFAULT 0,
  unique_visitors BIGINT NOT NULL DEFAULT 0,
  avg_time_on_page NUMERIC(10, 2),
  bounce_rate NUMERIC(5, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(metric_date, path)
);

-- Table for tracking import history
CREATE TABLE IF NOT EXISTS public.website_analytics_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_type TEXT NOT NULL DEFAULT 'manual', -- 'manual' or 'automatic'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed'
  records_imported INTEGER DEFAULT 0,
  error_message TEXT,
  imported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.website_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics_imports ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can view analytics
CREATE POLICY "Admins can view daily analytics"
  ON public.website_analytics_daily FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view traffic sources"
  ON public.website_analytics_sources FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view top pages"
  ON public.website_analytics_pages FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view import history"
  ON public.website_analytics_imports FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert/update
CREATE POLICY "Service role can manage daily analytics"
  ON public.website_analytics_daily FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage traffic sources"
  ON public.website_analytics_sources FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage top pages"
  ON public.website_analytics_pages FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage import history"
  ON public.website_analytics_imports FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_website_analytics_daily_date 
  ON public.website_analytics_daily(metric_date DESC);

CREATE INDEX IF NOT EXISTS idx_website_analytics_sources_date 
  ON public.website_analytics_sources(metric_date DESC);

CREATE INDEX IF NOT EXISTS idx_website_analytics_pages_date_views 
  ON public.website_analytics_pages(metric_date DESC, views DESC);

CREATE INDEX IF NOT EXISTS idx_website_analytics_imports_created 
  ON public.website_analytics_imports(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_website_analytics_daily_updated_at
  BEFORE UPDATE ON public.website_analytics_daily
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_analytics_sources_updated_at
  BEFORE UPDATE ON public.website_analytics_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_analytics_pages_updated_at
  BEFORE UPDATE ON public.website_analytics_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();