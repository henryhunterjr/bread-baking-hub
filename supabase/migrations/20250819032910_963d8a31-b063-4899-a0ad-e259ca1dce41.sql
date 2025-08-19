-- Fix submissions table security vulnerabilities (corrected)
-- Step 1: Handle any existing NULL user_id records
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

-- Step 5: Add validation constraints
ALTER TABLE public.submissions 
ADD CONSTRAINT IF NOT EXISTS valid_email_format 
CHECK (submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.submissions 
ADD CONSTRAINT IF NOT EXISTS valid_name_length 
CHECK (length(submitter_name) BETWEEN 1 AND 100);

ALTER TABLE public.submissions 
ADD CONSTRAINT IF NOT EXISTS valid_email_length 
CHECK (length(submitter_email) <= 255);