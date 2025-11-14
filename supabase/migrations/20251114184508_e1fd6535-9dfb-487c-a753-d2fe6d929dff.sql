-- Update SEO metadata for the ciabatta blog post
UPDATE blog_posts 
SET 
  title = 'Fast Ciabatta Recipe: From My Black Book When You Need Bread Now',
  subtitle = 'From my old farmers market black book: the ciabatta I make when there''s no time to wait. 95% hydration, paddle attachment (not dough hook), aggressive yeast, and bread in under 2 hours. Wet dough technique that delivers crispy crust and open crumb without overnight ferments.',
  slug = 'no-time-ciabatta-recipe',
  tags = ARRAY['quick ciabatta recipe', 'ciabatta', 'bread', 'baking', 'fast bread recipe', 'high hydration bread'],
  updated_at = now()
WHERE slug = 'the-i-don-t-have-time-for-all-of-that-i-need-to-bake-now-ciabatta';

-- Note: The Open Graph title "The I Don't Have Time For All That Ciabatta Recipe" 
-- will be handled by the MetadataManager component using the title field