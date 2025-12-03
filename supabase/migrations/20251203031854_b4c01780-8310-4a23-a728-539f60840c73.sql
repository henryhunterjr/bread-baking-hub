
-- Fix last staging URL
UPDATE recipes SET image_url = '/lovable-uploads/63e9053f-5c3c-4ee7-9f9e-61e590b4cfac.png' WHERE slug = 'spiced-pear-bread';

-- Master Baker Enhancement Batch 4: Enriched Breads & Rolls

-- Brioche Hamburger Buns
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Brioche Hamburger Buns',
  'introduction', 'These buttery brioche buns elevate any burger from casual to gourmet. Rich with eggs and butter, they toast beautifully and hold up to the juiciest patties.',
  'description', 'Buttery brioche hamburger buns that toast perfectly. Restaurant-quality buns at home.',
  'category', jsonb_build_array('enriched bread', 'rolls', 'burgers'),
  'tags', jsonb_build_array('brioche', 'burger buns', 'enriched', 'butter', 'eggs'),
  'difficulty', 'intermediate',
  'prep_time', '30 minutes active',
  'cook_time', '18-20 minutes',
  'total_time', '4-5 hours (including rise)',
  'yield', '8 buns',
  'servings', '8',
  'equipment', jsonb_build_array('Stand mixer with dough hook', 'Digital scale', 'Baking sheet', 'Parchment paper'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '400g', 'amount_volume', '3¼ cups', 'note', null),
    jsonb_build_object('item', 'Whole milk', 'amount_metric', '120g', 'amount_volume', '½ cup', 'note', 'warm 100-110°F'),
    jsonb_build_object('item', 'Eggs', 'amount_metric', '3 large', 'amount_volume', '3 large', 'note', 'room temperature'),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '50g', 'amount_volume', '¼ cup', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '8g', 'amount_volume', '1½ tsp', 'note', null),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp', 'note', '1 packet'),
    jsonb_build_object('item', 'Unsalted butter', 'amount_metric', '115g', 'amount_volume', '½ cup (1 stick)', 'note', 'softened, cubed'),
    jsonb_build_object('item', 'Egg wash', 'amount_metric', '1 egg + 1 tbsp milk', 'amount_volume', '1 egg + 1 tbsp milk', 'note', 'for brushing'),
    jsonb_build_object('item', 'Sesame seeds', 'amount_metric', '2 tbsp', 'amount_volume', '2 tbsp', 'note', 'optional topping')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Combine flour, sugar, salt, yeast in mixer bowl. Add warm milk and eggs.'),
    jsonb_build_object('step', 2, 'instruction', 'Mix on low 2 minutes, then medium 5-7 minutes until dough is smooth.'),
    jsonb_build_object('step', 3, 'instruction', 'Add softened butter 1 cube at a time, mixing until incorporated.'),
    jsonb_build_object('step', 4, 'instruction', 'Continue mixing 8-10 minutes until dough is silky and passes windowpane test.'),
    jsonb_build_object('step', 5, 'instruction', 'Bulk rise 1.5-2 hours until doubled.'),
    jsonb_build_object('step', 6, 'instruction', 'Divide into 8 equal pieces (about 95g each). Shape into smooth balls.'),
    jsonb_build_object('step', 7, 'instruction', 'Place on parchment-lined sheet. Flatten slightly. Proof 45-60 minutes.'),
    jsonb_build_object('step', 8, 'instruction', 'Brush with egg wash. Sprinkle sesame seeds.'),
    jsonb_build_object('step', 9, 'instruction', 'Bake at 375°F (190°C) for 18-20 minutes until golden. Internal temp 190°F.')
  ),
  'tips', jsonb_build_array(
    'Cold butter will not incorporate—it must be soft but not melted.',
    'Don''t rush the mixing—brioche needs thorough gluten development.',
    'Toast cut-side down in butter for the ultimate burger experience.',
    'Freeze extras; they thaw beautifully.'
  ),
  'troubleshooting', jsonb_build_array(
    jsonb_build_object('problem', 'Greasy, heavy dough', 'solution', 'Butter added too fast or wasn''t soft. Add slowly, mix fully between additions.'),
    jsonb_build_object('problem', 'Flat buns', 'solution', 'Over-proofed. Shorten final rise or bake immediately when puffy.')
  ),
  'seo_description', 'Buttery brioche hamburger buns recipe. Soft, rich buns that toast perfectly for gourmet burgers at home.'
), updated_at = NOW()
WHERE slug = 'brioche-hamburger-buns';

