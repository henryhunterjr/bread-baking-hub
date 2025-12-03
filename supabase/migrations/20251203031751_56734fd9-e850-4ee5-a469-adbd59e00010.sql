
-- Master Baker Enhancement Batch 3: More Sourdough + Specialty

-- Cherry Vanilla Sourdough
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Cherry Vanilla Sourdough',
  'introduction', 'Dried cherries and vanilla bean paste transform this sourdough into a dessert-worthy loaf. The cherries become jammy pockets while the vanilla adds warmth throughout.',
  'description', 'Artisan sourdough with sweet dried cherries and aromatic vanilla. Perfect for special occasions.',
  'category', jsonb_build_array('sourdough', 'fruit bread', 'specialty'),
  'tags', jsonb_build_array('sourdough', 'fruit bread', 'cherry', 'vanilla', 'special occasion'),
  'difficulty', 'advanced',
  'prep_time', '45 minutes active',
  'cook_time', '45 minutes',
  'total_time', '10-12 hours',
  'yield', '1 loaf',
  'servings', '12 slices',
  'equipment', jsonb_build_array('Dutch oven', 'Digital scale', 'Banneton'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '450g', 'amount_volume', '3⅔ cups', 'note', null),
    jsonb_build_object('item', 'Whole wheat flour', 'amount_metric', '50g', 'amount_volume', '⅓ cup', 'note', null),
    jsonb_build_object('item', 'Water', 'amount_metric', '340g', 'amount_volume', '1½ cups', 'note', null),
    jsonb_build_object('item', 'Sourdough starter', 'amount_metric', '100g', 'amount_volume', '½ cup', 'note', 'active'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Vanilla bean paste', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', 'or 1 vanilla bean, scraped'),
    jsonb_build_object('item', 'Dried cherries', 'amount_metric', '120g', 'amount_volume', '¾ cup', 'note', 'soaked and drained')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Soak dried cherries in warm water 15 minutes. Drain well.'),
    jsonb_build_object('step', 2, 'instruction', 'Autolyse flour and water 30-45 minutes.'),
    jsonb_build_object('step', 3, 'instruction', 'Add starter, salt, and vanilla paste. Mix thoroughly.'),
    jsonb_build_object('step', 4, 'instruction', 'Bulk ferment 4-5 hours with 4 folds. Add cherries on 2nd fold via lamination.'),
    jsonb_build_object('step', 5, 'instruction', 'Shape gently and cold proof 8-14 hours.'),
    jsonb_build_object('step', 6, 'instruction', 'Bake at 475°F covered 20 min, then 450°F uncovered 25 min.')
  ),
  'tips', jsonb_build_array(
    'Drain cherries well—excess moisture affects dough.',
    'Vanilla bean paste distributes better than extract.',
    'Toast a slice and top with mascarpone for dessert.'
  ),
  'seo_description', 'Cherry vanilla sourdough recipe with dried cherries and vanilla bean. Perfect artisan bread for special occasions.'
), updated_at = NOW()
WHERE slug = 'cherry-vanilla-sourdough';

-- Fig and Walnut Sourdough
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Fig and Walnut Sourdough',
  'introduction', 'Mediterranean-inspired sourdough loaded with sweet dried figs and crunchy walnuts. Pairs beautifully with aged cheeses, cured meats, or simply good olive oil.',
  'description', 'Artisan fig walnut sourdough perfect for cheese boards and Mediterranean meals.',
  'category', jsonb_build_array('sourdough', 'fruit bread', 'specialty'),
  'tags', jsonb_build_array('sourdough', 'fig', 'walnut', 'cheese board', 'mediterranean'),
  'difficulty', 'advanced',
  'prep_time', '45 minutes active',
  'cook_time', '45-50 minutes',
  'total_time', '10-12 hours',
  'yield', '1 loaf',
  'servings', '12 slices',
  'equipment', jsonb_build_array('Dutch oven', 'Digital scale', 'Banneton'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '400g', 'amount_volume', '3¼ cups', 'note', null),
    jsonb_build_object('item', 'Whole wheat flour', 'amount_metric', '100g', 'amount_volume', '¾ cup', 'note', null),
    jsonb_build_object('item', 'Water', 'amount_metric', '350g', 'amount_volume', '1½ cups', 'note', null),
    jsonb_build_object('item', 'Sourdough starter', 'amount_metric', '100g', 'amount_volume', '½ cup', 'note', 'active'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Honey', 'amount_metric', '15g', 'amount_volume', '1 tbsp', 'note', null),
    jsonb_build_object('item', 'Dried figs', 'amount_metric', '100g', 'amount_volume', '⅔ cup', 'note', 'stemmed and quartered'),
    jsonb_build_object('item', 'Walnuts', 'amount_metric', '80g', 'amount_volume', '⅔ cup', 'note', 'toasted and chopped')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Toast walnuts at 350°F for 8-10 minutes. Quarter figs.'),
    jsonb_build_object('step', 2, 'instruction', 'Autolyse flours and water 30-45 minutes.'),
    jsonb_build_object('step', 3, 'instruction', 'Add starter, salt, honey. Mix well.'),
    jsonb_build_object('step', 4, 'instruction', 'Bulk ferment 4-5 hours. Add figs and walnuts on 2nd fold.'),
    jsonb_build_object('step', 5, 'instruction', 'Shape into boule, cold proof 8-14 hours.'),
    jsonb_build_object('step', 6, 'instruction', 'Bake at 475°F covered 20 min, then 450°F uncovered 25-30 min.')
  ),
  'tips', jsonb_build_array(
    'Mission figs or Turkish figs both work well.',
    'Toasting walnuts is non-negotiable—it transforms the flavor.',
    'Serve with Manchego, Brie, or blue cheese.'
  ),
  'seo_description', 'Fig and walnut sourdough bread recipe. Mediterranean-inspired artisan loaf perfect for cheese boards.'
), updated_at = NOW()
WHERE slug = 'fig-walnut-sourdough';

