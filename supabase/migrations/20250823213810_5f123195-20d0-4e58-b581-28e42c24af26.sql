-- Create user_recipes table for saved recipes
CREATE TABLE IF NOT EXISTS public.user_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT,
    folder TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Prevent duplicate saves
    UNIQUE(user_id, recipe_id)
);

-- Enable RLS
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_recipes
CREATE POLICY "Users can manage their own saved recipes" ON public.user_recipes
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_recipes_user_id ON public.user_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recipes_favorites ON public.user_recipes(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_user_recipes_folder ON public.user_recipes(user_id, folder);