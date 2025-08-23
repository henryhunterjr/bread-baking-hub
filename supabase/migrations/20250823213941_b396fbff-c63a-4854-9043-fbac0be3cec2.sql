-- Add missing columns to user_recipes table
ALTER TABLE public.user_recipes 
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS folder TEXT,
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- Update any empty titles
UPDATE public.user_recipes 
SET title = 'Untitled Recipe' 
WHERE title = '';

-- Create the missing indexes
CREATE INDEX IF NOT EXISTS idx_user_recipes_user_id ON public.user_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recipes_folder ON public.user_recipes(user_id, folder);
CREATE INDEX IF NOT EXISTS idx_user_recipes_favorites ON public.user_recipes(user_id) WHERE is_favorite = true;