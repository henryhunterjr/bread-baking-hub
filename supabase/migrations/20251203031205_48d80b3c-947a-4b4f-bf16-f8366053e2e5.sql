
-- Master Baker Enhancement: basic-sourdough-loaf
UPDATE recipes 
SET data = jsonb_build_object(
  'title', 'Basic Sourdough Loaf',
  'introduction', 'This foundational sourdough loaf is the bread every home baker should master. With just four ingredients—flour, water, starter, and salt—you''ll create an artisan loaf with a crisp, caramelized crust and an open, tangy crumb. Perfect for sandwiches, toast, or simply torn and dipped in olive oil.',
  'description', 'A classic artisan sourdough loaf with 4 simple ingredients, crisp crust, and open crumb. Perfect for beginner and experienced bakers alike.',
  'category', jsonb_build_array('sourdough', 'artisan', 'everyday'),
  'tags', jsonb_build_array('sourdough', 'artisan bread', 'dutch oven', 'beginner-friendly', 'no commercial yeast'),
  'difficulty', 'intermediate',
  'prep_time', '30 minutes active',
  'cook_time', '45 minutes',
  'total_time', '8-10 hours (including fermentation)',
  'yield', '1 loaf (about 900g)',
  'servings', '10-12 slices',
  'season', 'year-round',
  'occasion', jsonb_build_array('everyday', 'meal prep'),
  'equipment', jsonb_build_array(
    'Dutch oven (5-qt or larger)',
    'Digital kitchen scale',
    'Banneton/proofing basket (9-inch)',
    'Bench scraper',
    'Lame or sharp razor blade',
    'Spray bottle for water',
    'Parchment paper'
  ),
  'ingredients', jsonb_build_array(
    jsonb_build_object('item', 'Bread flour (12-13% protein)', 'amount_metric', '500g', 'amount_volume', '4 cups', 'note', 'King Arthur or similar'),
    jsonb_build_object('item', 'Water', 'amount_metric', '350g', 'amount_volume', '1½ cups', 'note', 'room temperature 75-78°F'),
    jsonb_build_object('item', 'Active sourdough starter', 'amount_metric', '100g', 'amount_volume', '½ cup', 'note', 'fed 4-8 hours prior, at peak'),
    jsonb_build_object('item', 'Fine sea salt', 'amount_metric', '10g', 'amount_volume', '2 tsp', 'note', null)
  ),
  'method', jsonb_build_array(
    jsonb_build_object('step', 1, 'instruction', 'AUTOLYSE: Combine flour and water. Mix until no dry flour remains. Cover and rest 30-60 minutes.', 'timer', '30-60 min'),
    jsonb_build_object('step', 2, 'instruction', 'ADD STARTER & SALT: Add active starter and salt. Squeeze and fold until incorporated, 3-4 minutes.'),
    jsonb_build_object('step', 3, 'instruction', 'BULK FERMENTATION: Perform 4-6 stretch-and-folds over 4-6 hours, spaced 30-45 minutes apart.', 'timer', '4-6 hours'),
    jsonb_build_object('step', 4, 'instruction', 'CHECK READINESS: Dough should increase 50-75%, feel airy, show visible bubbles. Poke test leaves slow-filling indent.'),
    jsonb_build_object('step', 5, 'instruction', 'PRE-SHAPE: Turn onto unfloured surface. Shape into loose round. Rest 20-30 minutes.', 'timer', '20-30 min'),
    jsonb_build_object('step', 6, 'instruction', 'FINAL SHAPE: Fold bottom up, top down. Roll tightly creating tension. Place seam-UP in floured banneton.'),
    jsonb_build_object('step', 7, 'instruction', 'COLD PROOF: Cover and refrigerate 8-16 hours (or 1-2 hours at room temp).', 'timer', '8-16 hours'),
    jsonb_build_object('step', 8, 'instruction', 'PREHEAT: Dutch oven in oven at 500°F (260°C) for 45 minutes.', 'timer', '45 min'),
    jsonb_build_object('step', 9, 'instruction', 'SCORE & BAKE: Invert onto parchment. Score ½" deep at 30-45° angle. Lower into Dutch oven.'),
    jsonb_build_object('step', 10, 'instruction', 'COVERED BAKE: Reduce to 450°F (230°C). Bake covered 20 minutes.', 'timer', '20 min'),
    jsonb_build_object('step', 11, 'instruction', 'UNCOVERED BAKE: Remove lid. Bake 20-25 minutes until deep golden. Internal temp 205-210°F.', 'timer', '20-25 min'),
    jsonb_build_object('step', 12, 'instruction', 'COOL: Transfer to rack. Wait 1 hour minimum before cutting.', 'timer', '1 hour')
  ),
  'tips', jsonb_build_array(
    'STARTER TEST: Should double in 4-8 hours and float in water. If it sinks, wait longer.',
    'HYDRATION: 70% hydration. Reduce water by 10-20g if dough feels too wet.',
    'TEMPERATURE: Ideal dough temp 75-78°F. Use cooler water in summer, warmer in winter.',
    'SCORING: Swift, confident cuts work best. Wet blade between loaves.',
    'STORAGE: Cut-side down on board 2-3 days, or slice and freeze up to 3 months.'
  ),
  'troubleshooting', jsonb_build_array(
    jsonb_build_object('problem', 'Dense crumb', 'solution', 'Weak starter or cold fermentation. Ensure starter doubles in 4-8 hours.'),
    jsonb_build_object('problem', 'Flat loaf', 'solution', 'Over-proofed. Shorten bulk fermentation. Ensure hot Dutch oven.'),
    jsonb_build_object('problem', 'Gummy crumb', 'solution', 'Under-baked. Internal temp must reach 205°F. Cool 1 hour minimum.'),
    jsonb_build_object('problem', 'Pale crust', 'solution', 'Extend uncovered baking. Ensure full preheat.'),
    jsonb_build_object('problem', 'Hard to shape', 'solution', 'Wet hands, use bench scraper, work quickly. Or reduce hydration 5-10%.')
  ),
  'notes', 'This foundational recipe can be customized with olives, herbs, seeds, or dried fruit. For more open crumb, increase hydration to 75-80%.',
  'seo_description', 'Master classic sourdough bread with 4 ingredients. Step-by-step guide with pro tips for perfect artisan loaves at home.'
),
updated_at = NOW()
WHERE slug = 'basic-sourdough-loaf';
