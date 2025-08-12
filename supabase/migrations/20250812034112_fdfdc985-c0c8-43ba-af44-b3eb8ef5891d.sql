-- Secure newsletter_subscribers and related security hardening
begin;

-- Ensure citext extension exists in the recommended 'extensions' schema
create extension if not exists citext with schema extensions;

-- Move citext to extensions schema if it was created elsewhere
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER EXTENSION citext SET SCHEMA extensions';
  EXCEPTION WHEN OTHERS THEN NULL; -- ignore if not permitted or already in place
  END;
END $$;

-- Normalize email column to citext
ALTER TABLE if exists public.newsletter_subscribers
  ALTER COLUMN email TYPE citext;

-- Enforce unique email (case-insensitive via citext)
CREATE UNIQUE INDEX IF NOT EXISTS uq_newsletter_subscribers_email
  ON public.newsletter_subscribers (email);

-- Enable RLS on newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Ensure policies (create if missing)
DO $$
BEGIN
  -- Public insert
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'newsletter_subscribers' 
      AND policyname = 'Anyone can subscribe to newsletter'
  ) THEN
    CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    WITH CHECK (true);
  END IF;

  -- Admin select
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'newsletter_subscribers' 
      AND policyname = 'Admins can view newsletter subscribers'
  ) THEN
    CREATE POLICY "Admins can view newsletter subscribers"
    ON public.newsletter_subscribers
    FOR SELECT
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- Admin update
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'newsletter_subscribers' 
      AND policyname = 'Admins can update newsletter subscribers'
  ) THEN
    CREATE POLICY "Admins can update newsletter subscribers"
    ON public.newsletter_subscribers
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- Admin delete
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'newsletter_subscribers' 
      AND policyname = 'Admins can delete newsletter subscribers'
  ) THEN
    CREATE POLICY "Admins can delete newsletter subscribers"
    ON public.newsletter_subscribers
    FOR DELETE
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Fix function search_path mutability warnings by setting explicit search_path
-- (Idempotent even if already set)
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.create_recipe_version() SET search_path = public;

-- Update extensions flagged (attempt safe update for citext)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER EXTENSION citext UPDATE';
  EXCEPTION WHEN OTHERS THEN NULL; -- ignore if already latest or not permitted
  END;
END $$;

commit;