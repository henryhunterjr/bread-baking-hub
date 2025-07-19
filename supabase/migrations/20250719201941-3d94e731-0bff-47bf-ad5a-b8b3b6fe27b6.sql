-- Update the newsletter's social_image_url to use the Cuban bread image
UPDATE blog_posts 
SET social_image_url = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/cuban-bread/cuban-bread-1200-x-250-px-1280-x-720-px.png',
    updated_at = now()
WHERE title = 'Sunday Funday Bake-Along' 
AND publish_as_newsletter = true;