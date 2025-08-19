-- Fix submissions table security vulnerabilities (simplified)

-- Step 1: Make user_id NOT NULL to prevent security edge cases  
-- First update any NULL values to a system placeholder
UPDATE public.submissions 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Then make the column NOT NULL
ALTER TABLE public.submissions 
ALTER COLUMN user_id SET NOT NULL;

-- Step 2: Drop and recreate RLS policies with stronger validation
DROP POLICY IF EXISTS "admin_read_all_submissions" ON public.submissions;
DROP POLICY IF EXISTS "user_read_own_submissions" ON public.submissions;
DROP POLICY IF EXISTS "user_create_submissions" ON public.submissions;
DROP POLICY IF EXISTS "admin_update_submissions" ON public.submissions;
DROP POLICY IF EXISTS "admin_delete_submissions" ON public.submissions;

-- Enhanced RLS policies with explicit authentication checks
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
);

CREATE POLICY "admin_update_submissions" 
ON public.submissions 
FOR UPDATE 
USING (
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