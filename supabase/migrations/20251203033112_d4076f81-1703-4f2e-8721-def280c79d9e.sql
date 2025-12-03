-- Continue enhancing more recipes

-- Classic Challah Recipe
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Classic Challah Recipe',
  'introduction', 'This traditional braided Jewish bread is enriched with eggs and honey, resulting in a tender, slightly sweet loaf perfect for Shabbat or any special occasion.',
  'description', 'Traditional braided egg bread with a golden crust and soft, pillowy interior.',
  'category', 'Enriched Bread',
  'tags', ARRAY['challah', 'jewish', 'braided', 'eggs', 'holiday', 'shabbat'],
  'difficulty', 'Intermediate',
  'prep_time', '30 minutes',
  'cook_time', '35 minutes',
  'total_time', '3 hours 30 minutes',
  'yield', '1 large loaf',
  'servings', '12',
  'equipment', ARRAY['stand mixer', 'baking sheet', 'pastry brush'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '500g', 'amount_volume', '4 cups'),
    jsonb_build_object('item', 'Eggs', 'amount_metric', '4 large', 'amount_volume', '4', 'note', 'plus 1 for wash'),
    jsonb_build_object('item', 'Honey', 'amount_metric', '80g', 'amount_volume', '¼ cup'),
    jsonb_build_object('item', 'Warm water', 'amount_metric', '120ml', 'amount_volume', '½ cup'),
    jsonb_build_object('item', 'Vegetable oil', 'amount_metric', '80ml', 'amount_volume', '⅓ cup'),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '1½ tsp'),
    jsonb_build_object('item', 'Sesame or poppy seeds', 'amount_metric', '2 tbsp', 'amount_volume', '2 tbsp', 'note', 'optional')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Combine warm water, honey, and yeast. Let stand 5 minutes.'),
    jsonb_build_object('instruction', 'Add eggs and oil to yeast mixture.'),
    jsonb_build_object('instruction', 'Add flour and salt, knead 10 minutes until smooth and elastic.'),
    jsonb_build_object('instruction', 'Cover and let rise 1½-2 hours until doubled.'),
    jsonb_build_object('instruction', 'Divide into 3 or 6 strands, braid, place on parchment-lined sheet.'),
    jsonb_build_object('instruction', 'Cover and let rise 45 minutes until puffy.'),
    jsonb_build_object('instruction', 'Brush with egg wash, sprinkle with seeds if using.'),
    jsonb_build_object('instruction', 'Bake at 350°F (175°C) for 30-35 minutes until deep golden.')
  ),
  'tips', ARRAY['Room temperature eggs incorporate better', 'Don''t over-proof or braid will lose definition', 'For extra shine, do two egg washes'],
  'troubleshooting', ARRAY['Pale crust? Egg wash was too thin', 'Dense texture? Needed more kneading time'],
  'seo_description', 'Classic challah bread recipe. Traditional braided egg bread perfect for Shabbat and holidays.'
) WHERE slug = 'classic-challah-recipe';

-- Cranberry Walnut Loaf
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Cranberry Walnut Loaf',
  'introduction', 'A rustic yeasted bread studded with tart dried cranberries and crunchy walnuts. Perfect for the holidays or toasted with butter any time.',
  'description', 'Artisan-style bread with dried cranberries and toasted walnuts.',
  'category', 'Artisan Bread',
  'tags', ARRAY['cranberry', 'walnut', 'artisan', 'holiday', 'fruit-bread'],
  'difficulty', 'Intermediate',
  'prep_time', '25 minutes',
  'cook_time', '40 minutes',
  'total_time', '4 hours',
  'yield', '1 loaf',
  'servings', '12',
  'equipment', ARRAY['dutch oven or baking stone', 'mixing bowl', 'bench scraper'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '400g', 'amount_volume', '3⅓ cups'),
    jsonb_build_object('item', 'Whole wheat flour', 'amount_metric', '100g', 'amount_volume', '¾ cup'),
    jsonb_build_object('item', 'Dried cranberries', 'amount_metric', '120g', 'amount_volume', '1 cup'),
    jsonb_build_object('item', 'Walnuts', 'amount_metric', '100g', 'amount_volume', '1 cup', 'note', 'toasted and chopped'),
    jsonb_build_object('item', 'Water', 'amount_metric', '340ml', 'amount_volume', '1⅓ cups'),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '5g', 'amount_volume', '1½ tsp'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '10g', 'amount_volume', '1½ tsp'),
    jsonb_build_object('item', 'Honey', 'amount_metric', '30g', 'amount_volume', '2 tbsp')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Mix flours, salt, and yeast. Add water and honey, mix until shaggy dough forms.'),
    jsonb_build_object('instruction', 'Knead 8-10 minutes until smooth. Add cranberries and walnuts in last 2 minutes.'),
    jsonb_build_object('instruction', 'Cover and let rise 2 hours until doubled.'),
    jsonb_build_object('instruction', 'Shape into round or oval loaf, place on parchment.'),
    jsonb_build_object('instruction', 'Cover and let rise 45 minutes.'),
    jsonb_build_object('instruction', 'Score top, bake in preheated dutch oven at 450°F (230°C) covered 25 minutes.'),
    jsonb_build_object('instruction', 'Remove lid, bake 15-20 minutes until deep golden. Internal temp 200°F (93°C).')
  ),
  'tips', ARRAY['Toast walnuts for deeper flavor', 'Soak cranberries in warm water 10 min if very dry', 'Great toasted with cream cheese'],
  'troubleshooting', ARRAY['Cranberries burning on top? Cover with foil', 'Walnuts falling out? Fold in more gently'],
  'seo_description', 'Cranberry walnut bread recipe. Rustic artisan loaf with dried cranberries and toasted walnuts.'
) WHERE slug = 'cranberry-walnut-loaf';

