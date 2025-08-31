-- Update the blog post with correct title and slug
UPDATE blog_posts 
SET 
  title = 'A Classic Challah Bread',
  slug = 'classic-challah-bread',
  subtitle = 'Traditional six-strand braided challah bread recipe',
  content = 'Learn to make traditional challah bread with this classic six-strand braiding technique. This newsletter post features a beautiful golden challah perfect for Shabbat or any special occasion.'
WHERE slug = 'bacon-long-hala';