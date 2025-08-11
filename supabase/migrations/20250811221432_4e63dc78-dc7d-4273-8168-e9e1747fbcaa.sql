-- Security hardening migration: tighten RLS on blog_clicks and ai_drafts

begin;

-- BLOG_CLICKS: Restrict SELECT to owners and add admin-wide read policy
-- Drop existing SELECT policies idempotently
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blog_clicks'
      AND policyname = 'Users can view their own blog clicks'
  ) THEN
    DROP POLICY "Users can view their own blog clicks" ON public.blog_clicks;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blog_clicks'
      AND policyname = 'Admins can view all blog clicks'
  ) THEN
    DROP POLICY "Admins can view all blog clicks" ON public.blog_clicks;
  END IF;
END $$;

-- Recreate precise SELECT policies
CREATE POLICY "Users can view their own blog clicks"
ON public.blog_clicks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all blog clicks"
ON public.blog_clicks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- AI_DRAFTS: Restrict SELECT/UPDATE/DELETE to admins only
-- Drop existing authenticated-wide policies idempotently
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_drafts'
      AND policyname = 'Authenticated users can view ai_drafts'
  ) THEN
    DROP POLICY "Authenticated users can view ai_drafts" ON public.ai_drafts;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_drafts'
      AND policyname = 'Authenticated users can update ai_drafts'
  ) THEN
    DROP POLICY "Authenticated users can update ai_drafts" ON public.ai_drafts;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_drafts'
      AND policyname = 'Authenticated users can delete ai_drafts'
  ) THEN
    DROP POLICY "Authenticated users can delete ai_drafts" ON public.ai_drafts;
  END IF;
END $$;

-- Recreate admin-only policies
CREATE POLICY "Admins can view ai_drafts"
ON public.ai_drafts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ai_drafts"
ON public.ai_drafts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ai_drafts"
ON public.ai_drafts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

commit;