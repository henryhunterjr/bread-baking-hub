
-- Master Baker Enhancement Batch 5: Classic Breads & Focaccia

-- Classic White Sandwich Bread
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Classic White Sandwich Bread',
  'introduction', 'The bread of your childhood, perfected. This soft, slightly sweet loaf makes the ideal PB&J, grilled cheese, or morning toast. Better than store-bought, every time.',
  'description', 'Soft homemade white sandwich bread. Perfect for sandwiches, toast, and comfort food.',
  'category', jsonb_build_array('sandwich bread', 'everyday', 'beginner'),
  'tags', jsonb_build_array('sandwich bread', 'white bread', 'beginner-friendly', 'everyday'),
  'difficulty', 'beginner',
  'prep_time', '20 minutes active',
  'cook_time', '30-35 minutes',
  'total_time', '3-4 hours',
  'yield', '1 loaf (9x5 pan)',
  'servings', '12 slices',
  'equipment', jsonb_build_array('9x5 loaf pan', 'Stand mixer or hands', 'Digital scale'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '400g', 'amount_volume', '3¼ cups', 'note', 'or bread flour'),
    jsonb_build_object('item', 'Warm milk', 'amount_metric', '240g', 'amount_volume', '1 cup', 'note', '100-110°F'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '30g', 'amount_volume', '2 tbsp', 'note', 'melted'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '25g', 'amount_volume', '2 tbsp', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '6g', 'amount_volume', '1 tsp', 'note', null),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp', 'note', null)
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Combine warm milk, sugar, and yeast. Let sit 5 minutes until foamy.'),
    jsonb_build_object('step', 2, 'instruction', 'Add flour, salt, melted butter. Mix until dough forms.'),
    jsonb_build_object('step', 3, 'instruction', 'Knead 8-10 minutes until smooth and elastic.'),
    jsonb_build_object('step', 4, 'instruction', 'Rise in greased bowl 1-1.5 hours until doubled.'),
    jsonb_build_object('step', 5, 'instruction', 'Punch down. Shape into log and place in greased 9x5 loaf pan.'),
    jsonb_build_object('step', 6, 'instruction', 'Rise 45-60 minutes until dough crowns 1 inch above pan.'),
    jsonb_build_object('step', 7, 'instruction', 'Bake at 375°F (190°C) for 30-35 minutes until golden and hollow-sounding.'),
    jsonb_build_object('step', 8, 'instruction', 'Remove from pan immediately. Cool completely before slicing.')
  ),
  'tips', jsonb_build_array(
    'For softer crust, brush with butter while still warm.',
    'Don''t slice until completely cool—steam needs to escape.',
    'Store in bread bag or wrapped; stays fresh 4-5 days.'
  ),
  'seo_description', 'Classic homemade white sandwich bread recipe. Soft, tender loaf perfect for sandwiches and toast.'
), updated_at = NOW()
WHERE slug = 'classic-white-sandwich-bread';

-- Rosemary Garlic Focaccia
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Rosemary Garlic Focaccia',
  'introduction', 'This olive oil-drenched Italian flatbread features a crispy bottom, airy interior, and addictive rosemary-garlic topping. Perfect for dunking, sandwiches, or eating by itself.',
  'description', 'Classic Italian focaccia with rosemary and garlic. Crispy, olive oil-rich perfection.',
  'category', jsonb_build_array('flatbread', 'italian', 'focaccia'),
  'tags', jsonb_build_array('focaccia', 'rosemary', 'garlic', 'italian', 'olive oil'),
  'difficulty', 'beginner',
  'prep_time', '20 minutes active',
  'cook_time', '20-25 minutes',
  'total_time', '3-4 hours (including rise)',
  'yield', '1 half sheet pan',
  'servings', '12 pieces',
  'equipment', jsonb_build_array('Half sheet pan (13x18)', 'Digital scale'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '500g', 'amount_volume', '4 cups', 'note', null),
    jsonb_build_object('item', 'Warm water', 'amount_metric', '375g', 'amount_volume', '1½ cups + 2 tbsp', 'note', '100-110°F'),
    jsonb_build_object('item', 'Olive oil', 'amount_metric', '60g', 'amount_volume', '¼ cup', 'note', 'plus more for pan'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp', 'note', null),
    jsonb_build_object('item', 'Fresh rosemary', 'amount_metric', '3 tbsp', 'amount_volume', '3 tbsp', 'note', 'chopped'),
    jsonb_build_object('item', 'Garlic', 'amount_metric', '4 cloves', 'amount_volume', '4 cloves', 'note', 'sliced thin'),
    jsonb_build_object('item', 'Flaky sea salt', 'amount_metric', '1 tsp', 'amount_volume', '1 tsp', 'note', 'for topping')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Mix flour, sugar, salt, yeast. Add water and olive oil. Mix until shaggy dough.'),
    jsonb_build_object('step', 2, 'instruction', 'Let rest covered 10 minutes. Knead or fold until smooth.'),
    jsonb_build_object('step', 3, 'instruction', 'Place in oiled bowl. Rise 1.5-2 hours until doubled.'),
    jsonb_build_object('step', 4, 'instruction', 'Pour 3 tbsp olive oil into sheet pan. Transfer dough, stretch to edges.'),
    jsonb_build_object('step', 5, 'instruction', 'If dough resists, let rest 10 minutes and stretch again.'),
    jsonb_build_object('step', 6, 'instruction', 'Dimple entire surface with fingertips. Drizzle more olive oil.'),
    jsonb_build_object('step', 7, 'instruction', 'Top with rosemary, garlic, flaky salt. Let rise 30-45 minutes.'),
    jsonb_build_object('step', 8, 'instruction', 'Bake at 425°F (220°C) for 20-25 minutes until golden and crispy underneath.')
  ),
  'tips', jsonb_build_array(
    'Don''t skimp on olive oil—it creates the signature crispy bottom.',
    'Dimple aggressively to prevent large bubbles and distribute oil.',
    'Add toppings before final rise so they adhere.',
    'Best eaten same day; reheat in 400°F oven to revive crispness.'
  ),
  'seo_description', 'Classic rosemary garlic focaccia recipe. Olive oil-rich Italian flatbread with crispy bottom and airy crumb.'
), updated_at = NOW()
WHERE slug = 'rosemary-garlic-focaccia';

