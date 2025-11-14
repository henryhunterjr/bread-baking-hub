-- Update the ciabatta blog post with the correct social image
UPDATE blog_posts 
SET social_image_url = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-11/open-crumb-ciabatta-slice-macro/theperfectloaf-ciabatta-bread-recipe-vert-4.jpg',
    updated_at = now()
WHERE slug = 'the-i-don-t-have-time-for-all-of-that-i-need-to-bake-now-ciabatta';