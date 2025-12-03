
-- Phase 1: Delete broken recipes with null slugs (orphaned/corrupted data)
DELETE FROM recipes WHERE slug IS NULL;

-- Update recipes with missing image_url using known good hero images
UPDATE recipes SET image_url = '/hero-images/north-dakota-caramel-rolls.jpg' WHERE slug = 'north-dakota-caramel-rolls' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/holiday-monkey-bread.jpg' WHERE slug = 'holiday-monkey-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/festive-christmas-banana-bread.jpg' WHERE slug = 'festive-christmas-banana-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/festive-christmas-banana-bread.jpg' WHERE slug = 'festive-christmas-banana-bread-1' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/classic-christmas-panettone.jpg' WHERE slug = 'classic-christmas-panettone-refreshed-2025-edition' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/cinnamon-sugar-kuchen.jpg' WHERE slug = 'cinnamonsugar-kuchen-2025-edition' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/holiday-cranberry-walnut-sourdough-recipe.jpg' WHERE slug = 'holiday-cranberrywalnut-sourdough-2024' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/cranberry-walnut-sourdough-loaf.jpg' WHERE slug = 'cranberrywalnut-sourdough-2023-driedfruit-version' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/navigating-a-rye-bread.jpg' WHERE slug = 'pumpernickel-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/summer-fruit-quick-bread.jpg' WHERE slug = 'zucchini-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/hero-images/yeasted-dinner-rolls.jpg' WHERE slug = 'buttermilk-potato-rolls' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/images/recipes/mandarin-holiday-muffins.jpg' WHERE slug = 'mandarin-holiday-muffins' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/images/recipes/caramelized-onion-gruyere-fougasse.jpg' WHERE slug = 'caramelized-onion-gruyere-fougasse' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/lovable-uploads/938a48a4-da57-4b7f-a31f-716a0493f585.png' WHERE slug = 'sun-dried-tomato-feta-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/lovable-uploads/dc540058-4ef3-4110-88e5-71c432332f13.png' WHERE slug = 'millet-flaxseed-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/images/recipes/cinnamon-orange-star-bread.jpg' WHERE slug = 'cinnamonorange-star-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/images/recipes/garlic-herb-starbread.jpg' WHERE slug = 'garlicherb-parmesan-star-bread' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/images/recipes/ultimate-dinner-rolls.jpg' WHERE slug = 'ultimate-dinner-rolls-with-rosemaryand-sea-salt' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/lovable-uploads/d20be4b4-50d3-4390-aa14-133b1aa80872.png' WHERE slug = 'hot-dog-buns' AND (image_url IS NULL OR image_url = '');
UPDATE recipes SET image_url = '/lovable-uploads/6300d418-e64d-4a40-a868-b8bdf5c5c522.png' WHERE slug = 'spring-herb-rolls' AND (image_url IS NULL OR image_url = '');
