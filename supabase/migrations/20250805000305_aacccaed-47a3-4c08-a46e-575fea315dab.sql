-- Update recipe images based on slug mapping
-- This will populate image_url for recipes that match our mapping

UPDATE public.recipes
SET image_url = CASE slug
  WHEN 'apple-cider-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/th-8.jpeg'
  WHEN 'apricot-almond-sourdough' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/05/Untitvvled-design.png'
  WHEN 'basic-sourdough-loaf' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/01/Knead-to-Know-Logo-with-script-scaled.jpg'
  WHEN 'blueberry-lemon-scones' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/05/495571415_10235709364576315_7915392766389904392_n.jpg'
  WHEN 'brioche-hamburger-buns' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/09/IMG_2959-scaled.jpg'
  WHEN 'cheddar-chive-biscuits' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/05/img_0143-1-scaled.jpg'
  WHEN 'cherry-vanilla-sourdough' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/IMG_7860.jpg'
  WHEN 'classic-white-sandwich-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/10/20200930_132842-scaled.jpg'
  WHEN 'cranberry-walnut-loaf' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/10/img_8035-edited.jpg'
  WHEN 'easter-paska' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/03/IMG_6302-2-scaled.jpg'
  WHEN 'fig-walnut-sourdough' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/10/img_8035-edited.jpg'
  WHEN 'grilled-flatbread-with-toppings' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/IMG_8945-2-scaled.jpg'
  WHEN 'hanukkah-challah' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/IMG_7632-scaled.jpg'
  WHEN 'henrys-crusty-white-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/IMG_1158_Original-scaled.jpg'
  WHEN 'honey-oatmeal-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/02/IMG_1284.jpg'
  WHEN 'hot-cross-buns' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/03/IMG_6302-2-scaled.jpg'
  WHEN 'jalapeno-cheddar-cornbread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/10/img_8136-1.jpg'
  WHEN 'japanese-milk-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/05/img_0039-scaled-1.jpg'
  WHEN 'lemon-thyme-focaccia' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/img_8831-1-scaled.jpg'
  WHEN 'light-sourdough-batard' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/img_5928-scaled.jpg'
  WHEN 'maple-walnut-sticky-buns' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/10/img_8035-edited.jpg'
  WHEN 'multigrain-sandwich-loaf' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/10/IMG_9436.jpeg'
  WHEN 'no-knead-white-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/IMG_7999_Original-1-scaled.jpg'
  WHEN 'nutty-whole-grain-sourdough' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/10/IMG_9436.jpeg'
  WHEN 'olive-rosemary-focaccia' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/06/img_8649-1-scaled.jpg'
  WHEN 'pumpkin-sourdough' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/10/IMG_4644-scaled.jpg'
  WHEN 'roasted-garlic-rosemary-sourdough' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/06/img_8649-1-scaled.jpg'
  WHEN 'rosemary-garlic-focaccia' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/06/img_8649-1-scaled.jpg'
  WHEN 'rustic-italian-ciabatta' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/05/img_9838-scaled.jpg'
  WHEN 'rye-sourdough-caraway' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/05/Untitvvled-design.png'
  WHEN 'sourdough-bagels' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/05/Untitvvled-design.png'
  WHEN 'sourdough-discard-crackers' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/img_9134-1-scaled.jpg'
  WHEN 'sourdough-discard-pancakes' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/img_9134-1-scaled.jpg'
  WHEN 'sourdough-english-muffins' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/05/Untitvvled-design.png'
  WHEN 'sourdough-pizza-dough' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/05/Untitvvled-design.png'
  WHEN 'sourdough-pretzels' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/img_9134-1-scaled.jpg'
  WHEN 'spiced-chocolate-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/05/img_9983-1-1-scaled.jpg'
  WHEN 'spiced-holiday-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/th-8.jpeg'
  WHEN 'spiced-pear-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/th-8.jpeg'
  WHEN 'spring-herb-focaccia' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/img_8831-1-scaled.jpg'
  WHEN 'stollen' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2023/11/IMG_7584-1-scaled.jpg'
  WHEN 'super-seeded-sourdough-loaf' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/01/henry-s-foolproof-sourdough-loaf.png'
  WHEN 'wildflower-honey-wheat-bread' THEN 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2025/02/IMG_1284.jpg'
  ELSE image_url
END
WHERE slug IN (
  'apple-cider-bread', 'apricot-almond-sourdough', 'basic-sourdough-loaf', 'blueberry-lemon-scones',
  'brioche-hamburger-buns', 'cheddar-chive-biscuits', 'cherry-vanilla-sourdough', 'classic-white-sandwich-bread',
  'cranberry-walnut-loaf', 'easter-paska', 'fig-walnut-sourdough', 'grilled-flatbread-with-toppings',
  'hanukkah-challah', 'henrys-crusty-white-bread', 'honey-oatmeal-bread', 'hot-cross-buns',
  'jalapeno-cheddar-cornbread', 'japanese-milk-bread', 'lemon-thyme-focaccia', 'light-sourdough-batard',
  'maple-walnut-sticky-buns', 'multigrain-sandwich-loaf', 'no-knead-white-bread', 'nutty-whole-grain-sourdough',
  'olive-rosemary-focaccia', 'pumpkin-sourdough', 'roasted-garlic-rosemary-sourdough', 'rosemary-garlic-focaccia',
  'rustic-italian-ciabatta', 'rye-sourdough-caraway', 'sourdough-bagels', 'sourdough-discard-crackers',
  'sourdough-discard-pancakes', 'sourdough-english-muffins', 'sourdough-pizza-dough', 'sourdough-pretzels',
  'spiced-chocolate-bread', 'spiced-holiday-bread', 'spiced-pear-bread', 'spring-herb-focaccia',
  'stollen', 'super-seeded-sourdough-loaf', 'wildflower-honey-wheat-bread'
);