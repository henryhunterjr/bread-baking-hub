-- Create tables for ratings, favorites, and reviews

-- 1) recipe_ratings
CREATE TABLE IF NOT EXISTS public.recipe_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (recipe_id, user_id)
);

ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can view ratings (to show average & count publicly)
CREATE POLICY "Anyone can view ratings"
ON public.recipe_ratings
FOR SELECT
USING (true);

-- Users can create their own rating
CREATE POLICY "Users can create their own rating"
ON public.recipe_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own rating
CREATE POLICY "Users can update their own rating"
ON public.recipe_ratings
FOR UPDATE
USING (auth.uid() = user_id);

-- Optional: allow users to delete their rating
CREATE POLICY "Users can delete their own rating"
ON public.recipe_ratings
FOR DELETE
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id ON public.recipe_ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_user_id ON public.recipe_ratings(user_id);

-- updated_at trigger
CREATE TRIGGER set_updated_at_recipe_ratings
BEFORE UPDATE ON public.recipe_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 2) user_favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, recipe_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
ON public.user_favorites
FOR SELECT
USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "Users can add their own favorites"
ON public.user_favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can remove their own favorites"
ON public.user_favorites
FOR DELETE
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_recipe_id ON public.user_favorites(recipe_id);


-- 3) recipe_reviews
CREATE TABLE IF NOT EXISTS public.recipe_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recipe_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON public.recipe_reviews
FOR SELECT
USING (true);

-- Users can create their own reviews
CREATE POLICY "Users can create their own reviews"
ON public.recipe_reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
ON public.recipe_reviews
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
ON public.recipe_reviews
FOR DELETE
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_recipe_id_created_at ON public.recipe_reviews(recipe_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_user_id_created_at ON public.recipe_reviews(user_id, created_at DESC);

-- updated_at trigger
CREATE TRIGGER set_updated_at_recipe_reviews
BEFORE UPDATE ON public.recipe_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();