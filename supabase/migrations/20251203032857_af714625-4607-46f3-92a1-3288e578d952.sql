-- Delete the duplicate festive-christmas-banana-bread-1
DELETE FROM recipes WHERE slug = 'festive-christmas-banana-bread-1';

-- Fix all the image URLs to use full blog paths (not local /hero-images/)
UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/festive-christmas-banana-bread.jpg'
WHERE slug = 'festive-christmas-banana-bread';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/classic-christmas-panettone.jpg'
WHERE slug = 'classic-christmas-panettone-refreshed-2025-edition';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/cinnamon-sugar-kuchen.jpg'
WHERE slug = 'cinnamonsugar-kuchen-2025-edition';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/north-dakota-caramel-rolls.jpg'
WHERE slug = 'north-dakota-caramel-rolls';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/holiday-monkey-bread.jpg'
WHERE slug = 'holiday-monkey-bread';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/holiday-cranberry-walnut-sourdough-recipe.jpg'
WHERE slug = 'holiday-cranberrywalnut-sourdough-2024';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/cranberry-walnut-sourdough-loaf.jpg'
WHERE slug = 'cranberrywalnut-sourdough-2023-driedfruit-version';