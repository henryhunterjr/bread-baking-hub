-- Harden RLS on submissions: restrict reads/updates to admins; keep public inserts

-- 1) Drop overly permissive policies
DROP POLICY IF EXISTS "Allow reading submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow updating submissions" ON public.submissions;

-- 2) Add admin-only read/update policies using existing role helper
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

-- Note: Existing INSERT policy "Allow public submissions" remains so the public can still submit.