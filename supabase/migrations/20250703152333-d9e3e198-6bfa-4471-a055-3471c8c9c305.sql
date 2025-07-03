-- Add folder and tags columns to recipes table
ALTER TABLE public.recipes 
ADD COLUMN folder TEXT,
ADD COLUMN tags TEXT[];

-- Add indexes for better performance
CREATE INDEX idx_recipes_folder ON public.recipes(folder) WHERE folder IS NOT NULL;
CREATE INDEX idx_recipes_tags ON public.recipes USING GIN(tags) WHERE tags IS NOT NULL;