
-- Master Baker Enhancement Batch 2: More Sourdough Recipes

-- Henry's Whole Wheat Sourdough
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Henry''s Whole Wheat Sourdough',
  'introduction', 'This whole wheat sourdough brings nutty, earthy depth while maintaining an open crumb. The 50% whole wheat creates a hearty bread perfect for sandwiches or alongside soups and stews.',
  'description', 'Hearty whole wheat sourdough with 50% whole grain flour. Nutty flavor with excellent sandwich structure.',
  'category', jsonb_build_array('sourdough', 'whole grain', 'healthy'),
  'tags', jsonb_build_array('sourdough', 'whole wheat', 'healthy', 'high fiber'),
  'difficulty', 'intermediate',
  'prep_time', '30 minutes active',
  'cook_time', '45-50 minutes',
  'total_time', '10-12 hours (including fermentation)',
  'yield', '1 loaf',
  'servings', '12 slices',
  'equipment', jsonb_build_array('Dutch oven', 'Digital scale', 'Banneton', 'Bench scraper', 'Lame'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '250g', 'amount_volume', '2 cups', 'note', null),
    jsonb_build_object('item', 'Whole wheat flour', 'amount_metric', '250g', 'amount_volume', '2 cups', 'note', 'freshly milled preferred'),
    jsonb_build_object('item', 'Water', 'amount_metric', '375g', 'amount_volume', '1⅔ cups', 'note', '75% hydration'),
    jsonb_build_object('item', 'Sourdough starter', 'amount_metric', '100g', 'amount_volume', '½ cup', 'note', 'active, at peak'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null)
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'AUTOLYSE: Mix flours and water. Rest 45-60 minutes. Whole wheat benefits from longer autolyse.'),
    jsonb_build_object('step', 2, 'instruction', 'MIX: Add starter and salt. Incorporate fully using squeeze and fold method.'),
    jsonb_build_object('step', 3, 'instruction', 'BULK FERMENTATION: 5-6 hours with 5-6 stretch-and-folds. Whole wheat ferments faster.'),
    jsonb_build_object('step', 4, 'instruction', 'SHAPE: Pre-shape, rest 20 min, final shape into batard or boule.'),
    jsonb_build_object('step', 5, 'instruction', 'PROOF: Cold proof 8-14 hours, or room temp 1.5-2 hours.'),
    jsonb_build_object('step', 6, 'instruction', 'BAKE: 500°F covered 20 min, then 450°F uncovered 25-30 min until 205°F internal.')
  ),
  'tips', jsonb_build_array(
    'Whole wheat absorbs more water—don''t be afraid of slightly wetter dough.',
    'Fresh-milled whole wheat gives the best flavor and rise.',
    'Shorter bulk ferment than white sourdough—whole wheat ferments faster.'
  ),
  'troubleshooting', jsonb_build_array(
    jsonb_build_object('problem', 'Dense loaf', 'solution', 'Increase hydration to 78-80%. Whole wheat needs more water.'),
    jsonb_build_object('problem', 'Bitter taste', 'solution', 'Reduce bulk ferment time. Over-fermented whole wheat turns bitter.')
  ),
  'seo_description', 'Hearty whole wheat sourdough recipe with 50% whole grain. Perfect for healthy sandwiches with nutty flavor and open crumb.'
), updated_at = NOW()
WHERE slug = 'henrys-whole-wheat-sourdough-recipe';

