-- Fix the Rosemary Garlic Parmesan Loaf recipe data
UPDATE public.recipes 
SET data = jsonb_set(
  jsonb_set(data, '{season}', '"Winter"'::jsonb),
  '{holidays}', 
  '[]'::jsonb
)
WHERE slug = 'rosemary-garlic-parmesan-loaf';