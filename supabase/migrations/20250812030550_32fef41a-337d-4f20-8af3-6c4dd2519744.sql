-- Security hardening for newsletter_subscribers and function/extension hygiene (fixed)
begin;

-- 1) Ensure citext extension exists
create extension if not exists citext with schema public;

-- Attempt to update common extensions safely (ignore if not permitted)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER EXTENSION citext UPDATE';
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    EXECUTE 'ALTER EXTENSION pgcrypto UPDATE';
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    EXECUTE 'ALTER EXTENSION pg_stat_statements UPDATE';
  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- 2) Normalize email column to citext (case-insensitive) and enforce uniqueness
alter table public.newsletter_subscribers
  alter column email type citext using lower(email)::citext;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'newsletter_subscribers_email_key'
      and conrelid = 'public.newsletter_subscribers'::regclass
  ) then
    alter table public.newsletter_subscribers
      add constraint newsletter_subscribers_email_key unique (email);
  end if;
end $$;

-- 3) Enable RLS (idempotent)
alter table public.newsletter_subscribers enable row level security;

-- 4) Recreate precise RLS policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'newsletter_subscribers'
      AND policyname = 'Admins can view newsletter subscribers'
  ) THEN
    DROP POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'newsletter_subscribers'
      AND policyname = 'Admins can update newsletter subscribers'
  ) THEN
    DROP POLICY "Admins can update newsletter subscribers" ON public.newsletter_subscribers;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'newsletter_subscribers'
      AND policyname = 'Admins can delete newsletter subscribers'
  ) THEN
    DROP POLICY "Admins can delete newsletter subscribers" ON public.newsletter_subscribers;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'newsletter_subscribers'
      AND policyname = 'Anyone can subscribe to newsletter'
  ) THEN
    DROP POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
  END IF;
END $$;

-- Public can INSERT
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Admin-only SELECT/UPDATE/DELETE
CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update newsletter subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete newsletter subscribers"
ON public.newsletter_subscribers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5) Harden SECURITY DEFINER function search_path
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.generate_recipe_slug(text, uuid) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

commit;