-- 1) App roles enum (includes qa_reviewer)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user','qa_reviewer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) user_roles table with optional expiry
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only allow users to read their own roles
DO $$ BEGIN
  CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3) Security-definer role check that respects expiry
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND (ur.expires_at IS NULL OR now() < ur.expires_at)
  );
$$;

-- 4) QA feedback table (write-access for QA only; readable by authenticated)
CREATE TABLE IF NOT EXISTS public.qa_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  target_type text NOT NULL,
  target_id text,
  title text,
  body text,
  status text NOT NULL DEFAULT 'open',
  severity text NOT NULL DEFAULT 'low',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.qa_feedback ENABLE ROW LEVEL SECURITY;

-- Insert: only authenticated, and only as themselves
DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert their own feedback"
  ON public.qa_feedback
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Select: any authenticated user can read feedback (owner + QA reviewers)
DO $$ BEGIN
  CREATE POLICY "Authenticated users can view all feedback"
  ON public.qa_feedback
  FOR SELECT
  USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Update: only feedback author can update their own items
DO $$ BEGIN
  CREATE POLICY "Authors can update their own feedback"
  ON public.qa_feedback
  FOR UPDATE
  USING (created_by = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Auto-update updated_at
DO $$ BEGIN
  CREATE TRIGGER update_qa_feedback_updated_at
  BEFORE UPDATE ON public.qa_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5) Grant QA read access to private content
-- Blog posts (all rows, including drafts)
DO $$ BEGIN
  CREATE POLICY "QA reviewers can read all blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (public.has_role(auth.uid(), 'qa_reviewer'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Blog images metadata
DO $$ BEGIN
  CREATE POLICY "QA reviewers can view all image metadata"
  ON public.blog_images_metadata
  FOR SELECT
  USING (public.has_role(auth.uid(), 'qa_reviewer'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;