-- Clean up all policies and recreate properly

-- Remove ALL existing policies on submissions table
DROP POLICY IF EXISTS "Admins can read submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow function-based submission operations" ON public.submissions;
DROP POLICY IF EXISTS "Block direct submission inserts" ON public.submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users view own submissions only" ON public.submissions;
DROP POLICY IF EXISTS "Secure authenticated submission creation" ON public.submissions;
DROP POLICY IF EXISTS "Authenticated users can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Block unauthorized submission access" ON public.submissions;

-- Remove existing functions
DROP FUNCTION IF EXISTS public.create_secure_submission(TEXT, TEXT, JSONB, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_user_submissions();

-- Create clean, secure RLS policies without bypasses

-- 1. Only admins can read ALL submissions (for management)
CREATE POLICY "admin_read_all_submissions"
ON public.submissions 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Only admins can update submissions (for management)
CREATE POLICY "admin_update_submissions"
ON public.submissions 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. Only admins can delete submissions (for management)
CREATE POLICY "admin_delete_submissions"
ON public.submissions 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Users can view only their own submissions (privacy protection)
CREATE POLICY "user_read_own_submissions"
ON public.submissions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- 5. Authenticated users can create submissions with validation
CREATE POLICY "user_create_submissions"
ON public.submissions 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.role() = 'authenticated' AND
  user_id = auth.uid() AND
  submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  length(submitter_email) <= 255 AND
  length(submitter_name) <= 100 AND
  length(submitter_name) > 0
);

-- Create secure submission function that works with RLS
CREATE OR REPLACE FUNCTION public.create_secure_submission(
  p_submitter_name TEXT,
  p_submitter_email TEXT,
  p_submission_data JSONB,
  p_submission_type TEXT DEFAULT 'family_contribution',
  p_priority TEXT DEFAULT 'normal'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  submission_id UUID;
  current_user_id UUID;
BEGIN
  -- Ensure user is authenticated
  IF auth.role() != 'authenticated' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
  END IF;
  
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User ID required');
  END IF;
  
  -- Validate input data
  IF NOT (p_submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid email format');
  END IF;
  
  IF length(p_submitter_name) = 0 OR length(p_submitter_name) > 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid name length');
  END IF;
  
  IF length(p_submitter_email) > 255 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email too long');
  END IF;
  
  -- Insert (RLS policies will validate automatically)
  INSERT INTO public.submissions (
    submitter_name,
    submitter_email,
    submission_data,
    submission_type,
    priority,
    user_id,
    status
  ) VALUES (
    trim(p_submitter_name),
    lower(trim(p_submitter_email)),
    p_submission_data,
    p_submission_type,
    p_priority,
    current_user_id,
    'pending'
  )
  RETURNING id INTO submission_id;
  
  -- Security audit log
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_data,
    ip_address
  ) VALUES (
    current_user_id,
    'submission_created',
    jsonb_build_object(
      'submission_id', submission_id,
      'submission_type', p_submission_type
    ),
    inet_client_addr()
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'submission_id', submission_id,
    'message', 'Submission created successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission failed');
END;
$$;