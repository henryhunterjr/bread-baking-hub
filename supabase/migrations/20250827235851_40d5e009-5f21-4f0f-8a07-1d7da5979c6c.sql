UPDATE recipes 
SET data = jsonb_set(
  jsonb_set(
    jsonb_set(
      data,
      '{ingredients}',
      '[
        "King Arthur Unbleached All-Purpose Flour: 900g (7½ cups)",
        "Lukewarm water (100°F/38°C): 680g (3 cups)", 
        "Salt: 18g (1 tbsp)",
        "Instant yeast or active dry yeast: 14g (1½ tbsp)",
        "Fresh rosemary, chopped: 3 sprigs",
        "Minced garlic: 2 tsp",
        "Shredded Parmesan cheese: 150g (~1 cup)"
      ]'::jsonb
    ),
    '{method}',
    '[
      "**Mixing the Dough (5 minutes):** In a mixing bowl, combine flour, water, yeast, and salt. Mix until all dry ingredients are incorporated. The dough will be shaggy and sticky.",
      "**30-Minute Rest:** Cover and let dough rest for 30 minutes to allow flour to absorb water and develop gluten strength.",
      "**Stretch & Folds (2 hours total):** Fold #1: Add garlic, rosemary, and Parmesan during first fold. Stretch and fold from all four sides, rest 30 minutes. Repeat 2 more times.",
      "**Cold Fermentation (Optional):** Transfer to greased bowl, refrigerate 2 hours to 48 hours for deeper flavor.",
      "**Shaping:** Remove from fridge, stretch into square, divide into 2-3 pieces. Pre-shape into balls, rest 15 minutes.",
      "**Final Shaping & Proofing:** Shape into rounds, place in bannetons, proof 45 minutes in fridge or 30 minutes at room temperature.",
      "**Baking:** Preheat Dutch oven to 475°F (245°C). Score dough, bake covered 22-25 minutes, then uncovered 12-15 minutes until golden. Internal temp should reach 200°F (93°C)."
    ]'::jsonb
  ),
  '{introduction}',
  '"This Rosemary Garlic Parmesan Bread was always a bestseller at farmers markets, holiday events, and even local restaurants. The reason? Aroma. When customers caught a whiff of the rosemary, roasted garlic, and rich Parmesan, they felt compelled to buy a loaf."'::jsonb
)
WHERE slug = 'rosemary-garlic-parmesan-loaf';