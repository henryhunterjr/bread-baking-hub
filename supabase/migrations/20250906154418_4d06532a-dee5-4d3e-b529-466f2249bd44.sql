-- Fix missing slugs for existing recipes
UPDATE public.recipes 
SET slug = generate_recipe_slug(title, user_id) 
WHERE slug IS NULL;