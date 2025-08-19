-- Fix submissions table security vulnerabilities
-- Step 1: Handle any existing NULL user_id records by assigning them to a system user or removing them
UPDATE public.submissions 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Step 2: Make user_id NOT NULL to prevent security edge cases
ALTER TABLE public.submissions 
ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Drop existing RLS policies to recreate with stronger security
DROP POLICY IF EXISTS "admin_read_all_submissions" ON public.submissions;
DROP POLICY IF EXISTS "user_read_own_submissions" ON public.submissions;
DROP POLICY IF EXISTS "user_create_submissions" ON public.submissions;
DROP POLICY IF EXISTS "admin_update_submissions" ON public.submissions;
DROP POLICY IF EXISTS "admin_delete_submissions" ON public.submissions;

-- Step 4: Create enhanced RLS policies with stronger validation
CREATE POLICY "admin_read_all_submissions" 
ON public.submissions 
FOR SELECT 
USING (
  auth.role() = 'authenticated' 
  AND has_role(auth.uid(), 'admin'::app_role)
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "user_read_own_submissions" 
ON public.submissions 
FOR SELECT 
USING (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND user_id = auth.uid()
);

CREATE POLICY "user_create_submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated'
  AND auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(submitter_email) <= 255
  AND length(submitter_name) BETWEEN 1 AND 100
  AND length(submission_type) BETWEEN 1 AND 50
);

CREATE POLICY "admin_update_submissions" 
ON public.submissions 
FOR UPDATE 
USING (
  auth.role() = 'authenticated'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  auth.role() = 'authenticated'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "admin_delete_submissions" 
ON public.submissions 
FOR DELETE 
USING (
  auth.role() = 'authenticated'
  AND has_role(auth.uid(), 'admin'::app_role)
  AND auth.uid() IS NOT NULL
);

-- Step 5: Add audit trigger for submission access logging
CREATE OR REPLACE FUNCTION public.log_submission_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to submissions for security monitoring
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_data,
    ip_address
  ) VALUES (
    auth.uid(),
    'submission_access',
    jsonb_build_object(
      'submission_id', COALESCE(NEW.id, OLD.id),
      'operation', TG_OP,
      'table', TG_TABLE_NAME
    ),
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging
CREATE TRIGGER audit_submission_access
AFTER SELECT ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.log_submission_access();

-- Step 6: Add additional validation constraints
ALTER TABLE public.submissions 
ADD CONSTRAINT valid_email_format 
CHECK (submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.submissions 
ADD CONSTRAINT valid_name_length 
CHECK (length(submitter_name) BETWEEN 1 AND 100);

ALTER TABLE public.submissions 
ADD CONSTRAINT valid_email_length 
CHECK (length(submitter_email) <= 255);