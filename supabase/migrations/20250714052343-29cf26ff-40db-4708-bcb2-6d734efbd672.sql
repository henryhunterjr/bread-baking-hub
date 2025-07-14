ALTER TABLE blog_posts 
ADD CONSTRAINT check_slug_not_empty 
CHECK (slug != '' AND slug IS NOT NULL);