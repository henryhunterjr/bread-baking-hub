-- Fix the Rosemary Garlic Parmesan Loaf recipe data to include missing featuredDates
UPDATE public.recipes 
SET data = jsonb_set(
  data, 
  '{featuredDates}', 
  '{"start": "01-01", "end": "12-31"}'::jsonb
)
WHERE slug = 'rosemary-garlic-parmesan-loaf';