-- Nutty Whole Grain Sourdough
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Nutty Whole Grain Sourdough',
  'introduction', 'A powerhouse loaf packed with seeds, oats, and whole grains. This bread is as nutritious as it is delicious, with a complex nutty flavor and hearty texture.',
  'description', 'Multi-grain sourdough loaded with seeds and whole grains. High fiber, incredible flavor.',
  'category', jsonb_build_array('sourdough', 'whole grain', 'healthy'),
  'tags', jsonb_build_array('sourdough', 'multi-grain', 'seeds', 'healthy', 'high fiber'),
  'difficulty', 'advanced',
  'prep_time', '1 hour active (including soaker)',
  'cook_time', '50 minutes',
  'total_time', '12-14 hours',
  'yield', '1 large loaf',
  'servings', '14 slices',
  'equipment', jsonb_build_array('Dutch oven', 'Digital scale', 'Banneton'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '300g', 'amount_volume', '2½ cups', 'note', null),
    jsonb_build_object('item', 'Whole wheat flour', 'amount_metric', '100g', 'amount_volume', '¾ cup', 'note', null),
    jsonb_build_object('item', 'Rye flour', 'amount_metric', '50g', 'amount_volume', '⅓ cup', 'note', null),
    jsonb_build_object('item', 'Rolled oats', 'amount_metric', '50g', 'amount_volume', '½ cup', 'note', null),
    jsonb_build_object('item', 'Water', 'amount_metric', '380g', 'amount_volume', '1⅔ cups', 'note', null),
    jsonb_build_object('item', 'Sourdough starter', 'amount_metric', '100g', 'amount_volume', '½ cup', 'note', 'active'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Sunflower seeds', 'amount_metric', '40g', 'amount_volume', '¼ cup', 'note', null),
    jsonb_build_object('item', 'Flax seeds', 'amount_metric', '30g', 'amount_volume', '3 tbsp', 'note', null),
    jsonb_build_object('item', 'Pumpkin seeds', 'amount_metric', '40g', 'amount_volume', '¼ cup', 'note', null)
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'SOAKER: Combine oats and seeds with 100g boiling water. Cover overnight.'),
    jsonb_build_object('step', 2, 'instruction', 'Autolyse flours with remaining water 45 minutes.'),
    jsonb_build_object('step', 3, 'instruction', 'Add starter, salt, and drained soaker. Mix well.'),
    jsonb_build_object('step', 4, 'instruction', 'Bulk ferment 5-6 hours with 5 folds.'),
    jsonb_build_object('step', 5, 'instruction', 'Shape, roll top in extra seeds if desired.'),
    jsonb_build_object('step', 6, 'instruction', 'Cold proof 10-16 hours.'),
    jsonb_build_object('step', 7, 'instruction', 'Bake at 475°F covered 25 min, then 425°F uncovered 25-30 min.')
  ),
  'tips', jsonb_build_array(
    'The soaker is essential—it softens seeds and prevents them from stealing moisture.',
    'Higher hydration compensates for whole grains absorbing water.',
    'Score deeply—multi-grain doughs are denser.'
  ),
  'seo_description', 'Nutty whole grain sourdough with seeds and oats. High fiber artisan bread packed with nutrition.'
), updated_at = NOW()
WHERE slug = 'nutty-whole-grain-sourdough';
