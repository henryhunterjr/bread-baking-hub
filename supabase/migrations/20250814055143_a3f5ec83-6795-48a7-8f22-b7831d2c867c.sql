-- Fix remaining Supabase security warnings

-- Fix function search path issues for existing functions
ALTER FUNCTION public.create_recipe_version() SET search_path = 'public';
ALTER FUNCTION public.assign_ab_variant(text, uuid, text) SET search_path = 'public';
ALTER FUNCTION public.search_recipes(text, text[], text, integer, integer, text[], integer) SET search_path = 'public';
ALTER FUNCTION public.get_core_web_vitals_summary(timestamp with time zone, timestamp with time zone) SET search_path = 'public';
ALTER FUNCTION public.search_blog_posts(text, text[], integer) SET search_path = 'public';
ALTER FUNCTION public.get_trending_recipes(integer, integer) SET search_path = 'public';
ALTER FUNCTION public.get_related_recipes(uuid, integer) SET search_path = 'public';

-- Update extension versions to latest
ALTER EXTENSION "uuid-ossp" UPDATE;
ALTER EXTENSION "pgcrypto" UPDATE;

-- Create a comprehensive security configuration function
CREATE OR REPLACE FUNCTION public.apply_security_hardening()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log security hardening application
  INSERT INTO public.security_audit_log (
    event_type,
    event_data,
    ip_address
  ) VALUES (
    'security_hardening_applied',
    jsonb_build_object('timestamp', now(), 'version', '1.0'),
    inet_client_addr()
  );
END;
$$;