-- Update the missing hero image for the Kaiser Roll post
UPDATE blog_posts 
SET hero_image_url = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/66d74ee0-b848-4b4d-b37c-6197d5d01d66/0.813535407811397.jpg'
WHERE id = 'e81f0438-2b2d-4d64-80c7-bea69a2d9638' 
AND title = 'Top Kaiser Roll Stamps & DIY Shaping Alternatives + Crust Crackle Science';