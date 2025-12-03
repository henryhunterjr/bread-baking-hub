-- Delete duplicate Henry's Marbled Sourdough Bread (keep the one without -2)
DELETE FROM recipes WHERE slug = 'henrys-marbled-sourdough-bread-2';

-- Continue Phase 3: Enhance more recipes with master baker data

-- Apple Cider Bread
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Apple Cider Bread',
  'introduction', 'This fragrant quick bread captures the essence of autumn with real apple cider and warming spices. Perfect for breakfast or an afternoon treat.',
  'description', 'A moist, aromatic quick bread made with apple cider, fresh apples, and warm spices.',
  'category', 'Quick Bread',
  'tags', ARRAY['quick-bread', 'apple', 'fall', 'breakfast', 'autumn'],
  'difficulty', 'Easy',
  'prep_time', '20 minutes',
  'cook_time', '55 minutes',
  'total_time', '1 hour 15 minutes',
  'yield', '1 loaf',
  'servings', '12',
  'equipment', ARRAY['9x5 inch loaf pan', 'mixing bowls', 'whisk', 'spatula'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '300g', 'amount_volume', '2½ cups'),
    jsonb_build_object('item', 'Apple cider', 'amount_metric', '240ml', 'amount_volume', '1 cup', 'note', 'reduced to ½ cup'),
    jsonb_build_object('item', 'Fresh apples', 'amount_metric', '200g', 'amount_volume', '1½ cups', 'note', 'peeled and diced'),
    jsonb_build_object('item', 'Brown sugar', 'amount_metric', '150g', 'amount_volume', '¾ cup'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '115g', 'amount_volume', '½ cup', 'note', 'melted'),
    jsonb_build_object('item', 'Eggs', 'amount_metric', '2 large', 'amount_volume', '2'),
    jsonb_build_object('item', 'Cinnamon', 'amount_metric', '2 tsp', 'amount_volume', '2 tsp'),
    jsonb_build_object('item', 'Nutmeg', 'amount_metric', '½ tsp', 'amount_volume', '½ tsp'),
    jsonb_build_object('item', 'Baking powder', 'amount_metric', '1½ tsp', 'amount_volume', '1½ tsp'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '½ tsp', 'amount_volume', '½ tsp')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Reduce apple cider by half by simmering in a saucepan. Cool completely.'),
    jsonb_build_object('instruction', 'Preheat oven to 350°F (175°C). Grease and flour loaf pan.'),
    jsonb_build_object('instruction', 'Whisk together flour, spices, baking powder, and salt.'),
    jsonb_build_object('instruction', 'In another bowl, combine melted butter, brown sugar, eggs, and reduced cider.'),
    jsonb_build_object('instruction', 'Add wet ingredients to dry, fold in diced apples.'),
    jsonb_build_object('instruction', 'Pour into prepared pan and bake 50-55 minutes until a toothpick comes out clean.'),
    jsonb_build_object('instruction', 'Cool in pan 10 minutes, then turn out onto rack.')
  ),
  'tips', ARRAY['Reducing the cider concentrates the apple flavor', 'Use firm apples like Honeycrisp or Granny Smith', 'Bread is even better the next day'],
  'troubleshooting', ARRAY['If too dense, don''t overmix the batter', 'If top browns too fast, tent with foil'],
  'seo_description', 'Apple cider bread recipe with fresh apples and warm spices. Perfect fall quick bread for breakfast or snacking.'
) WHERE slug = 'apple-cider-bread';

