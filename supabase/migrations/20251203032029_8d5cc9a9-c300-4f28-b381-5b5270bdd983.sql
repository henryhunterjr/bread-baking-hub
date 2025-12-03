
-- Master Baker Enhancement Batch 6: Specialty & Quick Breads

-- Honey Oatmeal Bread
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Honey Oatmeal Bread',
  'introduction', 'This wholesome loaf combines the natural sweetness of honey with hearty oats for a bread that''s as nutritious as it is delicious. Perfect for toast with butter or as sandwich bread.',
  'description', 'Soft honey oatmeal bread with whole oats. Wholesome, slightly sweet, and perfect for toast.',
  'category', jsonb_build_array('sandwich bread', 'healthy', 'whole grain'),
  'tags', jsonb_build_array('oatmeal bread', 'honey', 'healthy', 'whole grain'),
  'difficulty', 'beginner',
  'prep_time', '25 minutes active',
  'cook_time', '35-40 minutes',
  'total_time', '3-4 hours',
  'yield', '1 loaf',
  'servings', '12 slices',
  'equipment', jsonb_build_array('9x5 loaf pan', 'Digital scale'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '350g', 'amount_volume', '2¾ cups', 'note', null),
    jsonb_build_object('item', 'Rolled oats', 'amount_metric', '75g', 'amount_volume', '¾ cup', 'note', 'plus extra for topping'),
    jsonb_build_object('item', 'Warm milk', 'amount_metric', '200g', 'amount_volume', '¾ cup + 2 tbsp', 'note', null),
    jsonb_build_object('item', 'Warm water', 'amount_metric', '80g', 'amount_volume', '⅓ cup', 'note', null),
    jsonb_build_object('item', 'Honey', 'amount_metric', '60g', 'amount_volume', '3 tbsp', 'note', null),
    jsonb_build_object('item', 'Butter', 'amount_metric', '30g', 'amount_volume', '2 tbsp', 'note', 'softened'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '8g', 'amount_volume', '1½ tsp', 'note', null),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp', 'note', null)
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Pour boiling water over oats. Let soak 15-20 minutes until softened and cooled.'),
    jsonb_build_object('step', 2, 'instruction', 'Combine flour, salt, yeast. Add milk, honey, butter, and soaked oats.'),
    jsonb_build_object('step', 3, 'instruction', 'Knead 8-10 minutes until smooth dough.'),
    jsonb_build_object('step', 4, 'instruction', 'Rise 1.5-2 hours until doubled.'),
    jsonb_build_object('step', 5, 'instruction', 'Shape into log, place in greased pan. Brush top with water, sprinkle oats.'),
    jsonb_build_object('step', 6, 'instruction', 'Rise 45-60 minutes.'),
    jsonb_build_object('step', 7, 'instruction', 'Bake at 350°F (175°C) for 35-40 minutes. Internal temp 190°F.')
  ),
  'tips', jsonb_build_array(
    'Soaking oats prevents them from absorbing too much moisture from dough.',
    'Real honey adds better flavor than corn syrup.',
    'Spray oat topping with water before baking to help them stick.'
  ),
  'seo_description', 'Soft honey oatmeal bread recipe with whole oats. Wholesome homemade bread perfect for toast and sandwiches.'
), updated_at = NOW()
WHERE slug = 'honey-oatmeal-bread';

-- Cheddar and Chive Biscuits
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Cheddar and Chive Biscuits',
  'introduction', 'Flaky, buttery biscuits loaded with sharp cheddar and fresh chives. These are the biscuits you''ll be asked to bring to every potluck. Perfect alongside soup, chili, or fried chicken.',
  'description', 'Buttery cheddar biscuits with fresh chives. Flaky, cheesy, and perfect for any meal.',
  'category', jsonb_build_array('quick bread', 'biscuits', 'savory'),
  'tags', jsonb_build_array('biscuits', 'cheddar', 'chives', 'quick bread', 'savory'),
  'difficulty', 'beginner',
  'prep_time', '15 minutes',
  'cook_time', '12-15 minutes',
  'total_time', '30 minutes',
  'yield', '12 biscuits',
  'servings', '12',
  'equipment', jsonb_build_array('Baking sheet', 'Biscuit cutter or glass', 'Pastry cutter'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '300g', 'amount_volume', '2½ cups', 'note', null),
    jsonb_build_object('item', 'Baking powder', 'amount_metric', '15g', 'amount_volume', '1 tbsp', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '5g', 'amount_volume', '1 tsp', 'note', null),
    jsonb_build_object('item', 'Cold butter', 'amount_metric', '115g', 'amount_volume', '½ cup (1 stick)', 'note', 'cubed'),
    jsonb_build_object('item', 'Sharp cheddar', 'amount_metric', '150g', 'amount_volume', '1½ cups', 'note', 'shredded'),
    jsonb_build_object('item', 'Fresh chives', 'amount_metric', '3 tbsp', 'amount_volume', '3 tbsp', 'note', 'chopped'),
    jsonb_build_object('item', 'Buttermilk', 'amount_metric', '180g', 'amount_volume', '¾ cup', 'note', 'cold'),
    jsonb_build_object('item', 'Garlic butter', 'amount_metric', '30g butter + 1 clove', 'amount_volume', '2 tbsp butter + 1 clove', 'note', 'for brushing')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Preheat oven to 425°F (220°C).'),
    jsonb_build_object('step', 2, 'instruction', 'Whisk flour, baking powder, salt. Cut in cold butter until pea-sized pieces.'),
    jsonb_build_object('step', 3, 'instruction', 'Toss in cheddar and chives.'),
    jsonb_build_object('step', 4, 'instruction', 'Add buttermilk. Mix just until dough comes together—don''t overwork.'),
    jsonb_build_object('step', 5, 'instruction', 'Pat to 1-inch thick. Cut with 2.5-inch cutter. Place on parchment-lined sheet.'),
    jsonb_build_object('step', 6, 'instruction', 'Bake 12-15 minutes until golden.'),
    jsonb_build_object('step', 7, 'instruction', 'Brush with garlic butter immediately.')
  ),
  'tips', jsonb_build_array(
    'Everything must be COLD—cold butter, cold buttermilk, cold cheese.',
    'Don''t twist the cutter—push straight down for even rise.',
    'Extra sharp cheddar gives the best flavor.',
    'For drop biscuits, skip cutting—just scoop onto pan.'
  ),
  'seo_description', 'Buttery cheddar chive biscuits recipe. Flaky quick bread with sharp cheese, perfect for any meal.'
), updated_at = NOW()
WHERE slug = 'cheddar-chive-biscuits';

