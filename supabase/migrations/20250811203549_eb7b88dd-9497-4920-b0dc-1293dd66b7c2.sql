-- Restrict public read access to newsletter_subscribers while keeping public inserts

-- 1) Drop overly permissive SELECT policy
DROP POLICY IF EXISTS "Subscribers can view their own subscription" ON public.newsletter_subscribers;

-- 2) Create admin-only SELECT policy using existing role helper
CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Note: Existing INSERT policy "Anyone can subscribe to newsletter" remains in place to allow public signups.
