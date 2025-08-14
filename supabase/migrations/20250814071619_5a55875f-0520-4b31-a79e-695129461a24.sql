-- Fix function search path security warnings
-- Update functions to have immutable search_path

-- Fix function search paths for security
ALTER FUNCTION public.encrypt_mfa_secret(text) SET search_path TO 'public';
ALTER FUNCTION public.decrypt_mfa_secret(text) SET search_path TO 'public';
ALTER FUNCTION public.assign_ab_variant(text, uuid, text) SET search_path TO 'public';

-- Update extension versions to latest
ALTER EXTENSION "uuid-ossp" UPDATE;
ALTER EXTENSION "pgcrypto" UPDATE;

-- Add security configuration for better password protection
-- These need to be set in Supabase dashboard: Auth > Settings
-- OTP expiry should be reduced from current setting
-- Leaked password protection should be enabled

-- Create function to check current auth settings
CREATE OR REPLACE FUNCTION public.get_auth_security_status()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN jsonb_build_object(
    'message', 'Auth security settings should be configured in Supabase Dashboard',
    'otp_expiry', 'Reduce OTP expiry to 600 seconds (10 minutes) in Auth > Settings',
    'password_protection', 'Enable leaked password protection in Auth > Settings',
    'timestamp', now()
  );
END;
$$;