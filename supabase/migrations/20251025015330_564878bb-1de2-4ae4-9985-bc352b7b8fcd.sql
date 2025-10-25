-- Add is_featured column to recipes table for manual featured recipe control
ALTER TABLE public.recipes 
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Create index for efficient featured recipe queries
CREATE INDEX idx_recipes_is_featured ON public.recipes(is_featured) 
WHERE is_featured = true;