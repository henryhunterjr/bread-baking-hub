-- Phase 1: Critical RLS Policy Hardening (Simplified)

-- Fix Newsletter Data Access - Remove overly broad policy and add secure ones
DROP POLICY IF EXISTS "Allow function-based newsletter operations" ON public.newsletter_subscribers;

-- Add secure newsletter policies that only allow service role and admin access
CREATE POLICY "Service role can manage newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage newsletter subscribers via functions" 
ON public.newsletter_subscribers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix Role-Based Access Control - Add policy to prevent privilege escalation
CREATE POLICY "Prevent admin privilege escalation" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND NOT (is_admin = false AND has_role(auth.uid(), 'admin'::app_role) = false));

-- Secure MFA Data Access - Simplify conflicting MFA policies
DROP POLICY IF EXISTS "Users can view their own MFA status" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can update their own MFA" ON public.user_mfa;

CREATE POLICY "Users can manage their own MFA securely" 
ON public.user_mfa 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Phase 4: Database Function Security Updates

-- Update database functions to use proper search_path for security
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND (ur.expires_at IS NULL OR now() < ur.expires_at)
  );
$$;

-- Update admin check functions for consistency
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT has_role(auth.uid(), 'admin'::app_role);
$$;

-- Enhanced security audit logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_user_id uuid DEFAULT auth.uid(),
  p_event_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_data,
    ip_address
  ) VALUES (
    p_user_id,
    p_event_type,
    p_event_data,
    inet_client_addr()
  );
END;
$$;