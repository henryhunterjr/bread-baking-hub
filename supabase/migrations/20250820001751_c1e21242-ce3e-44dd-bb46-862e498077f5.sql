-- Fix security issue: Clean up submissions table RLS policies
-- Remove all existing policies and create secure, non-redundant ones

-- Drop all existing policies on submissions table
DROP POLICY IF EXISTS "admin_delete_submissions" ON public.submissions;
DROP POLICY IF EXISTS "admin_read_all_submissions" ON public.submissions;
DROP POLICY IF EXISTS "admin_update_submissions" ON public.submissions;
DROP POLICY IF EXISTS "secure_admin_read_all_submissions" ON public.submissions;
DROP POLICY IF EXISTS "secure_user_create_submissions" ON public.submissions;
DROP POLICY IF EXISTS "secure_user_read_own_submissions" ON public.submissions;
DROP POLICY IF EXISTS "user_create_submissions" ON public.submissions;
DROP POLICY IF EXISTS "user_read_own_submissions" ON public.submissions;

-- Create clean, secure policies
-- 1. Admin policies - full access for admin role only
CREATE POLICY "admins_can_read_all_submissions" 
ON public.submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins_can_update_all_submissions" 
ON public.submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins_can_delete_all_submissions" 
ON public.submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. User policies - restricted to own submissions only
CREATE POLICY "users_can_create_own_submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
  AND submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(submitter_email) <= 255
  AND length(submitter_name) > 0
  AND length(submitter_name) <= 100
);

CREATE POLICY "users_can_read_own_submissions" 
ON public.submissions 
FOR SELECT 
USING (
  auth.role() = 'authenticated' 
  AND auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Add security audit logging for this fix
INSERT INTO public.security_audit_log (
  event_type,
  event_data,
  ip_address
) VALUES (
  'security_policy_hardening',
  jsonb_build_object(
    'table', 'submissions',
    'action', 'cleaned_up_rls_policies',
    'risk_level', 'high',
    'fix_description', 'Removed redundant policies and ensured proper access control'
  ),
  inet_client_addr()
);