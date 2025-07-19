
-- Update the newsletter's social_image_url to NULL so it falls back to the brand banner
UPDATE blog_posts 
SET social_image_url = NULL,
    updated_at = now()
WHERE title = 'Sunday Funday Bake-Along' 
AND publish_as_newsletter = true;
