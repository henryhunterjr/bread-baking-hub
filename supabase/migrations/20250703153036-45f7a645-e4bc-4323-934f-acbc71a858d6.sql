-- Add public sharing fields to recipes table
ALTER TABLE public.recipes 
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN slug TEXT;

-- Create unique index for slugs per user to ensure uniqueness
CREATE UNIQUE INDEX idx_recipes_user_slug ON public.recipes(user_id, slug) WHERE slug IS NOT NULL;

-- Add index for public recipe lookups
CREATE INDEX idx_recipes_public_slug ON public.recipes(slug) WHERE is_public = true AND slug IS NOT NULL;

-- Create policy for public recipe access
CREATE POLICY "Public recipes are viewable by anyone" 
ON public.recipes 
FOR SELECT 
USING (is_public = true);

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_recipe_slug(recipe_title TEXT, recipe_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from title
  base_slug := lower(trim(regexp_replace(recipe_title, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'recipe';
  END IF;
  
  -- Check for uniqueness and append counter if needed
  final_slug := base_slug;
  WHILE EXISTS (
    SELECT 1 FROM public.recipes 
    WHERE user_id = recipe_user_id 
    AND slug = final_slug
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;