-- Hot Cross Buns
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Hot Cross Buns',
  'introduction', 'These traditional Easter buns are spiced with cinnamon and studded with currants. The signature cross is piped on before baking, and a sticky glaze gives them shine.',
  'description', 'Traditional spiced Easter buns with currants and iced cross. Classic holiday bread.',
  'category', jsonb_build_array('enriched bread', 'holiday', 'sweet rolls'),
  'tags', jsonb_build_array('hot cross buns', 'easter', 'spiced', 'currants', 'traditional'),
  'difficulty', 'intermediate',
  'prep_time', '45 minutes active',
  'cook_time', '20-25 minutes',
  'total_time', '4-5 hours',
  'yield', '12 buns',
  'servings', '12',
  'equipment', jsonb_build_array('Stand mixer', 'Digital scale', '9x13 baking pan', 'Piping bag'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '450g', 'amount_volume', '3⅔ cups', 'note', null),
    jsonb_build_object('item', 'Whole milk', 'amount_metric', '240g', 'amount_volume', '1 cup', 'note', 'warm'),
    jsonb_build_object('item', 'Butter', 'amount_metric', '60g', 'amount_volume', '4 tbsp', 'note', 'softened'),
    jsonb_build_object('item', 'Eggs', 'amount_metric', '2 large', 'amount_volume', '2 large', 'note', null),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '75g', 'amount_volume', '⅓ cup', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '6g', 'amount_volume', '1 tsp', 'note', null),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '7g', 'amount_volume', '2¼ tsp', 'note', null),
    jsonb_build_object('item', 'Cinnamon', 'amount_metric', '2 tsp', 'amount_volume', '2 tsp', 'note', null),
    jsonb_build_object('item', 'Mixed spice', 'amount_metric', '1 tsp', 'amount_volume', '1 tsp', 'note', 'or allspice + nutmeg'),
    jsonb_build_object('item', 'Currants', 'amount_metric', '150g', 'amount_volume', '1 cup', 'note', 'or raisins'),
    jsonb_build_object('item', 'Cross paste', 'amount_metric', '60g flour + 60g water', 'amount_volume', '½ cup flour + ¼ cup water', 'note', 'mix to thick paste'),
    jsonb_build_object('item', 'Glaze', 'amount_metric', '2 tbsp apricot jam + 1 tbsp water', 'amount_volume', '2 tbsp jam + 1 tbsp water', 'note', 'warmed')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'Combine flour, sugar, salt, yeast, spices. Add warm milk, eggs, butter. Mix until smooth dough forms.'),
    jsonb_build_object('step', 2, 'instruction', 'Knead 8-10 minutes. Add currants, knead to distribute.'),
    jsonb_build_object('step', 3, 'instruction', 'Bulk rise 1.5-2 hours until doubled.'),
    jsonb_build_object('step', 4, 'instruction', 'Divide into 12 pieces (about 75g each). Shape into balls.'),
    jsonb_build_object('step', 5, 'instruction', 'Arrange in greased 9x13 pan. Proof 45-60 minutes.'),
    jsonb_build_object('step', 6, 'instruction', 'Pipe cross paste in lines across buns.'),
    jsonb_build_object('step', 7, 'instruction', 'Bake at 375°F (190°C) for 20-25 minutes until golden.'),
    jsonb_build_object('step', 8, 'instruction', 'Brush with warm apricot glaze immediately.')
  ),
  'tips', jsonb_build_array(
    'Soak currants in warm water or orange juice for plumper fruit.',
    'Cross paste should be thick enough to hold shape but pipeable.',
    'Best served warm, split and toasted with butter.'
  ),
  'seo_description', 'Traditional hot cross buns recipe with spices and currants. Perfect Easter bread with signature iced cross.'
), updated_at = NOW()
WHERE slug = 'hot-cross-buns';

