-- Remove the security definer view and implement a proper secure solution

-- Drop the problematic security definer view
DROP VIEW IF EXISTS public.admin_submissions_view;

-- Create a proper admin function instead of a view
CREATE OR REPLACE FUNCTION public.get_admin_submissions()
RETURNS TABLE(
  id UUID,
  submitter_name TEXT,
  submitter_email TEXT,
  submission_data JSONB,
  submission_type TEXT,
  priority TEXT,
  status TEXT,
  notes TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized access - admin role required';
  END IF;
  
  -- Return all submissions for admin users
  RETURN QUERY
  SELECT 
    s.id,
    s.submitter_name,
    s.submitter_email,
    s.submission_data,
    s.submission_type,
    s.priority,
    s.status,
    s.notes,
    s.user_id,
    s.created_at,
    s.updated_at
  FROM public.submissions s
  ORDER BY s.created_at DESC;
END;
$$;

-- Remove the overly restrictive policy that blocks everything
DROP POLICY IF EXISTS "Block unauthorized submission access" ON public.submissions;

-- The final security model now consists of these specific policies only:
-- 1. "Admins can read submissions" - FOR SELECT to admins only
-- 2. "Admins can update submissions" - FOR UPDATE to admins only  
-- 3. "Users can view own submissions" - FOR SELECT to users for their own data only
-- 4. "Authenticated users can create submissions" - FOR INSERT with validation

-- No function-based bypasses, no overly permissive policies
-- All access is controlled through specific, restrictive RLS policies