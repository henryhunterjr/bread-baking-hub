-- Create a new blog post with same content as the original but fresh ID and slug
INSERT INTO blog_posts (
  user_id,
  title,
  subtitle,
  content,
  hero_image_url,
  inline_image_url,
  social_image_url,
  slug,
  tags,
  is_draft,
  publish_as_newsletter,
  published_at,
  created_at,
  updated_at
)
SELECT 
  user_id,
  title,
  subtitle,
  content,
  hero_image_url,
  inline_image_url,
  social_image_url,
  'holiday-star-cinnamon-roll-bread-v2' as slug, -- New slug
  tags,
  false as is_draft, -- Ensure it's published
  publish_as_newsletter,
  COALESCE(published_at, now()) as published_at, -- Ensure published_at is set
  now() as created_at, -- Fresh timestamps
  now() as updated_at
FROM blog_posts 
WHERE slug = 'holiday-star-cinnamon-roll-bread';