-- Holiday Star Cinnamon Bread
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Holiday Star Cinnamon Bread',
  'introduction', 'A stunning pull-apart star bread with layers of cinnamon sugar. This show-stopping centerpiece is as delicious as it is beautiful.',
  'description', 'Impressive twisted star bread with sweet cinnamon filling.',
  'category', 'Sweet Bread',
  'tags', ARRAY['star-bread', 'cinnamon', 'holiday', 'christmas', 'pull-apart'],
  'difficulty', 'Advanced',
  'prep_time', '45 minutes',
  'cook_time', '25 minutes',
  'total_time', '3 hours',
  'yield', '1 large star',
  'servings', '12',
  'equipment', ARRAY['rolling pin', 'large baking sheet', 'pastry brush', 'kitchen scissors'],
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'All-purpose flour', 'amount_metric', '500g', 'amount_volume', '4 cups'),
    jsonb_build_object('item', 'Milk', 'amount_metric', '240ml', 'amount_volume', '1 cup', 'note', 'warm'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '115g', 'amount_volume', '½ cup', 'note', 'softened'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '65g', 'amount_volume', '⅓ cup'),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp'),
    jsonb_build_object('item', 'Egg', 'amount_metric', '1 large', 'amount_volume', '1'),
    jsonb_build_object('item', 'Salt', 'amount_metric', '5g', 'amount_volume', '1 tsp'),
    jsonb_build_object('item', 'Cinnamon', 'amount_metric', '2 tbsp', 'amount_volume', '2 tbsp'),
    jsonb_build_object('item', 'Brown sugar', 'amount_metric', '100g', 'amount_volume', '½ cup', 'note', 'for filling')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('instruction', 'Mix warm milk, sugar, and yeast. Let stand 5 minutes.'),
    jsonb_build_object('instruction', 'Add egg, half the butter, flour, and salt. Knead 8 minutes until smooth.'),
    jsonb_build_object('instruction', 'Cover and let rise 1 hour until doubled.'),
    jsonb_build_object('instruction', 'Mix remaining butter with cinnamon and brown sugar for filling.'),
    jsonb_build_object('instruction', 'Divide dough into 4 equal pieces. Roll each into 12-inch circle.'),
    jsonb_build_object('instruction', 'Stack circles with filling between each layer.'),
    jsonb_build_object('instruction', 'Cut and twist to form star shape (see detailed instructions).'),
    jsonb_build_object('instruction', 'Let rise 30 minutes, brush with egg wash.'),
    jsonb_build_object('instruction', 'Bake at 375°F (190°C) for 22-25 minutes until golden.')
  ),
  'tips', ARRAY['Watch a video for the twisting technique', 'Work quickly so dough doesn''t over-rise', 'Use a glass to mark center before cutting'],
  'troubleshooting', ARRAY['Star points tearing? Dough may be too thin', 'Filling leaking? Seal edges well'],
  'seo_description', 'Holiday star cinnamon bread recipe. Stunning pull-apart bread with cinnamon sugar layers.'
) WHERE slug = 'holiday-star-cinnamon-bread';