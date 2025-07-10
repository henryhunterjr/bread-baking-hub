-- Insert missing seasonal recipes with valid user_id
INSERT INTO public.recipes (title, slug, folder, tags, is_public, data, user_id) VALUES

-- Winter: Spiced Chocolate Bread
('Spiced Chocolate Bread', 'spiced-chocolate-bread', 'Seasonal', ARRAY['chocolate', 'enriched', 'holiday', 'spiced'], true, '{
  "season": "Winter",
  "holidays": ["Christmas"],
  "featuredDates": {"start": "12-01", "end": "12-31"},
  "category": ["enriched", "yeast bread"],
  "occasion": ["celebration"],
  "prepTime": "30 minutes",
  "bakeTime": "40 minutes",
  "totalTime": "3 hours",
  "difficulty": "intermediate",
  "yield": "1 loaf",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Cocoa Powder: 50g (1/2 cup)", "Warm Milk: 240ml (1 cup)", "Active Dry Yeast: 7g (2 1/4 tsp)", "Sugar: 100g (1/2 cup)", "Butter: 100g (1/2 cup), softened", "Eggs: 2", "Salt: 1 tsp", "Cinnamon: 1 tsp", "Nutmeg: 1/4 tsp", "Chocolate Chips: 150g (1 cup)"],
  "method": ["Activate yeast in milk with sugar", "Mix dry ingredients", "Combine wet and dry ingredients", "Knead 8-10 min, add chocolate last minute", "Rise 1.5-2 hours until puffy", "Shape into loaf", "Proof 45-60 min in pan", "Bake at 350°F (175°C) 35-40 min", "Cool in pan 10 min, then on rack"],
  "notes": "Cocoa may make dough seem dry - add milk if needed. For richness: Drizzle with sugar glaze. Makes excellent French toast",
  "equipment": ["9x5-inch loaf pan"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Spring: Basic Sourdough Loaf
('Basic Sourdough Loaf', 'basic-sourdough-loaf', 'Seasonal', ARRAY['sourdough', 'artisan', 'spring'], true, '{
  "season": "Spring",
  "holidays": [],
  "featuredDates": {"start": "04-01", "end": "06-30"},
  "category": ["sourdough"],
  "occasion": ["everyday"],
  "prepTime": "30 minutes",
  "bakeTime": "45 minutes",
  "totalTime": "8 hours",
  "difficulty": "intermediate",
  "yield": "1 loaf",
  "ingredients": ["All-purpose/Bread Flour: 500g", "Water: 350g", "Active Sourdough Starter: 100g", "Salt: 10g"],
  "method": ["Autolyse flour and water 1 hour", "Add starter and salt, mix thoroughly", "Bulk ferment 4-6 hours with stretch-and-folds", "Shape, place in proofing basket", "Proof 1-2 hours or overnight", "Preheat oven to 450°F (230°C) with Dutch oven", "Score, bake covered 20 min", "Uncover, bake 25-30 min", "Cool 1 hour before slicing"],
  "notes": "Starter should be at peak activity. Spring: Watch temperature fluctuations affecting fermentation",
  "equipment": ["Dutch oven", "proofing basket"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Spring: Sourdough Discard Pancakes
('Sourdough Discard Pancakes', 'sourdough-discard-pancakes', 'Seasonal', ARRAY['sourdough discard', 'quick', 'breakfast', 'spring'], true, '{
  "season": "Spring",
  "holidays": [],
  "featuredDates": {"start": "04-01", "end": "06-30"},
  "category": ["sourdough", "quick bread"],
  "occasion": ["everyday"],
  "prepTime": "15 minutes",
  "bakeTime": "15 minutes",
  "totalTime": "30 minutes",
  "difficulty": "beginner",
  "yield": "8-10 pancakes",
  "ingredients": ["Sourdough Discard: 120g (1/2 cup)", "Milk: 240ml (1 cup)", "Egg: 1", "Melted Butter/Oil: 2 tbsp", "All-purpose Flour: 150g (1 cup)", "Sugar: 2 tbsp", "Baking Powder: 1 tsp", "Baking Soda: 1/2 tsp", "Salt: 1/2 tsp", "Vanilla/Cinnamon: optional"],
  "method": ["Whisk discard, milk, egg, butter", "Mix dry ingredients separately", "Combine wet and dry, don''t overmix", "Rest batter 10-15 min", "Cook on griddle 2-3 min per side", "Serve with toppings"],
  "notes": "Works with any age discard. Spring variations: Lemon poppy seed or fresh herb. Freeze extras",
  "equipment": ["griddle/skillet"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Spring: Sourdough Discard Crackers
('Sourdough Discard Crackers', 'sourdough-discard-crackers', 'Seasonal', ARRAY['sourdough discard', 'crackers', 'snack', 'spring'], true, '{
  "season": "Spring",
  "holidays": [],
  "featuredDates": {"start": "04-01", "end": "06-30"},
  "category": ["sourdough"],
  "occasion": ["everyday"],
  "prepTime": "20 minutes",
  "bakeTime": "15 minutes",
  "totalTime": "1 hour",
  "difficulty": "beginner",
  "yield": "4 servings",
  "ingredients": ["Sourdough Discard: 200g (3/4 cup)", "All-purpose Flour: 60g (1/2 cup)", "Whole Wheat Flour: 30g (1/4 cup)", "Olive Oil: 30ml (2 tbsp)", "Salt: 1/2 tsp", "Toppings: seeds, herbs, salt"],
  "method": ["Mix dough ingredients until smooth", "Chill 30 min", "Roll very thin on parchment", "Cut, prick with fork", "Brush with oil, add toppings", "Bake at 375°F (190°C) 12-15 min", "Cool completely"],
  "notes": "Perfect for week-old discard. Spring flavors: Herb garden or lemon pepper. Store airtight 1 week",
  "equipment": ["rolling pin", "parchment paper"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Spring: Lemon & Thyme Focaccia
('Lemon & Thyme Focaccia', 'lemon-thyme-focaccia', 'Seasonal', ARRAY['focaccia', 'herbs', 'spring', 'same day'], true, '{
  "season": "Spring",
  "holidays": ["Easter"],
  "featuredDates": {"start": "04-01", "end": "06-30"},
  "category": ["yeast bread"],
  "occasion": ["celebration"],
  "prepTime": "20 minutes",
  "bakeTime": "25 minutes",
  "totalTime": "2 hours",
  "difficulty": "beginner",
  "yield": "1 large focaccia",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Warm Water: 375ml (1 1/2 cups + 1 tbsp)", "Active Dry Yeast: 7g (2 1/4 tsp)", "Olive Oil: 60ml (1/4 cup) + extra", "Fresh Thyme: 2 tbsp chopped + sprigs", "Lemon Zest: 1 tbsp", "Salt: 10g (2 tsp)", "Flaky Sea Salt: for topping"],
  "method": ["Activate yeast in water", "Mix all ingredients, knead 5-7 min", "Rise 1 hour until doubled", "Press into oiled pan, dimple surface", "Proof 30-45 min", "Preheat oven to 425°F (220°C)", "Top with oil, thyme sprigs, sea salt", "Bake 20-25 min until golden", "Add extra lemon zest before serving"],
  "notes": "Rub lemon zest into salt before adding. Spring variations: Rosemary-orange or basil-lemon. Serve with spring soups",
  "equipment": ["9x13-inch baking pan"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Spring: Wildflower Honey Wheat Bread
('Wildflower Honey Wheat Bread', 'wildflower-honey-wheat-bread', 'Seasonal', ARRAY['honey', 'whole wheat', 'spring', 'sandwich bread'], true, '{
  "season": "Spring",
  "holidays": [],
  "featuredDates": {"start": "04-01", "end": "06-30"},
  "category": ["yeast bread", "whole grain"],
  "occasion": ["everyday"],
  "prepTime": "25 minutes",
  "bakeTime": "35 minutes",
  "totalTime": "3 hours",
  "difficulty": "beginner",
  "yield": "1 loaf",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Whole Wheat Flour: 250g (2 cups)", "Warm Water: 350ml (1 1/2 cups)", "Honey: 100g (1/3 cup)", "Active Dry Yeast: 7g (2 1/4 tsp)", "Salt: 12g (1 1/2 tsp)", "Butter/Oil: 50g (1/4 cup)", "Seeds: 1 tbsp (optional)"],
  "method": ["Activate yeast with water, honey", "Mix flours and salt", "Combine wet and dry ingredients", "Knead 8-10 min until smooth", "Rise 1.5-2 hours until doubled", "Shape into loaf", "Proof 45-60 min in pan", "Bake at 375°F (190°C) 30-35 min", "Cool completely before slicing"],
  "notes": "Use local honey for best flavor. Honey keeps bread moist longer. Spring variations: Add orange zest or fresh herbs",
  "equipment": ["9x5-inch loaf pan"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Spring: Super Seeded Sourdough Loaf
('Super Seeded Sourdough Loaf', 'super-seeded-sourdough-loaf', 'Seasonal', ARRAY['sourdough', 'seeded', 'whole grain', 'overnight'], true, '{
  "season": "Spring",
  "holidays": [],
  "featuredDates": {"start": "04-01", "end": "06-30"},
  "category": ["sourdough", "whole grain"],
  "occasion": ["everyday"],
  "prepTime": "40 minutes",
  "bakeTime": "45 minutes",
  "totalTime": "18 hours",
  "difficulty": "advanced",
  "yield": "1 loaf",
  "ingredients": ["Bread Flour: 400g (3 1/3 cups)", "Whole Wheat Flour: 100g (3/4 cup)", "Water: 375g (1.6 cups)", "Active Sourdough Starter: 100g (1/2 cup)", "Salt: 10g (2 tsp)", "Seed Mix: sunflower, pumpkin, flax, sesame, chia - 125g total"],
  "method": ["Toast large seeds, cool", "Autolyse flours and water 30 min", "Add starter and salt, mix", "Perform stretch-and-folds", "Incorporate seeds during folds", "Bulk ferment 4-6 hours", "Shape, apply reserved seeds", "Proof 1-2 hours or overnight", "Bake in Dutch oven 40-45 min", "Cool completely"],
  "notes": "Toast seeds for better flavor. Hydration adjustment: Seeds absorb water - may need extra. Spring variations: Add cooked grains or dried fruits",
  "equipment": ["Dutch oven", "banneton"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Spring: Japanese Milk Bread
('Japanese Milk Bread', 'japanese-milk-bread', 'Seasonal', ARRAY['enriched', 'soft bread', 'spring'], true, '{
  "season": "Spring",
  "holidays": [],
  "featuredDates": {"start": "04-01", "end": "06-30"},
  "category": ["enriched", "yeast bread"],
  "occasion": ["everyday"],
  "prepTime": "40 minutes",
  "bakeTime": "30 minutes",
  "totalTime": "3 hours",
  "difficulty": "intermediate",
  "yield": "1 loaf or 9 rolls",
  "ingredients": ["Bread Flour: 350g (2 3/4 cups)", "Tangzhong: 120g (20g flour + 100g water)", "Cold Milk: 120ml (1/2 cup)", "Active Dry Yeast: 7g (2 1/4 tsp)", "Sugar: 30g (2 tbsp)", "Butter: 30g (2 tbsp), room temp", "Egg: 1, cold", "Salt: 4g (1 tsp)"],
  "method": ["Make tangzhong: cook flour/water to paste, cool", "Mix cold milk, yeast, sugar", "Combine all ingredients, knead 10 min", "Place bowl over ice bath, rise 1 hour", "Divide, shape into loaf or rolls", "Proof 30-45 min until puffy", "Bake at 375°F (190°C) 25-30 min", "Brush with butter after baking"],
  "notes": "Tangzhong creates soft texture. Use cold ingredients to control fermentation. Reduce yeast in hot weather",
  "equipment": ["loaf pan or baking sheet"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Summer: Brioche Hamburger Buns
('Brioche Hamburger Buns', 'brioche-hamburger-buns', 'Seasonal', ARRAY['brioche', 'summer', 'grilling', 'enriched'], true, '{
  "season": "Summer",
  "holidays": ["July 4th"],
  "featuredDates": {"start": "07-01", "end": "09-30"},
  "category": ["enriched", "yeast bread"],
  "occasion": ["celebration"],
  "prepTime": "30 minutes",
  "bakeTime": "18 minutes",
  "totalTime": "2 hours",
  "difficulty": "intermediate",
  "yield": "8-10 buns",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Cold Milk: 240ml (1 cup)", "Active Dry Yeast: 7g (2 1/4 tsp)", "Sugar: 50g (1/4 cup)", "Butter: 100g (1/2 cup), cold cubed", "Eggs: 2 cold + 1 for wash", "Salt: 10g (2 tsp)", "Sesame Seeds: optional"],
  "method": ["Mix milk, yeast, sugar until foamy", "Add eggs, flour, salt, butter cubes", "Knead 10 min until smooth", "Place bowl in ice bath, rise 1 hour", "Divide into 8-10 pieces, shape buns", "Proof 30-45 min until puffy", "Brush with egg wash, add seeds", "Bake at 375°F (190°C) 16-18 min", "Cool on rack"],
  "notes": "Ice bath controls butter temperature. Freeze extras. Variations: Everything bagel or herb seasoning",
  "equipment": ["stand mixer recommended"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Summer: Hot Dog Buns
('Hot Dog Buns', 'hot-dog-buns', 'Seasonal', ARRAY['summer', 'grilling', 'same day'], true, '{
  "season": "Summer",
  "holidays": ["July 4th"],
  "featuredDates": {"start": "07-01", "end": "09-30"},
  "category": ["yeast bread"],
  "occasion": ["celebration"],
  "prepTime": "25 minutes",
  "bakeTime": "18 minutes",
  "totalTime": "2 hours",
  "difficulty": "beginner",
  "yield": "10-12 buns",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Cold Water: 300ml (1 1/4 cups)", "Milk: 50ml (1/4 cup), cold", "Active Dry Yeast: 7g (2 1/4 tsp)", "Sugar: 50g (1/4 cup)", "Butter: 50g (1/4 cup), cold cubed", "Salt: 10g (2 tsp)", "Egg: 1 for wash", "Poppy/Sesame Seeds: optional"],
  "method": ["Mix water, milk, yeast, sugar until foamy", "Add flour, salt, butter, knead 8-10 min", "Place bowl over ice bath, rise 45-60 min", "Divide into 10-12 pieces, shape cylinders", "Proof 30-45 min until puffy", "Brush with egg wash, add seeds", "Bake at 375°F (190°C) 15-18 min", "Brush with butter after baking"],
  "notes": "Reduce proof time 25-30% in extreme heat. Add flour if sticky from humidity. Bake in cooler morning hours",
  "equipment": ["baking sheet"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Summer: Grilled Flatbread with Toppings
('Grilled Flatbread with Toppings', 'grilled-flatbread-with-toppings', 'Seasonal', ARRAY['grilled', 'summer', 'quick', 'outdoor'], true, '{
  "season": "Summer",
  "holidays": [],
  "featuredDates": {"start": "07-01", "end": "09-30"},
  "category": ["yeast bread"],
  "occasion": ["celebration"],
  "prepTime": "20 minutes",
  "bakeTime": "5 minutes",
  "totalTime": "1.5 hours",
  "difficulty": "beginner",
  "yield": "4-6 flatbreads",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Water: 325ml (1 1/3 cups)", "Active Dry Yeast: 7g (2 1/4 tsp)", "Olive Oil: 60ml (1/4 cup)", "Salt: 10g (2 tsp)", "Honey/Sugar: 10g (2 tsp)"],
  "method": ["Mix water, yeast, honey/sugar until foamy", "Add flour, salt, oil, knead 5-7 min", "Rise 30-45 min until puffy", "Divide into pieces, roll thin", "Preheat grill to medium-high", "Grill 2-3 min per side, add toppings", "Serve immediately"],
  "notes": "Keep toppings light. Summer variations: Garden fresh (tomato/basil), grilled veggie, or corn-scallion. Use skillet if no grill",
  "equipment": ["grill or skillet"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Summer: Zucchini Bread
('Zucchini Bread', 'zucchini-bread', 'Seasonal', ARRAY['quick bread', 'summer produce', 'zucchini'], true, '{
  "season": "Summer",
  "holidays": [],
  "featuredDates": {"start": "07-01", "end": "09-30"},
  "category": ["quick bread"],
  "occasion": ["everyday"],
  "prepTime": "20 minutes",
  "bakeTime": "55 minutes",
  "totalTime": "1.5 hours",
  "difficulty": "beginner",
  "yield": "1 loaf",
  "ingredients": ["All-purpose Flour: 240g (2 cups)", "Baking Soda: 1 tsp", "Baking Powder: 1 tsp", "Salt: 1/2 tsp", "Cinnamon: 1 tsp", "Nutmeg: 1/4 tsp", "Butter: 115g (1/2 cup), melted", "Sugar: 150g (3/4 cup)", "Brown Sugar: 50g (1/4 cup)", "Eggs: 2 large", "Vanilla: 2 tsp", "Zucchini: 300g (2 cups grated)"],
  "method": ["Preheat oven to 350°F (175°C), grease pan", "Grate zucchini, optionally drain", "Whisk dry ingredients", "Mix wet ingredients", "Combine wet and dry, fold in zucchini", "Pour into pan, bake 55-65 min", "Cool in pan 10 min, then on rack"],
  "notes": "Flavor improves overnight. Freezes well 3 months. Summer variations: Herbed savory version or summer squash blend",
  "equipment": ["9x5-inch loaf pan"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Summer: Spring Herb Rolls (note: listed as summer in the data)
('Spring Herb Rolls', 'spring-herb-rolls', 'Seasonal', ARRAY['dinner rolls', 'herbs', 'summer', 'same day'], true, '{
  "season": "Summer",
  "holidays": [],
  "featuredDates": {"start": "07-01", "end": "09-30"},
  "category": ["yeast bread"],
  "occasion": ["everyday"],
  "prepTime": "25 minutes",
  "bakeTime": "22 minutes",
  "totalTime": "2 hours",
  "difficulty": "beginner",
  "yield": "12 rolls",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Cold Water: 350ml (1 1/2 cups)", "Active Dry Yeast: 5g (1 1/2 tsp)", "Sugar: 50g (1/4 cup)", "Butter: 50g (1/4 cup), cold cubed", "Chopped Fresh Herbs: 3 tbsp", "Salt: 10g (2 tsp)", "Egg: 1 for wash"],
  "method": ["Set up ice bath", "Activate yeast with water/sugar", "Mix flour, salt, herbs", "Add yeast mixture, butter", "Knead 8-10 min", "Rise in cool environment 45-60 min", "Shape into 12 rolls", "Proof 25-30 min", "Brush with egg wash", "Bake at 375°F (190°C) 18-22 min"],
  "notes": "Reduced yeast for summer heat. Cold ingredients help control temperature. Herb variations: Garlic-herb or lemon-thyme",
  "equipment": ["mixing bowl", "baking sheet"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Fall: Cranberry Walnut Loaf
('Cranberry Walnut Loaf', 'cranberry-walnut-loaf', 'Seasonal', ARRAY['cranberry', 'walnut', 'holiday', 'fruit bread'], true, '{
  "season": "Fall",
  "holidays": ["Thanksgiving", "Christmas"],
  "featuredDates": {"start": "11-01", "end": "12-31"},
  "category": ["yeast bread"],
  "occasion": ["celebration"],
  "prepTime": "30 minutes",
  "bakeTime": "40 minutes",
  "totalTime": "3 hours",
  "difficulty": "intermediate",
  "yield": "1 loaf",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Whole Wheat Flour: 100g (3/4 cup)", "Water: 360ml (1 1/2 cups)", "Honey: 60g (3 tbsp)", "Active Dry Yeast: 7g (2 1/4 tsp)", "Salt: 10g (2 tsp)", "Dried Cranberries: 150g (1 cup)", "Walnuts: 100g (1 cup), chopped", "Orange Zest: 1 tbsp"],
  "method": ["Activate yeast in warm water with honey", "Mix flours, salt, orange zest", "Combine wet and dry", "Knead 8-10 min, add cranberries/walnuts last", "Rise 1.5 hours until doubled", "Shape into boule or batard", "Proof 45-60 min", "Bake at 375°F (190°C) 35-40 min", "Cool completely"],
  "notes": "Toast walnuts for deeper flavor. Soak cranberries in orange juice for plumpness. Brush with honey glaze after baking",
  "equipment": ["baking sheet"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Fall: Pumpkin Sourdough
('Pumpkin Sourdough', 'pumpkin-sourdough', 'Seasonal', ARRAY['pumpkin', 'sourdough', 'thanksgiving', 'overnight'], true, '{
  "season": "Fall",
  "holidays": ["Thanksgiving"],
  "featuredDates": {"start": "10-01", "end": "11-30"},
  "category": ["sourdough"],
  "occasion": ["celebration"],
  "prepTime": "45 minutes",
  "bakeTime": "45 minutes",
  "totalTime": "18 hours",
  "difficulty": "advanced",
  "yield": "1 loaf",
  "ingredients": ["Bread Flour: 400g (3 1/3 cups)", "Whole Wheat Flour: 100g (3/4 cup)", "Pumpkin Puree: 200g (3/4 cup)", "Water: 250g (1 cup)", "Active Sourdough Starter: 100g (1/2 cup)", "Salt: 10g (2 tsp)", "Cinnamon: 1 tsp", "Nutmeg: 1/4 tsp", "Maple Syrup: 30g (2 tbsp)"],
  "method": ["Mix flours, pumpkin puree, and water", "Autolyse 30 min", "Add starter, salt, spices, maple syrup", "Bulk ferment 4-6 hours with folds", "Shape into round loaf", "Proof 1-2 hours or overnight", "Score decorative pattern", "Bake in Dutch oven 40-45 min", "Cool completely"],
  "notes": "Adjust water based on pumpkin moisture. For scoring: Create pumpkin-shaped design. Serve with whipped honey butter",
  "equipment": ["Dutch oven", "banneton"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Fall: Apple Cider Bread
('Apple Cider Bread', 'apple-cider-bread', 'Seasonal', ARRAY['apple', 'cider', 'fall', 'fruit bread'], true, '{
  "season": "Fall",
  "holidays": ["Thanksgiving"],
  "featuredDates": {"start": "10-01", "end": "11-30"},
  "category": ["yeast bread"],
  "occasion": ["celebration"],
  "prepTime": "35 minutes",
  "bakeTime": "45 minutes",
  "totalTime": "3.5 hours",
  "difficulty": "intermediate",
  "yield": "1 loaf",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Apple Cider: 300ml (1 1/4 cups), warmed", "Active Dry Yeast: 7g (2 1/4 tsp)", "Honey: 60g (3 tbsp)", "Butter: 50g (1/4 cup), softened", "Salt: 10g (2 tsp)", "Cinnamon: 1 tsp", "Dried Apples: 100g (2/3 cup), chopped", "Walnuts: 75g (3/4 cup), chopped"],
  "method": ["Warm cider, activate yeast with honey", "Mix flour, salt, cinnamon", "Combine wet and dry ingredients", "Knead 8-10 min, add apples/walnuts last", "Rise 1.5 hours until doubled", "Shape into loaf", "Proof 45-60 min in pan", "Bake at 375°F (190°C) 40-45 min", "Brush with cider glaze while warm"],
  "notes": "Reduce cider to thick syrup for intense flavor. Toast walnuts first. Makes excellent French toast with maple syrup",
  "equipment": ["9x5-inch loaf pan"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Fall: Spiced Holiday Bread
('Spiced Holiday Bread', 'spiced-holiday-bread', 'Seasonal', ARRAY['holiday', 'spiced', 'enriched', 'gifting'], true, '{
  "season": "Fall",
  "holidays": ["Christmas"],
  "featuredDates": {"start": "12-01", "end": "12-31"},
  "category": ["enriched", "holiday bread"],
  "occasion": ["celebration", "holiday specific"],
  "prepTime": "40 minutes",
  "bakeTime": "45 minutes",
  "totalTime": "3.5 hours",
  "difficulty": "intermediate",
  "yield": "2 loaves",
  "ingredients": ["Bread Flour: 800g (6 1/2 cups)", "Milk: 360ml (1 1/2 cups), warm", "Active Dry Yeast: 14g (4 tsp)", "Honey: 120g (1/3 cup)", "Butter: 150g (2/3 cup), softened", "Eggs: 3 + 1 for wash", "Salt: 15g (1 tbsp)", "Cinnamon: 2 tsp", "Nutmeg: 1 tsp", "Cardamom: 1/2 tsp", "Dried Fruit: 200g (1 1/3 cups)"],
  "method": ["Activate yeast in warm milk with honey", "Mix dry ingredients and spices", "Combine wet ingredients", "Knead 10-12 min until smooth", "Rise 1.5 hours until doubled", "Punch down, add dried fruit", "Divide, shape into loaves", "Proof 45-60 min", "Brush with egg wash", "Bake at 350°F (175°C) 40-45 min", "Cool completely"],
  "notes": "Soak dried fruit in rum or juice for extra flavor. Decorate with icing drizzle. Makes excellent gift bread",
  "equipment": ["two 9x5-inch loaf pans"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Fall: Nutty Whole Grain Sourdough
('Nutty Whole Grain Sourdough', 'nutty-whole-grain-sourdough', 'Seasonal', ARRAY['whole grain', 'sourdough', 'nuts', 'seeds', 'overnight'], true, '{
  "season": "Fall",
  "holidays": ["Thanksgiving"],
  "featuredDates": {"start": "10-01", "end": "12-31"},
  "category": ["sourdough", "whole grain"],
  "occasion": ["celebration"],
  "prepTime": "50 minutes",
  "bakeTime": "45 minutes",
  "totalTime": "18 hours",
  "difficulty": "advanced",
  "yield": "1 loaf",
  "ingredients": ["Whole Wheat Flour: 300g (2 1/2 cups)", "Rye Flour: 100g (3/4 cup + 2 tbsp)", "Bread Flour: 100g (3/4 cup)", "Water: 350g (1 1/2 cups)", "Active Sourdough Starter: 100g (1/2 cup)", "Salt: 10g (2 tsp)", "Honey: 15g (1 tbsp)", "Walnuts: 50g (1/2 cup), toasted", "Sunflower Seeds: 30g (1/4 cup), toasted", "Flaxseeds: 20g (2 tbsp)", "Sesame Seeds: 10g (1 tbsp)"],
  "method": ["Toast nuts and seeds, cool", "Autolyse flours and water 45-60 min", "Add starter, salt, honey", "Knead briefly, add seeds during folds", "Bulk ferment 5-7 hours with folds", "Shape into boule", "Proof 1-2 hours or overnight", "Bake in Dutch oven 40-45 min", "Cool 2+ hours before slicing"],
  "notes": "Toast nuts/seeds for better flavor. Hydration adjustment may be needed. Excellent for toast with nut butters",
  "equipment": ["Dutch oven", "banneton"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66'),

-- Fall: Roasted Garlic & Rosemary Sourdough
('Roasted Garlic & Rosemary Sourdough', 'roasted-garlic-rosemary-sourdough', 'Seasonal', ARRAY['sourdough', 'garlic', 'herbs', 'holiday', 'overnight'], true, '{
  "season": "Fall",
  "holidays": ["Thanksgiving"],
  "featuredDates": {"start": "10-01", "end": "12-31"},
  "category": ["sourdough"],
  "occasion": ["celebration"],
  "prepTime": "50 minutes",
  "bakeTime": "45 minutes",
  "totalTime": "18 hours",
  "difficulty": "advanced",
  "yield": "1 loaf",
  "ingredients": ["Bread Flour: 500g (4 cups)", "Water: 375g (1.6 cups)", "Active Sourdough Starter: 100g (1/2 cup)", "Salt: 10g (2 tsp)", "Roasted Garlic: 1 head, mashed", "Fresh Rosemary: 2 tbsp chopped"],
  "method": ["Roast garlic head until soft, mash", "Autolyse flour and water 30 min", "Add starter, salt, garlic, rosemary", "Bulk ferment 4-6 hours with folds", "Shape into boule", "Proof 1-2 hours or overnight", "Stencil with flour if desired", "Bake in Dutch oven 40-45 min", "Cool completely"],
  "notes": "Roast garlic with olive oil at 400°F for 30 min. Use stencil for decorative flour pattern. Pairs well with soups",
  "equipment": ["Dutch oven", "banneton"]
}', '66d74ee0-b848-4b4d-b37c-6197d5d01d66');