-- Blueberry Lemon Scones
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Blueberry Lemon Scones',
  'introduction', 'Tender, flaky scones studded with juicy blueberries and bright lemon zest. A bakery-worthy treat you can make at home.',
  'description', 'Light, buttery scones with fresh blueberries and lemon glaze.',
  'category', 'Scones',
  'tags', ARRAY['scones', 'blueberry', 'lemon', 'breakfast', 'brunch'],
  'difficulty', 'Easy',
  'prep_time', '20 minutes',
  'cook_time', '18 minutes',
  'total_time', '40 minutes',
  'yield', '8 scones',
  'servings', '8',
  'equipment', ARRAY['baking sheet', 'parchment paper', 'pastry cutter', 'mixing bowl'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '300g', 'amount_volume', '2½ cups'),
    jsonb_build_object('item', 'Cold butter', 'amount_metric', '115g', 'amount_volume', '½ cup', 'note', 'cubed'),
    jsonb_build_object('item', 'Fresh blueberries', 'amount_metric', '150g', 'amount_volume', '1 cup'),
    jsonb_build_object('item', 'Heavy cream', 'amount_metric', '180ml', 'amount_volume', '¾ cup'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '65g', 'amount_volume', '⅓ cup'),
    jsonb_build_object('item', 'Lemon zest', 'amount_metric', '2 tbsp', 'amount_volume', '2 tbsp'),
    jsonb_build_object('item', 'Baking powder', 'amount_metric', '1 tbsp', 'amount_volume', '1 tbsp'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '½ tsp', 'amount_volume', '½ tsp'),
    jsonb_build_object('item', 'Egg', 'amount_metric', '1 large', 'amount_volume', '1')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Preheat oven to 400°F (200°C). Line baking sheet with parchment.'),
    jsonb_build_object('instruction', 'Whisk flour, sugar, baking powder, salt, and lemon zest.'),
    jsonb_build_object('instruction', 'Cut in cold butter until mixture resembles coarse crumbs.'),
    jsonb_build_object('instruction', 'Gently fold in blueberries.'),
    jsonb_build_object('instruction', 'Whisk egg with cream, add to flour mixture, stir until just combined.'),
    jsonb_build_object('instruction', 'Pat into 8-inch circle, cut into 8 wedges, space on baking sheet.'),
    jsonb_build_object('instruction', 'Brush with cream, bake 16-18 minutes until golden.')
  ),
  'tips', ARRAY['Keep butter very cold for flaky texture', 'Freeze blueberries before adding to prevent bleeding', 'Handle dough minimally'],
  'troubleshooting', ARRAY['Dense scones? Butter wasn''t cold enough', 'Blue streaks? Berries were too warm'],
  'seo_description', 'Bakery-style blueberry lemon scones recipe. Tender, flaky, and bursting with fresh blueberries and citrus.'
) WHERE slug = 'blueberry-lemon-scones';

-- Buttermilk Potato Rolls  
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Buttermilk Potato Rolls',
  'introduction', 'These pillowy soft rolls get their incredible tenderness from mashed potatoes and tangy buttermilk. A family favorite for holiday dinners.',
  'description', 'Supremely soft dinner rolls made with mashed potatoes and buttermilk.',
  'category', 'Rolls',
  'tags', ARRAY['rolls', 'dinner-rolls', 'potato', 'buttermilk', 'holiday'],
  'difficulty', 'Intermediate',
  'prep_time', '30 minutes',
  'cook_time', '20 minutes',
  'total_time', '3 hours',
  'yield', '24 rolls',
  'servings', '24',
  'equipment', ARRAY['stand mixer', 'baking sheets', 'potato ricer or masher'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '600g', 'amount_volume', '5 cups'),
    jsonb_build_object('item', 'Mashed potatoes', 'amount_metric', '200g', 'amount_volume', '1 cup', 'note', 'cooled'),
    jsonb_build_object('item', 'Buttermilk', 'amount_metric', '240ml', 'amount_volume', '1 cup', 'note', 'warm'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '85g', 'amount_volume', '6 tbsp', 'note', 'softened'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '50g', 'amount_volume', '¼ cup'),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '1½ tsp'),
    jsonb_build_object('item', 'Eggs', 'amount_metric', '2 large', 'amount_volume', '2')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Combine warm buttermilk, sugar, and yeast. Let stand 5 minutes until foamy.'),
    jsonb_build_object('instruction', 'Add mashed potatoes, eggs, and butter to yeast mixture.'),
    jsonb_build_object('instruction', 'Add flour and salt, mix until smooth dough forms, about 8 minutes.'),
    jsonb_build_object('instruction', 'Cover and let rise 1-1½ hours until doubled.'),
    jsonb_build_object('instruction', 'Divide into 24 pieces, shape into balls, place on greased pans.'),
    jsonb_build_object('instruction', 'Cover and let rise 45 minutes until puffy.'),
    jsonb_build_object('instruction', 'Bake at 375°F (190°C) for 18-20 minutes until golden. Brush with melted butter.')
  ),
  'tips', ARRAY['Use leftover mashed potatoes or make fresh without chunks', 'Potatoes keep rolls soft for days', 'Can be made ahead and frozen'],
  'troubleshooting', ARRAY['Dense rolls? Rise times may need extending', 'Dry rolls? Don''t overbake'],
  'seo_description', 'Soft buttermilk potato rolls recipe. Pillowy dinner rolls perfect for holidays and family dinners.'
) WHERE slug = 'buttermilk-potato-rolls';