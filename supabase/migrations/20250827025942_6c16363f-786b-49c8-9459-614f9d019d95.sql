-- Step 1: Drop existing permissive policies that need to be replaced

-- Drop existing profiles policies that are too permissive
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "profiles self access" ON public.profiles;

-- Drop existing recipe_ratings policies that allow anonymous access
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.recipe_ratings;

-- Drop existing search_analytics policies that are too permissive
DROP POLICY IF EXISTS "Users can create search analytics" ON public.search_analytics;
DROP POLICY IF EXISTS "Users can view their own search analytics" ON public.search_analytics;

-- Step 2: Create admin helper function (improved version)
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE user_id = user_id), false);
$$;

-- Step 3: Implement hardened PROFILES table policies
-- Owner can select/update own profile
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" 
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Admin can select/update all profiles
CREATE POLICY "profiles_select_admin"
ON public.profiles FOR SELECT TO authenticated  
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "profiles_update_admin"
ON public.profiles FOR UPDATE TO authenticated
USING (public.is_admin_user(auth.uid()));

-- Step 4: Implement hardened RECIPE_RATINGS table policies
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

-- Step 5: Implement hardened SEARCH_ANALYTICS table policies (admins only)
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