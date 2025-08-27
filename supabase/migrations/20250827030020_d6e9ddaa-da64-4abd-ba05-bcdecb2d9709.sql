-- First, let's check which policies exist and fix the admin function

-- Fix the admin helper function to use correct column reference
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE profiles.user_id = is_admin_user.user_id), false);
$$;

-- Drop existing permissive policies that need to be replaced
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can create search analytics" ON public.search_analytics;
DROP POLICY IF EXISTS "Users can view their own search analytics" ON public.search_analytics;

-- Add admin policies for profiles if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_select_admin') THEN
        CREATE POLICY "profiles_select_admin"
        ON public.profiles FOR SELECT TO authenticated  
        USING (public.is_admin_user(auth.uid()));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_update_admin') THEN
        CREATE POLICY "profiles_update_admin"
        ON public.profiles FOR UPDATE TO authenticated
        USING (public.is_admin_user(auth.uid()));
    END IF;
END $$;

-- Replace recipe_ratings policies with hardened versions
DROP POLICY IF EXISTS "Users can create their own rating" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can update their own rating" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can delete their own rating" ON public.recipe_ratings;

-- Only authenticated users can read ratings (no anonymous access)
CREATE POLICY "ratings_select_authenticated"
ON public.recipe_ratings FOR SELECT TO authenticated
USING (true);

-- Only the author can insert/update/delete their ratings
CREATE POLICY "ratings_insert_own"
ON public.recipe_ratings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ratings_update_own"
ON public.recipe_ratings FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "ratings_delete_own" 
ON public.recipe_ratings FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Implement hardened SEARCH_ANALYTICS table policies (admins only)
CREATE POLICY "analytics_admin_select"
ON public.search_analytics FOR SELECT TO authenticated
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "analytics_admin_insert"
ON public.search_analytics FOR INSERT TO authenticated
WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "analytics_admin_update"
ON public.search_analytics FOR UPDATE TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "analytics_admin_delete" 
ON public.search_analytics FOR DELETE TO authenticated
USING (public.is_admin_user(auth.uid()));