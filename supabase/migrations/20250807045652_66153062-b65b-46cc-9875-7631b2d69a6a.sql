-- Fix Rosemary Garlic Parmesan Loaf image URL in database
UPDATE public.recipes 
SET image_url = '/lovable-uploads/9b1f8351-f0df-4573-8fe1-fea3a1568962.png'
WHERE slug = 'rosemary-garlic-parmesan-loaf';