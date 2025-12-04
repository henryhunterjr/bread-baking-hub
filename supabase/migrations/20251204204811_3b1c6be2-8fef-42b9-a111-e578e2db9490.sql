-- Update Tyler Cartner blog post to use the correct thumbnail image
UPDATE public.blog_posts 
SET social_image_url = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-12/tyler-cartner/interview-with-tyley.png',
    hero_image_url = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-12/tyler-cartner/interview-with-tyley.png'
WHERE slug = 'the-man-behind-wire-monkey';