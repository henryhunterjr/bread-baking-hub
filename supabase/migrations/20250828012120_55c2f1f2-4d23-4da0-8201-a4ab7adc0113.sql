-- Insert the new Rosemary, Garlic & Parmesan Sourdough recipe
INSERT INTO recipes (
  title,
  slug,
  user_id,
  is_public,
  image_url,
  tags,
  folder,
  data
) VALUES (
  'Rosemary, Garlic & Parmesan Sourdough',
  'rosemary-garlic-parmesan-sourdough',
  '66d74ee0-b848-4b4d-b37c-6197d5d01d66', -- Henry's user ID
  true,
  'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/rosemary-garlic-parmesan-sourdough/zcgn1200-x-675-px.png',
  ARRAY['sourdough', 'herb', 'garlic', 'parmesan', 'dutch-oven', 'artisan'],
  'Featured',
  '{
    "introduction": "Fragrant rosemary and roasted garlic folded into a Parmesan-laced sourdough, built with Henry''s Fermentolyse method for maximum flavor and an open, tender crumb.",
    "description": "Artisan rosemary, garlic, and Parmesan sourdough loaves baked to perfection — rustic golden crusts with beautiful scoring, fresh rosemary garnish, and a warm, homemade feel.",
    "yield": "1 large boule (900–950 g) or 2 small boules",
    "totalTime": "24–28 hours including cold retard",
    "prepTime": "45 minutes active",
    "bakeTime": "40–45 minutes",
    "difficulty": "Intermediate",
    "category": ["sourdough", "artisan bread"],
    "season": "Year-round",
    "occasion": ["dinner party", "special occasion", "gift"],
    "social_image_url": "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/rosemary-garlic-parmesan-sourdough/zcgn1200-x-675-px.png",
    "hero_image_alt": "Two golden sourdough loaves on a wooden board, with a sprig of fresh rosemary and a rustic kitchen towel in the background.",
    "support_image_url": "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/rosemary-garlic-parmesan-sourdough/rosemary-garlic-parmigiana-1200-x-675-px.png",
    "support_image_alt": "Close-up of a rustic sourdough loaf with intricate leaf scoring, dusted with flour, resting on a soft linen cloth.",
    "ingredients": [
      "Bread flour – 90% (450 g)",
      "Whole wheat flour – 10% (50 g)", 
      "Water – 72% (360 g total; reserve 20–30 g for bassinage)",
      "Salt – 2% (10 g)",
      "Levain (100% hydration, ripe) – 20% (100 g)",
      "Roasted garlic, mashed – 40–60 g (about 1 small head)",
      "Fresh rosemary, finely chopped – 6–8 g (2–3 tsp)",
      "Finely grated Parmesan – 40–60 g"
    ],
    "method": [
      {
        "step": "Fermentolyse",
        "instruction": "In a tub, combine flours and 330–340 g water (hold back 20–30 g). Mix just to hydrate. Rest 30–45 min."
      },
      {
        "step": "Mix", 
        "instruction": "Add ripe levain and mix until evenly incorporated. Sprinkle in salt with a splash of the reserved water (bassinage) until dough feels supple and slightly tacky."
      },
      {
        "step": "Bulk & Add-ins",
        "instruction": "Bulk at 76–78°F. Perform 3–4 gentle coil folds in first 90 min. After the second fold, laminate and evenly distribute roasted garlic, rosemary, and Parmesan. Continue bulk until dough has ~60–70% rise, domed edges, and jiggle.",
        "image": "https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/rosemary-garlic-parmesan-sourdough/rosemary-garlic-parmigiana-1200-x-675-px.png"
      },
      {
        "step": "Preshape & Shape",
        "instruction": "Lightly flour, preshape round, rest 20 min. Shape a tight boule and place seam-up in a rice-floured banneton. Optional: dust and stencil for leaf scoring."
      },
      {
        "step": "Cold Retard",
        "instruction": "Cover and refrigerate 12–18 h."
      },
      {
        "step": "Bake",
        "instruction": "Preheat Dutch oven to 500°F for 45–60 min. Invert loaf on parchment, score (leaf pattern works beautifully), load, cover. Bake 20 min at 475°F covered, then 18–25 min at 450°F uncovered until deep golden and 208–210°F internal. Cool at least 1 h."
      }
    ],
    "notes": "For a cheesier profile, add 20–30 g more Parmesan in lamination; keep salt at 2% to balance. If dough tightens after add-ins, extend rest between folds by 15–20 min. Great with olive oil + cracked pepper.",
    "equipment": [
      "Large mixing bowl or tub",
      "Kitchen scale",
      "Bench scraper",
      "Round banneton or bowl with linen",
      "Dutch oven with lid",
      "Lame or sharp knife for scoring",
      "Parchment paper",
      "Instant-read thermometer"
    ],
    "schedule": {
      "day_before": "Build levain: 4–6 h at 75–78°F (ripe, domed)",
      "morning": "Fermentolyse: 30–45 min → Mix, add salt & bassinage: ~10 min → Bulk: 3–4 h with folds",
      "afternoon": "Preshape: 20 min bench rest → Final shape → banneton",
      "evening": "Cold retard: 12–18 h at 38–40°F",
      "next_day": "Bake: 40–45 minutes total"
    },
    "nutrition_per_serving": {
      "serving_size": "1/12 loaf",
      "calories": 190,
      "protein": "7g",
      "carbohydrates": "33g", 
      "fat": "3g",
      "sodium": "280mg"
    },
    "meta_title": "Rosemary, Garlic & Parmesan Sourdough (Fermentolyse)",
    "meta_description": "Artisan rosemary, garlic, and Parmesan sourdough loaves baked to perfection — rustic golden crusts with beautiful scoring, fresh rosemary garnish, and a warm, homemade feel.",
    "author_display": "Henry / Baking Great Bread"
  }'::jsonb
);