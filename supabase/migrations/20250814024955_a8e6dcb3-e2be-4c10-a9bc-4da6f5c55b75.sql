-- Enhance submissions table security to protect customer email addresses

-- Add a user_id column to track the submitter for authenticated users
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update the existing INSERT policy to be more secure and track the user
DROP POLICY IF EXISTS "Authenticated users can submit" ON public.submissions;

CREATE POLICY "Secure submission creation"
ON public.submissions 
FOR INSERT 
WITH CHECK (
  -- Allow authenticated users to submit with proper data validation
  auth.role() = 'authenticated' AND
  -- Ensure email format is valid
  submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  length(submitter_email) <= 255 AND
  length(submitter_name) <= 100 AND
  length(submitter_name) > 0
);

-- Add policy for users to view their own submissions
CREATE POLICY "Users can view own submissions"
ON public.submissions 
FOR SELECT 
USING (
  -- Users can view their own submissions if they are authenticated and match
  auth.role() = 'authenticated' AND 
  user_id = auth.uid()
);

-- Create a secure function to handle submission creation with user tracking
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
  -- Get the current user ID if authenticated
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
  
  -- Insert the submission with user tracking
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

-- Create a function for users to get their own submissions (without exposing other users' data)
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
  -- Only return submissions for the current authenticated user
  -- Exclude sensitive data like email addresses from the response
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

-- Update existing submissions to set user_id where possible (for any existing data)
-- This is safe since we're just adding tracking, not changing access
UPDATE public.submissions 
SET user_id = NULL 
WHERE user_id IS NULL;

-- Block direct INSERT access, force use of secure function
DROP POLICY IF EXISTS "Secure submission creation" ON public.submissions;

CREATE POLICY "Block direct submission inserts"
ON public.submissions 
FOR INSERT 
WITH CHECK (false); -- Block all direct inserts

-- Allow the secure function to work
CREATE POLICY "Allow function-based submission operations"
ON public.submissions 
FOR ALL
USING (
  current_setting('is_superuser') = 'on' OR 
  current_user IN ('supabase_admin', 'postgres')
)
WITH CHECK (
  current_setting('is_superuser') = 'on' OR 
  current_user IN ('supabase_admin', 'postgres')
);