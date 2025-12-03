-- Fix remaining recipes with local /hero-images/ paths
UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/08/summer-fruit-quick-bread.jpg'
WHERE slug = 'zucchini-bread';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/08/navigating-a-rye-bread.jpg'
WHERE slug = 'pumpernickel-bread';

UPDATE recipes SET image_url = 'https://bakinggreatbread.blog/wp-content/uploads/2024/12/yeasted-dinner-rolls.jpg'
WHERE slug = 'buttermilk-potato-rolls';

-- Continue enhancing more recipes

-- Hot Dog Buns
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Hot Dog Buns',
  'introduction', 'Soft, pillowy hot dog buns that are miles better than store-bought. Perfect for summer cookouts and ballpark treats.',
  'description', 'Homemade soft hot dog buns with a light, fluffy texture.',
  'category', 'Rolls',
  'tags', ARRAY['hot-dog-buns', 'summer', 'cookout', 'bbq', 'sandwich'],
  'difficulty', 'Easy',
  'prep_time', '20 minutes',
  'cook_time', '15 minutes',
  'total_time', '2 hours 30 minutes',
  'yield', '12 buns',
  'servings', '12',
  'equipment', ARRAY['baking sheet', 'stand mixer', 'rolling pin'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '450g', 'amount_volume', '3¾ cups'),
    jsonb_build_object('item', 'Milk', 'amount_metric', '240ml', 'amount_volume', '1 cup', 'note', 'warm'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '60g', 'amount_volume', '4 tbsp', 'note', 'melted'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '50g', 'amount_volume', '¼ cup'),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp'),
    jsonb_build_object('item', 'Egg', 'amount_metric', '1 large', 'amount_volume', '1'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '8g', 'amount_volume', '1¼ tsp')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Combine warm milk, sugar, and yeast. Let stand 5 minutes.'),
    jsonb_build_object('instruction', 'Add egg, melted butter, flour, and salt. Knead 8 minutes until smooth.'),
    jsonb_build_object('instruction', 'Cover and let rise 1 hour until doubled.'),
    jsonb_build_object('instruction', 'Divide into 12 pieces, roll each into 5-inch logs.'),
    jsonb_build_object('instruction', 'Place on greased baking sheet, sides touching. Cover and rise 30 minutes.'),
    jsonb_build_object('instruction', 'Brush with egg wash, bake at 375°F (190°C) for 12-15 minutes until golden.')
  ),
  'tips', ARRAY['Buns should touch while baking for soft sides', 'Brush with butter after baking for extra soft crust', 'Freeze extras for up to 3 months'],
  'troubleshooting', ARRAY['Dense buns? Dough didn''t rise enough', 'Too crusty? Overbaked'],
  'seo_description', 'Homemade hot dog buns recipe. Soft, fluffy buns perfect for cookouts and summer grilling.'
) WHERE slug = 'hot-dog-buns';

-- Henry's Perfect Banana Nut Bread  
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Henry''s Perfect Banana Nut Bread',
  'introduction', 'My tried-and-true banana bread recipe that''s been perfected over decades. Moist, flavorful, and loaded with toasted walnuts.',
  'description', 'Classic moist banana bread with toasted walnuts and brown sugar.',
  'category', 'Quick Bread',
  'tags', ARRAY['banana-bread', 'quick-bread', 'walnuts', 'breakfast', 'classic'],
  'difficulty', 'Easy',
  'prep_time', '15 minutes',
  'cook_time', '60 minutes',
  'total_time', '1 hour 15 minutes',
  'yield', '1 loaf',
  'servings', '12',
  'equipment', ARRAY['9x5 loaf pan', 'mixing bowls', 'fork or potato masher'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Ripe bananas', 'amount_metric', '4 medium', 'amount_volume', '4', 'note', 'very ripe, spotted'),
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '250g', 'amount_volume', '2 cups'),
    jsonb_build_object('item', 'Brown sugar', 'amount_metric', '150g', 'amount_volume', '¾ cup'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '115g', 'amount_volume', '½ cup', 'note', 'melted'),
    jsonb_build_object('item', 'Walnuts', 'amount_metric', '100g', 'amount_volume', '1 cup', 'note', 'toasted and chopped'),
    jsonb_build_object('item', 'Eggs', 'amount_metric', '2 large', 'amount_volume', '2'),
    jsonb_build_object('item', 'Vanilla extract', 'amount_metric', '1 tsp', 'amount_volume', '1 tsp'),
    jsonb_build_object('item', 'Baking soda', 'amount_metric', '1 tsp', 'amount_volume', '1 tsp'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '½ tsp', 'amount_volume', '½ tsp'),
    jsonb_build_object('item', 'Cinnamon', 'amount_metric', '½ tsp', 'amount_volume', '½ tsp')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Preheat oven to 350°F (175°C). Grease loaf pan.'),
    jsonb_build_object('instruction', 'Mash bananas well in a large bowl.'),
    jsonb_build_object('instruction', 'Stir in melted butter, then eggs, sugar, and vanilla.'),
    jsonb_build_object('instruction', 'Mix flour, baking soda, salt, and cinnamon. Add to wet ingredients.'),
    jsonb_build_object('instruction', 'Fold in toasted walnuts.'),
    jsonb_build_object('instruction', 'Pour into prepared pan, bake 55-65 minutes until toothpick comes out clean.'),
    jsonb_build_object('instruction', 'Cool in pan 10 minutes before turning out.')
  ),
  'tips', ARRAY['The riper the bananas, the better the flavor', 'Freeze overripe bananas for later', 'Toast walnuts for 8 min at 350°F for best flavor'],
  'troubleshooting', ARRAY['Gummy center? Needed more baking time', 'Dry bread? Bananas weren''t ripe enough'],
  'seo_description', 'Henry''s perfect banana nut bread recipe. Moist classic banana bread with toasted walnuts.'
) WHERE slug = 'henrys-perfect-banana-nut-bread';

