-- Critical Security Fix: Remove is_admin column from profiles
-- This fixes a privilege escalation vulnerability where users can update their own is_admin status

-- Step 1: Drop all policies that depend on is_admin_user functions
DROP POLICY IF EXISTS "Prevent admin privilege escalation" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile but not admin status" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "analytics_admin_select" ON public.search_analytics;
DROP POLICY IF EXISTS "analytics_admin_insert" ON public.search_analytics;
DROP POLICY IF EXISTS "analytics_admin_update" ON public.search_analytics;
DROP POLICY IF EXISTS "analytics_admin_delete" ON public.search_analytics;

-- Step 2: Drop old is_admin_user functions
DROP FUNCTION IF EXISTS public.is_admin_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_user(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.current_user_is_admin() CASCADE;

-- Step 3: Drop the is_admin column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin CASCADE;

-- Step 4: Create a new is_current_user_admin function using secure has_role system
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT has_role(auth.uid(), 'admin'::app_role);
$$;

-- Step 5: Recreate necessary policies using proper role-based access
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can select all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = user_id);

-- Step 6: Recreate search_analytics policies for admins only
-- This table contains analytics data that should only be accessible to administrators
CREATE POLICY "Admins can view search analytics"
ON public.search_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert search analytics"
ON public.search_analytics
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update search analytics"
ON public.search_analytics
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete search analytics"
ON public.search_analytics
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add documentation
COMMENT ON FUNCTION public.is_current_user_admin IS 
'Securely checks if current user has admin role using user_roles table and has_role function. Prevents privilege escalation by ensuring admin status cannot be manipulated client-side.';

COMMENT ON TABLE public.profiles IS
'User profiles table. Admin status is now managed through the separate user_roles table to prevent privilege escalation vulnerabilities.';

-- Note: analytics_daily_metrics is a VIEW, not a table
-- Views created with security_invoker=true automatically enforce RLS of underlying tables
-- Access control is handled through the analytics_events table RLS policies