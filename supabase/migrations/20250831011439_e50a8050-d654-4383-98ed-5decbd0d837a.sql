-- Update the blog post slug from classic-challah-recipe-5 to classic-challah-bread
UPDATE blog_posts 
SET slug = 'classic-challah-bread'
WHERE slug = 'classic-challah-recipe-5';

-- Ensure the post is published and not draft
UPDATE blog_posts 
SET 
  is_draft = false,
  published_at = COALESCE(published_at, NOW())
WHERE slug = 'classic-challah-bread';