-- Henry's Perfect Cinnamon Swirl Bread
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Henry''s Perfect Cinnamon Swirl Bread',
  'introduction', 'A beautiful swirled bread with ribbons of cinnamon sugar throughout. Makes incredible toast and French toast.',
  'description', 'Soft white bread with a gorgeous cinnamon sugar swirl inside.',
  'category', 'Sweet Bread',
  'tags', ARRAY['cinnamon', 'swirl-bread', 'breakfast', 'toast', 'classic'],
  'difficulty', 'Intermediate',
  'prep_time', '30 minutes',
  'cook_time', '35 minutes',
  'total_time', '3 hours',
  'yield', '1 loaf',
  'servings', '12',
  'equipment', ARRAY['9x5 loaf pan', 'stand mixer', 'rolling pin'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '400g', 'amount_volume', '3¼ cups'),
    jsonb_build_object('item', 'Milk', 'amount_metric', '240ml', 'amount_volume', '1 cup', 'note', 'warm'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '60g', 'amount_volume', '4 tbsp', 'note', 'softened'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '50g', 'amount_volume', '¼ cup'),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp'),
    jsonb_build_object('item', 'Egg', 'amount_metric', '1 large', 'amount_volume', '1'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '6g', 'amount_volume', '1 tsp'),
    jsonb_build_object('item', 'Cinnamon', 'amount_metric', '2 tbsp', 'amount_volume', '2 tbsp', 'note', 'for filling'),
    jsonb_build_object('item', 'Brown sugar', 'amount_metric', '100g', 'amount_volume', '½ cup', 'note', 'for filling')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Combine warm milk, sugar, and yeast. Let stand 5 minutes.'),
    jsonb_build_object('instruction', 'Add egg, butter, flour, and salt. Knead 10 minutes until smooth.'),
    jsonb_build_object('instruction', 'Cover and let rise 1 hour until doubled.'),
    jsonb_build_object('instruction', 'Mix cinnamon and brown sugar for filling.'),
    jsonb_build_object('instruction', 'Roll dough to 16x8 inch rectangle. Brush with butter, spread filling evenly.'),
    jsonb_build_object('instruction', 'Roll up tightly from short end, pinch seam. Place in greased loaf pan.'),
    jsonb_build_object('instruction', 'Cover and let rise 45 minutes until 1 inch above pan rim.'),
    jsonb_build_object('instruction', 'Bake at 350°F (175°C) for 30-35 minutes until golden brown.')
  ),
  'tips', ARRAY['Roll tightly to prevent gaps in the swirl', 'Don''t overfill or filling will leak', 'Cool completely before slicing for clean cuts'],
  'troubleshooting', ARRAY['Swirl separating? Roll was too loose', 'Filling leaking? Too much filling or butter'],
  'seo_description', 'Henry''s cinnamon swirl bread recipe. Beautiful swirled bread perfect for toast and French toast.'
) WHERE slug = 'henrys-perfect-cinnamon-swirl-bread';