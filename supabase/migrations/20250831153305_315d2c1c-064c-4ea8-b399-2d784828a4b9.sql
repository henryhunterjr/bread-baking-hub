UPDATE recipes 
SET data = jsonb_set(
  data, 
  '{social_image_url}', 
  '"https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/classic-challah-bread-recipe-traditional-six-strand-braid/a-still-life-photograph-capturing-a-beauepijgalorrus84tasukdfqt6w5xxihsb-2aosv7-pvng.png"'
)
WHERE slug = 'classic-challah-recipe';