-- Fix auth env variable usage (Part A: Auth Audit)
-- Update client to use correct env variables for browser
-- This will be handled in the client code

-- Part B: Complete data model with RLS (missing favorites table)
CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_slug text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, recipe_slug)
);

-- Enable RLS on all user tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "profiles self access" ON profiles;
CREATE POLICY "profiles self access"
  ON profiles FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_recipes
DROP POLICY IF EXISTS "user_recipes owner read" ON user_recipes;
DROP POLICY IF EXISTS "user_recipes owner write" ON user_recipes;
DROP POLICY IF EXISTS "user_recipes owner update" ON user_recipes;
DROP POLICY IF EXISTS "user_recipes owner delete" ON user_recipes;

CREATE POLICY "user_recipes owner read"
  ON user_recipes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "user_recipes owner write"
  ON user_recipes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_recipes owner update"
  ON user_recipes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "user_recipes owner delete"
  ON user_recipes FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for favorites
DROP POLICY IF EXISTS "favorites owner read" ON favorites;
DROP POLICY IF EXISTS "favorites owner write" ON favorites;
DROP POLICY IF EXISTS "favorites owner delete" ON favorites;

CREATE POLICY "favorites owner read"
  ON favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "favorites owner write"
  ON favorites FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "favorites owner delete"
  ON favorites FOR DELETE USING (user_id = auth.uid());

-- Part D: Admin role gating (create admin check function)
CREATE OR REPLACE FUNCTION is_admin_user(user_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_email = 'henry@bakinggreatbread.blog';
$$;

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_admin_user(auth.email());
$$;