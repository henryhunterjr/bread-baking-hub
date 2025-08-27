-- Update the pumpkin sourdough recipe with correct hero image and step images
UPDATE recipes 
SET 
  image_url = 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/pumpkin-shaped-sourdough-loaf/harvest-is-near-1200-x-675-px.png',
  data = jsonb_set(
    jsonb_set(
      data,
      '{method}',
      jsonb_build_array(
        jsonb_build_object('step', 'Mix & Autolyse', 'instruction', 'Whisk pumpkin purée and water (start at 150 g) until smooth, then mix in the starter. Add both flours and mix until no dry bits remain. Rest 30–40 minutes.'),
        jsonb_build_object('step', 'Add Salt', 'instruction', 'Sprinkle in salt (and spice if using). Pinch and fold to incorporate until even.'),
        jsonb_build_object('step', 'Bulk Fermentation', 'instruction', '3–4 hours at 75°F/24°C. Do 3–4 coil folds in the first 2 hours. Dough should be smoother and ~50% bigger.'),
        jsonb_build_object('step', 'Prepare for Shaping', 'instruction', 'Cut 4–6 lengths of food-safe twine. Lay them in a star pattern on parchment. Flour the surface and banneton.', 'image', 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/pumpkin-shaped-sourdough-bread/untitled-940-x-940-px-940-x-940-px.png'),
        jsonb_build_object('step', 'Shape & Tie', 'instruction', 'Preshape a tight round. Rest 10–15 minutes. Final shape into a very tight boule. Place seam side down on the twine star. Tie each strand up and over, meeting on top. Tie gently so the dough can expand.'),
        jsonb_build_object('step', 'Proof', 'instruction', 'Into the floured banneton seam down. Cover. Proof 2–4 hours at room temp or cold proof 8–12 hours at 38–40°F. The dough should pass a gentle poke test.'),
        jsonb_build_object('step', 'Score', 'instruction', 'Turn out onto parchment. Dust lightly with flour. Score small leaf shapes between twine lines if desired.', 'image', 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/pumpkin-shaped-sourdough-bread/img3679.jpeg'),
        jsonb_build_object('step', 'Bake', 'instruction', 'Preheat Dutch oven to 475°F/245°C. Load loaf. Bake 20 minutes covered. Uncover, lower to 450°F/230°C, bake 20–25 minutes to deep golden. Internal temp ~208–210°F/98–99°C.', 'image', 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/pumpkin-shaped-sourdough-bread/harvest-is-near.png'),
        jsonb_build_object('step', 'Finish', 'instruction', 'Remove twine while warm. Insert a cinnamon stick in the center as the stem. Cool fully before slicing.')
      )
    ),
    '{social_image_url}',
    '"https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/pumpkin-shaped-sourdough-loaf/harvest-is-near-1200-x-675-px.png"'
  )
WHERE slug = 'pumpkin-shaped-sourdough-loaf';