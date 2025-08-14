-- Create analytics events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversion events table
CREATE TABLE IF NOT EXISTS public.conversion_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  conversion_type TEXT NOT NULL, -- 'affiliate_click', 'download', 'newsletter_signup', 'recipe_save', 'purchase'
  conversion_value DECIMAL(10,2) DEFAULT 0,
  product_id TEXT,
  revenue DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal events table
CREATE TABLE IF NOT EXISTS public.goal_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  goal_type TEXT NOT NULL, -- 'engagement', 'conversion', 'retention'
  goal_name TEXT NOT NULL,
  goal_value DECIMAL(10,2) DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL,
  metric_type TEXT NOT NULL, -- 'lcp', 'fid', 'cls', 'ttfb', 'fcp'
  metric_value DECIMAL(10,4) NOT NULL,
  user_agent TEXT,
  connection_type TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create A/B test experiments table
CREATE TABLE IF NOT EXISTS public.ab_experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_name TEXT NOT NULL UNIQUE,
  description TEXT,
  variants JSONB NOT NULL, -- Array of variant configurations
  traffic_allocation DECIMAL(3,2) DEFAULT 1.0, -- Percentage of traffic to include
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create A/B test assignments table
CREATE TABLE IF NOT EXISTS public.ab_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  variant_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(experiment_id, user_id, session_id)
);

-- Create user feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  feedback_type TEXT NOT NULL, -- 'rating', 'comment', 'bug_report', 'feature_request'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  page_url TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'open', -- 'open', 'reviewed', 'resolved', 'dismissed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics events
CREATE POLICY "Users can create analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all analytics events" ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- Create policies for conversion events
CREATE POLICY "Users can create conversion events" ON public.conversion_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all conversion events" ON public.conversion_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- Create policies for goal events
CREATE POLICY "Users can create goal events" ON public.goal_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all goal events" ON public.goal_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- Create policies for performance metrics
CREATE POLICY "Users can create performance metrics" ON public.performance_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all performance metrics" ON public.performance_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- Create policies for A/B experiments
CREATE POLICY "Admins can manage experiments" ON public.ab_experiments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);
CREATE POLICY "Users can view active experiments" ON public.ab_experiments FOR SELECT USING (is_active = true);

-- Create policies for A/B assignments
CREATE POLICY "Users can create assignments" ON public.ab_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their assignments" ON public.ab_assignments FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- Create policies for user feedback
CREATE POLICY "Users can create feedback" ON public.user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their feedback" ON public.user_feedback FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);
CREATE POLICY "Admins can update feedback" ON public.user_feedback FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_conversion_events_created_at ON public.conversion_events(created_at);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON public.conversion_events(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_user_id ON public.conversion_events(user_id);

CREATE INDEX IF NOT EXISTS idx_goal_events_created_at ON public.goal_events(created_at);
CREATE INDEX IF NOT EXISTS idx_goal_events_goal_name ON public.goal_events(goal_name);
CREATE INDEX IF NOT EXISTS idx_goal_events_user_id ON public.goal_events(user_id);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON public.performance_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_url ON public.performance_metrics(page_url);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON public.performance_metrics(metric_type);

-- Create function to get Core Web Vitals summary
CREATE OR REPLACE FUNCTION get_core_web_vitals_summary(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT (now() - interval '7 days'),
  end_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TABLE (
  metric_type TEXT,
  avg_value DECIMAL,
  p75_value DECIMAL,
  p90_value DECIMAL,
  sample_count BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.metric_type,
    AVG(pm.metric_value) as avg_value,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY pm.metric_value) as p75_value,
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY pm.metric_value) as p90_value,
    COUNT(*) as sample_count
  FROM public.performance_metrics pm
  WHERE pm.created_at BETWEEN start_date AND end_date
  GROUP BY pm.metric_type
  ORDER BY pm.metric_type;
END;
$$;

-- Create function to assign A/B test variant
CREATE OR REPLACE FUNCTION assign_ab_variant(
  experiment_name TEXT,
  user_identifier UUID DEFAULT NULL,
  session_identifier TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  experiment_record ab_experiments%ROWTYPE;
  variants JSONB;
  variant_name TEXT;
  total_weight DECIMAL := 0;
  random_val DECIMAL;
  current_weight DECIMAL := 0;
  variant JSONB;
BEGIN
  -- Get active experiment
  SELECT * INTO experiment_record 
  FROM public.ab_experiments 
  WHERE experiment_name = assign_ab_variant.experiment_name 
    AND is_active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Check if already assigned
  SELECT variant_name INTO variant_name
  FROM public.ab_assignments
  WHERE experiment_id = experiment_record.id
    AND (user_id = user_identifier OR session_id = session_identifier)
  LIMIT 1;
  
  IF FOUND THEN
    RETURN variant_name;
  END IF;
  
  -- Calculate total weight
  FOR variant IN SELECT * FROM jsonb_array_elements(experiment_record.variants)
  LOOP
    total_weight := total_weight + (variant->>'weight')::DECIMAL;
  END LOOP;
  
  -- Generate random number
  random_val := random() * total_weight;
  
  -- Find variant based on weight
  FOR variant IN SELECT * FROM jsonb_array_elements(experiment_record.variants)
  LOOP
    current_weight := current_weight + (variant->>'weight')::DECIMAL;
    IF random_val <= current_weight THEN
      variant_name := variant->>'name';
      EXIT;
    END IF;
  END LOOP;
  
  -- Save assignment
  INSERT INTO public.ab_assignments (experiment_id, user_id, session_id, variant_name)
  VALUES (experiment_record.id, user_identifier, session_identifier, variant_name);
  
  RETURN variant_name;
END;
$$;