-- Jalapeño Cheddar Cornbread
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Jalapeño Cheddar Cornbread',
  'introduction', 'This Southern-meets-Southwest cornbread has just the right kick from fresh jalapeños balanced by sharp cheddar. Cast iron gives it the signature crispy crust.',
  'description', 'Spicy jalapeño cheddar cornbread with crispy cast iron crust. Southern comfort with a kick.',
  'category', jsonb_build_array('quick bread', 'cornbread', 'southern'),
  'tags', jsonb_build_array('cornbread', 'jalapeno', 'cheddar', 'southern', 'spicy'),
  'difficulty', 'beginner',
  'prep_time', '15 minutes',
  'cook_time', '25-30 minutes',
  'total_time', '45 minutes',
  'yield', '10-inch skillet',
  'servings', '10 wedges',
  'equipment', jsonb_build_array('10-inch cast iron skillet', 'Large bowl'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Yellow cornmeal', 'amount_metric', '180g', 'amount_volume', '1½ cups', 'note', 'medium grind'),
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '120g', 'amount_volume', '1 cup', 'note', null),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '50g', 'amount_volume', '¼ cup', 'note', 'optional, adjust to taste'),
    jsonb_build_object('item', 'Baking powder', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '5g', 'amount_volume', '1 tsp', 'note', null),
    jsonb_build_object('item', 'Buttermilk', 'amount_metric', '240g', 'amount_volume', '1 cup', 'note', null),
    jsonb_build_object('item', 'Eggs', 'amount_metric', '2 large', 'amount_volume', '2 large', 'note', null),
    jsonb_build_object('item', 'Butter', 'amount_metric', '60g', 'amount_volume', '4 tbsp', 'note', 'melted, plus 2 tbsp for skillet'),
    jsonb_build_object('item', 'Jalapeños', 'amount_metric', '2-3', 'amount_volume', '2-3', 'note', 'seeded and diced'),
    jsonb_build_object('item', 'Sharp cheddar', 'amount_metric', '100g', 'amount_volume', '1 cup', 'note', 'shredded')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Preheat oven to 400°F (200°C). Put 2 tbsp butter in cast iron, place in oven while preheating.'),
    jsonb_build_object('step', 2, 'instruction', 'Whisk cornmeal, flour, sugar, baking powder, salt.'),
    jsonb_build_object('step', 3, 'instruction', 'In separate bowl, whisk buttermilk, eggs, melted butter.'),
    jsonb_build_object('step', 4, 'instruction', 'Combine wet and dry. Fold in jalapeños and ¾ of the cheddar.'),
    jsonb_build_object('step', 5, 'instruction', 'Carefully remove hot skillet. Pour batter into sizzling butter.'),
    jsonb_build_object('step', 6, 'instruction', 'Top with remaining cheese.'),
    jsonb_build_object('step', 7, 'instruction', 'Bake 25-30 minutes until golden and set. Toothpick should come out clean.')
  ),
  'tips', jsonb_build_array(
    'Hot skillet is essential for crispy bottom crust.',
    'Remove seeds for less heat, leave them for more.',
    'True Southern cornbread uses no sugar—adjust to preference.',
    'Serve with honey butter or alongside chili.'
  ),
  'seo_description', 'Jalapeño cheddar cornbread recipe baked in cast iron. Crispy Southern cornbread with spicy kick.'
), updated_at = NOW()
WHERE slug = 'jalapeno-cheddar-cornbread';
