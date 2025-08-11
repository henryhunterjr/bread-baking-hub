-- Idempotent fix for submissions RLS policies to avoid duplicate-policy errors
-- Drops any existing variants and recreates the intended admin-only read/update policies

-- Drop any legacy/old policy names if present
DROP POLICY IF EXISTS "Allow reading submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow updating submissions" ON public.submissions;

-- Conditionally drop current policy names if they already exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'submissions'
      AND policyname = 'Admins can read submissions'
  ) THEN
    DROP POLICY "Admins can read submissions" ON public.submissions;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'submissions'
      AND policyname = 'Admins can update submissions'
  ) THEN
    DROP POLICY "Admins can update submissions" ON public.submissions;
  END IF;
END $$;

-- Recreate the policies with the correct definitions
CREATE POLICY "Admins can read submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions"
ON public.submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Keep existing INSERT policy that allows public submissions unchanged