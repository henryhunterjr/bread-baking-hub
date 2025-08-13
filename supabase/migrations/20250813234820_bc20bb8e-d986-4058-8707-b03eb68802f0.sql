-- Fix Extension Versions - Update all extensions to latest versions
UPDATE pg_extension SET extversion = (
  SELECT max(version) 
  FROM pg_available_extension_versions 
  WHERE name = pg_extension.extname
) 
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_stat_statements');

-- Configure Auth Settings for Security
-- Set OTP expiry to recommended 10 minutes (600 seconds)
INSERT INTO auth.config (parameter, value) 
VALUES ('otp_expiry', '600') 
ON CONFLICT (parameter) 
DO UPDATE SET value = '600';

-- Enable password strength checking
INSERT INTO auth.config (parameter, value) 
VALUES ('password_min_length', '8') 
ON CONFLICT (parameter) 
DO UPDATE SET value = '8';

-- Enable leaked password protection
INSERT INTO auth.config (parameter, value) 
VALUES ('password_require_letters', 'true') 
ON CONFLICT (parameter) 
DO UPDATE SET value = 'true';

INSERT INTO auth.config (parameter, value) 
VALUES ('password_require_numbers', 'true') 
ON CONFLICT (parameter) 
DO UPDATE SET value = 'true';

-- Create security audit log table for monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view security logs
CREATE POLICY "Admins can view security audit logs"
ON public.security_audit_log FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user ID
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate limiting log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Rate limiting policies
CREATE POLICY "Service role can manage rate limits"
ON public.rate_limit_log FOR ALL
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON public.rate_limit_log(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limit_endpoint ON public.rate_limit_log(endpoint);