-- Lemon Thyme Focaccia
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Lemon and Thyme Focaccia',
  'introduction', 'A bright, aromatic twist on classic focaccia. Lemon zest and fresh thyme create a Mediterranean flavor that''s perfect with seafood, salads, or simply dipped in balsamic.',
  'description', 'Aromatic focaccia with lemon zest and fresh thyme. Mediterranean-inspired flatbread.',
  'category', jsonb_build_array('flatbread', 'italian', 'focaccia'),
  'tags', jsonb_build_array('focaccia', 'lemon', 'thyme', 'mediterranean', 'herb bread'),
  'difficulty', 'beginner',
  'prep_time', '20 minutes active',
  'cook_time', '20-25 minutes',
  'total_time', '3-4 hours',
  'yield', '1 half sheet pan',
  'servings', '12 pieces',
  'equipment', jsonb_build_array('Half sheet pan', 'Digital scale', 'Microplane/zester'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '500g', 'amount_volume', '4 cups', 'note', null),
    jsonb_build_object('item', 'Warm water', 'amount_metric', '375g', 'amount_volume', '1½ cups + 2 tbsp', 'note', null),
    jsonb_build_object('item', 'Olive oil', 'amount_metric', '60g', 'amount_volume', '¼ cup', 'note', null),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp', 'note', null),
    jsonb_build_object('item', 'Lemon zest', 'amount_metric', '2 lemons', 'amount_volume', '2 lemons', 'note', 'about 2 tbsp'),
    jsonb_build_object('item', 'Fresh thyme', 'amount_metric', '2 tbsp', 'amount_volume', '2 tbsp', 'note', 'leaves only'),
    jsonb_build_object('item', 'Flaky salt', 'amount_metric', '1 tsp', 'amount_volume', '1 tsp', 'note', null)
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Mix flour, sugar, salt, yeast, and half the lemon zest. Add water and oil.'),
    jsonb_build_object('step', 2, 'instruction', 'Mix and knead until smooth. Rise 1.5-2 hours.'),
    jsonb_build_object('step', 3, 'instruction', 'Transfer to oiled pan. Stretch to edges, dimple surface.'),
    jsonb_build_object('step', 4, 'instruction', 'Top with remaining zest, thyme, olive oil, flaky salt.'),
    jsonb_build_object('step', 5, 'instruction', 'Rise 30-45 minutes.'),
    jsonb_build_object('step', 6, 'instruction', 'Bake at 425°F (220°C) for 20-25 minutes until golden.')
  ),
  'tips', jsonb_build_array(
    'Zest only the yellow part—white pith is bitter.',
    'Add half the zest to dough, half on top for layered flavor.',
    'Pairs beautifully with grilled fish or chicken.'
  ),
  'seo_description', 'Lemon thyme focaccia recipe. Aromatic Mediterranean flatbread with bright citrus and herb flavors.'
), updated_at = NOW()
WHERE slug = 'lemon-thyme-focaccia';
