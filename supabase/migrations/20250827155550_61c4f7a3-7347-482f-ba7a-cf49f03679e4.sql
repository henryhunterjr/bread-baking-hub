-- First, get or create an admin user ID for the recipe
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Try to find an existing admin user
  SELECT user_id INTO admin_user_id 
  FROM public.profiles 
  WHERE is_admin = true 
  LIMIT 1;
  
  -- If no admin user exists, we'll use a default UUID for this system recipe
  IF admin_user_id IS NULL THEN
    admin_user_id := 'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID;
  END IF;
  
  -- Insert the pumpkin shaped sourdough loaf recipe
  INSERT INTO public.recipes (
    title,
    slug,
    user_id,
    data,
    image_url,
    tags,
    is_public,
    created_at,
    updated_at
  ) VALUES (
    'Pumpkin Shaped Sourdough Loaf',
    'pumpkin-shaped-sourdough-loaf',
    admin_user_id,
    '{
      "type": "recipe",
      "version": "1.0",
      "title": "Pumpkin Shaped Sourdough Loaf",
      "subtitle": "Festive pumpkin sourdough tied with twine and finished with a cinnamon stick stem.",
      "yield": "1 loaf (8–10 slices)",
      "times": {
        "prepTime": "PT30M",
        "bulkTime": "PT3H",
        "proofTime": "PT3H",
        "coldProof": "PT10H",
        "cookTime": "PT45M",
        "totalTimeRange": "PT6H–PT20H"
      },
      "equipment": [
        "4–5 qt Dutch oven",
        "Food-safe cotton kitchen twine (4–6 strands)",
        "Round banneton, well floured",
        "Parchment paper",
        "Lame or razor",
        "Large bowl or tub",
        "Digital scale",
        "Cinnamon stick (stem)"
      ],
      "ingredients": [
        "350 g bread flour (about 2 3/4–3 cups)",
        "100 g whole wheat flour (about 3/4–1 cup)",
        "150 g active sourdough starter, 100% hydration (about 2/3 cup)",
        "200 g pumpkin purée, unsweetened (about 3/4 cup + 1 tbsp)",
        "150–170 g water to start (about 2/3–3/4 cup)",
        "9 g fine sea salt (about 1 1/2 tsp)",
        "1–2 tsp pumpkin pie spice or cinnamon (optional)"
      ],
      "method": [
        {
          "step": 1,
          "title": "Mix & Autolyse",
          "instruction": "Whisk pumpkin purée and water (start at 150 g) until smooth, then mix in the starter. Add both flours and mix until no dry bits remain. Rest 30–40 minutes."
        },
        {
          "step": 2,
          "title": "Add Salt",
          "instruction": "Sprinkle in salt (and spice if using). Pinch and fold to incorporate until even."
        },
        {
          "step": 3,
          "title": "Bulk Fermentation",
          "instruction": "3–4 hours at 75°F/24°C. Do 3–4 coil folds in the first 2 hours. Dough should be smoother and ~50% bigger. If slack, stop adding water and add one extra coil fold."
        },
        {
          "step": 4,
          "title": "Prepare for Shaping",
          "instruction": "Cut 4–6 lengths of food-safe twine. Lay them in a star pattern on parchment. Flour the surface and banneton."
        },
        {
          "step": 5,
          "title": "Shape & Tie",
          "instruction": "Preshape a tight round. Rest 10–15 minutes. Final shape into a very tight boule. Lightly flour the top. Place the boule seam side down on the twine star. Tie each strand up and over, meeting on top. Tie gently so the dough can expand."
        },
        {
          "step": 6,
          "title": "Proof",
          "instruction": "Into the floured banneton seam down. Cover. Proof 2–4 hours at room temp or cold proof 8–12 hours at 38–40°F. The dough should pass a gentle poke test."
        },
        {
          "step": 7,
          "title": "Score",
          "instruction": "Turn out onto parchment. Dust lightly with flour. Score small leaf shapes between twine lines if desired."
        },
        {
          "step": 8,
          "title": "Bake",
          "instruction": "Preheat Dutch oven to 475°F/245°C. Load loaf. Bake 20 minutes covered. Uncover, lower to 450°F/230°C, bake 20–25 minutes to deep golden. Internal temp ~208–210°F/98–99°C."
        },
        {
          "step": 9,
          "title": "Finish",
          "instruction": "Remove twine while warm. Insert a cinnamon stick in the center as the stem. Cool fully before slicing."
        }
      ],
      "notes": [
        "If dough feels slack, keep water at 150 g, add an extra coil fold, and extend cold proof.",
        "Dust with flour before baking for bold segment contrast.",
        "Twine should be food-safe cotton. Remove before serving."
      ],
      "description": "Pumpkin sourdough shaped with kitchen twine into a pumpkin, then finished with a cinnamon stick stem. Perfect fall centerpiece bread."
    }',
    '/src/assets/recipes/pumpkin-sourdough-hero.jpg',
    ARRAY['sourdough', 'pumpkin', 'fall', 'decorative', 'holiday', 'bread'],
    true,
    now(),
    now()
  );
END $$;