-- Light Sourdough Batard
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Light Sourdough Batard',
  'introduction', 'An elegant elongated loaf with a light, open crumb and crisp crust. The batard shape is perfect for dinner presentation and makes beautiful slices for bruschetta.',
  'description', 'Elegant batard-shaped sourdough with light, airy crumb perfect for dinner parties.',
  'category', jsonb_build_array('sourdough', 'artisan'),
  'tags', jsonb_build_array('sourdough', 'batard', 'artisan', 'dinner bread'),
  'difficulty', 'intermediate',
  'prep_time', '30 minutes active',
  'cook_time', '35-40 minutes',
  'total_time', '8-10 hours',
  'yield', '1 batard',
  'servings', '8-10 slices',
  'equipment', jsonb_build_array('Baking stone or steel', 'Steam pan', 'Couche or towel', 'Lame'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '400g', 'amount_volume', '3¼ cups', 'note', null),
    jsonb_build_object('item', 'Water', 'amount_metric', '280g', 'amount_volume', '1¼ cups', 'note', '70% hydration'),
    jsonb_build_object('item', 'Sourdough starter', 'amount_metric', '80g', 'amount_volume', '⅓ cup', 'note', 'active'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '8g', 'amount_volume', '1½ tsp', 'note', null),
    jsonb_build_object('item', 'Honey', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', 'optional, for tender crumb')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'AUTOLYSE: Mix flour and water 30 minutes.'),
    jsonb_build_object('step', 2, 'instruction', 'MIX: Add starter, salt, honey. Develop gluten 4-5 minutes.'),
    jsonb_build_object('step', 3, 'instruction', 'BULK: 4-5 hours with 4 folds.'),
    jsonb_build_object('step', 4, 'instruction', 'SHAPE BATARD: Pre-shape round, rest 20 min. Final shape: fold sides in, roll into torpedo.'),
    jsonb_build_object('step', 5, 'instruction', 'PROOF: Seam down on couche. Cold proof 8-12 hours.'),
    jsonb_build_object('step', 6, 'instruction', 'BAKE: Preheat stone to 500°F. Score 3 diagonal cuts. Bake with steam 15 min, then 425°F for 20-25 min.')
  ),
  'tips', jsonb_build_array(
    'Batard shaping requires tighter surface tension than boule.',
    'Score at 30° angle for proper ear formation.',
    'Steam is critical—use lava rocks, towel, or ice cubes.'
  ),
  'seo_description', 'Elegant sourdough batard recipe with light crumb. Perfect torpedo-shaped artisan bread for dinner parties.'
), updated_at = NOW()
WHERE slug = 'light-sourdough-batard';

-- Apricot Almond Sourdough
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Apricot Almond Sourdough',
  'introduction', 'Sweet dried apricots and toasted almonds transform this sourdough into a special occasion bread. Perfect for brunch, cheese boards, or toasted with butter and honey.',
  'description', 'Artisan sourdough studded with sweet apricots and crunchy toasted almonds.',
  'category', jsonb_build_array('sourdough', 'fruit bread', 'specialty'),
  'tags', jsonb_build_array('sourdough', 'fruit bread', 'almonds', 'apricots', 'brunch'),
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
    jsonb_build_object('item', 'Honey', 'amount_metric', '20g', 'amount_volume', '1 tbsp', 'note', null),
    jsonb_build_object('item', 'Dried apricots', 'amount_metric', '100g', 'amount_volume', '⅔ cup', 'note', 'chopped'),
    jsonb_build_object('item', 'Almonds', 'amount_metric', '75g', 'amount_volume', '½ cup', 'note', 'toasted, roughly chopped')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'PREP: Toast almonds at 350°F for 8-10 min. Chop apricots. Soak apricots in warm water 10 min, drain.'),
    jsonb_build_object('step', 2, 'instruction', 'AUTOLYSE: Mix flours and water. Rest 30-45 min.'),
    jsonb_build_object('step', 3, 'instruction', 'MIX: Add starter, salt, honey. Mix thoroughly.'),
    jsonb_build_object('step', 4, 'instruction', 'ADD INCLUSIONS: On 2nd or 3rd fold, laminate dough and spread fruits/nuts. Fold to encase.'),
    jsonb_build_object('step', 5, 'instruction', 'BULK: 4-5 hours with 4-5 folds.'),
    jsonb_build_object('step', 6, 'instruction', 'SHAPE: Gentle handling to keep inclusions intact. Shape into boule.'),
    jsonb_build_object('step', 7, 'instruction', 'PROOF: Cold proof 8-14 hours.'),
    jsonb_build_object('step', 8, 'instruction', 'BAKE: 475°F covered 20 min, 450°F uncovered 25 min.')
  ),
  'tips', jsonb_build_array(
    'Soaking dried apricots prevents them from burning and stealing moisture from dough.',
    'Toast almonds for deeper flavor—raw almonds taste bland.',
    'Be gentle when shaping—you want visible fruit pockets in the finished loaf.'
  ),
  'seo_description', 'Artisan apricot almond sourdough recipe. Sweet and nutty bread perfect for brunch and cheese boards.'
), updated_at = NOW()
WHERE slug = 'apricot-almond-sourdough';