-- Japanese Milk Bread (Shokupan)
UPDATE recipes SET data = jsonb_build_object(
  'title', 'Japanese Milk Bread (Shokupan)',
  'introduction', 'This impossibly soft, pillowy bread uses the tangzhong technique—a cooked flour paste that traps moisture for days. The result is bread so tender it practically melts.',
  'description', 'Ultra-soft Japanese milk bread using tangzhong method. Cloud-like texture that stays fresh.',
  'category', jsonb_build_array('enriched bread', 'asian', 'sandwich bread'),
  'tags', jsonb_build_array('shokupan', 'milk bread', 'tangzhong', 'japanese', 'soft bread'),
  'difficulty', 'intermediate',
  'prep_time', '30 minutes active',
  'cook_time', '35-40 minutes',
  'total_time', '4-5 hours',
  'yield', '1 loaf (9x5 pan)',
  'servings', '12 slices',
  'equipment', jsonb_build_array('Stand mixer', 'Digital scale', '9x5 loaf pan', 'Small saucepan'),
  'ingredients', jsonb_build_array(
    jsonb_build_object('header', 'Tangzhong (cook first)'),
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '25g', 'amount_volume', '3 tbsp', 'note', null),
    jsonb_build_object('item', 'Milk', 'amount_metric', '120g', 'amount_volume', '½ cup', 'note', null),
    jsonb_build_object('header', 'Dough'),
    jsonb_build_object('item', 'Bread flour', 'amount_metric', '350g', 'amount_volume', '2¾ cups', 'note', null),
    jsonb_build_object('item', 'Sugar', 'amount_metric', '50g', 'amount_volume', '¼ cup', 'note', null),
    jsonb_build_object('item', 'Salt', 'amount_metric', '6g', 'amount_volume', '1 tsp', 'note', null),
    jsonb_build_object('item', 'Instant yeast', 'amount_metric', '5g', 'amount_volume', '1½ tsp', 'note', null),
    jsonb_build_object('item', 'Milk', 'amount_metric', '100g', 'amount_volume', '⅓ cup + 2 tbsp', 'note', 'warm'),
    jsonb_build_object('item', 'Egg', 'amount_metric', '1 large', 'amount_volume', '1 large', 'note', null),
    jsonb_build_object('item', 'Butter', 'amount_metric', '40g', 'amount_volume', '3 tbsp', 'note', 'softened')
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'TANGZHONG: Whisk flour and milk in saucepan. Cook over medium heat, stirring constantly, until thick paste forms (65°C/150°F). Cool to room temp.'),
    jsonb_build_object('step', 2, 'instruction', 'Combine flour, sugar, salt, yeast in mixer. Add warm milk, egg, and cooled tangzhong.'),
    jsonb_build_object('step', 3, 'instruction', 'Mix on low until combined, then medium 5 minutes. Add butter, mix 8-10 minutes until silky.'),
    jsonb_build_object('step', 4, 'instruction', 'Bulk rise 1.5-2 hours until doubled.'),
    jsonb_build_object('step', 5, 'instruction', 'Divide into 3 equal pieces. Roll each into oval, fold in thirds, roll into cylinder.'),
    jsonb_build_object('step', 6, 'instruction', 'Place side by side in greased loaf pan. Proof 45-60 minutes until dough crowns above pan.'),
    jsonb_build_object('step', 7, 'instruction', 'Bake at 350°F (175°C) for 35-40 minutes. Tent with foil if browning too fast.'),
    jsonb_build_object('step', 8, 'instruction', 'Turn out immediately. Cool before slicing.')
  ),
  'tips', jsonb_build_array(
    'Tangzhong must cool completely or it will kill the yeast.',
    'Don''t overbake—this bread should be pale golden, not dark.',
    'The three-piece shaping creates the signature pull-apart strands.',
    'Stays soft 4-5 days stored in airtight container.'
  ),
  'seo_description', 'Japanese milk bread (Shokupan) recipe using tangzhong method. Ultra-soft, pillowy texture that stays fresh for days.'
), updated_at = NOW()
WHERE slug = 'japanese-milk-bread';
