-- Remove dangerous function-based bypass and implement secure access controls (fixed)

-- Remove the dangerous "Allow function-based submission operations" policy
DROP POLICY IF EXISTS "Allow function-based submission operations" ON public.submissions;

-- Remove and recreate functions to work without overly permissive policies
DROP FUNCTION IF EXISTS public.create_secure_submission(TEXT, TEXT, JSONB, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_user_submissions();

-- Remove existing problematic policies
DROP POLICY IF EXISTS "Block direct submission inserts" ON public.submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;

-- Create a secure INSERT policy with unique name
CREATE POLICY "Secure authenticated submission creation"
ON public.submissions 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND
  -- Ensure the user_id matches the authenticated user (if provided)
  (user_id IS NULL OR user_id = auth.uid()) AND
  -- Validate email format
  submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  length(submitter_email) <= 255 AND
  length(submitter_name) <= 100 AND
  length(submitter_name) > 0
);

-- Create a secure SELECT policy for users to view their own submissions
CREATE POLICY "Users view own submissions only"
ON public.submissions 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  user_id = auth.uid()
);

-- Recreate the submission function to work with proper RLS policies
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
  
  -- Insert will be validated by RLS policies automatically
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
  
  -- Log the submission for security monitoring
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
      'submission_type', p_submission_type,
      'has_email', true
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

-- Recreate user submissions function to work with existing RLS policies
CREATE OR REPLACE FUNCTION public.get_user_submissions()
RETURNS TABLE(
  id UUID,
  submission_type TEXT,
  priority TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Ensure user is authenticated
  IF auth.role() != 'authenticated' THEN
    RETURN;
  END IF;
  
  -- This will use the "Users view own submissions only" RLS policy
  -- which only allows users to see submissions where user_id = auth.uid()
  RETURN QUERY
  SELECT 
    s.id,
    s.submission_type,
    s.priority,
    s.status,
    s.created_at,
    s.updated_at,
    s.notes
  FROM public.submissions s
  WHERE s.user_id = auth.uid();
END;
$$;