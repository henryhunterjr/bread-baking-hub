INSERT INTO blog_posts (
  slug, 
  title, 
  subtitle,
  content, 
  hero_image_url, 
  social_image_url,
  tags, 
  publish_as_newsletter,
  is_draft,
  published_at
) VALUES (
  'bacon-long-hala',
  'Bacon Long Hala',
  'A savory twist on traditional challah bread',
  'A savory twist on traditional challah bread featuring crispy bacon woven into a long braided loaf. This newsletter post showcases a unique approach to classic challah.',
  'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/classic-challah-bread-recipe-traditional-six-strand-braid/a-still-life-photograph-capturing-a-beauepijgalorrus84tasukdfqt6w5xxihsb-2aosv7-pvng.png',
  'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/classic-challah-bread-recipe-traditional-six-strand-braid/a-still-life-photograph-capturing-a-beauepijgalorrus84tasukdfqt6w5xxihsb-2aosv7-pvng.png',
  ARRAY['challah', 'bacon', 'savory bread', 'braided bread'],
  true,
  false,
  now()
);