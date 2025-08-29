-- Update Challah recipe to match expected data structure
UPDATE recipes 
SET data = jsonb_build_object(
    'subtitle', 'Mastering the Art of Challah: A Step-by-Step Guide to Homemade Perfection',
    'introduction', 'Challah holds a revered place in Jewish culinary heritage. Its soft, sweet crumb and golden braided crust aren''t just delicious—this bread symbolizes community, unity, and the continuity of tradition.',
    'description', 'Traditional Jewish braided bread with a soft, sweet crumb and golden crust, perfect for special occasions and holidays.',
    'prepTime', '30 minutes',
    'bakeTime', '35 minutes', 
    'totalTime', '3-4 hours',
    'yield', '2 loaves',
    'difficulty', 'intermediate',
    'season', 'Fall',
    'category', ARRAY['enriched', 'holiday bread'],
    'holidays', ARRAY['Rosh Hashanah', 'Sabbath'],
    'occasion', ARRAY['celebration', 'holiday'],
    'equipment', ARRAY['Large mixing bowl', 'Baking sheet', 'Wire cooling rack'],
    'ingredients', ARRAY[
        'Bread Flour: 1 kg (about 7 cups)',
        'Sugar: 100g (about 1/2 cup)', 
        'Fine Sea Salt: 20g (about 1 tbsp)',
        'Active Dry Yeast: 14g (about 2 tbsp)',
        'Large Eggs: 4, beaten',
        'Vegetable Oil: 100g (about 1/2 cup)',
        'Warm Water: 440-460g (1.8-1.9 cups)',
        'Egg Wash: 2 egg yolks, beaten',
        'Sesame Seeds: optional'
    ],
    'method', ARRAY[
        'Mix dry ingredients: In a large bowl, combine the flour, sugar, salt, and yeast. Stir to distribute evenly.',
        'Add wet ingredients: Mix in the oil and beaten eggs. Add warm water a little at a time, stirring with one hand to bring the dough together. Continue adding water until a shaggy dough forms.',
        'Knead: Turn the dough out onto a clean surface. Knead for about 10 minutes, using the heel of your hand to push and fold. The dough should become smooth and elastic, springing back when lightly pressed.',
        'First rise: Place the dough in a lightly oiled bowl, cover with a clean towel, and let rise in a warm place until doubled in size—about 1–2 hours.',
        'Divide & braid: Punch down the dough gently to release air. Divide into equal portions (e.g., 6 strands for two loaves). Roll each portion into a long rope and braid as desired. Transfer the braided loaves to a parchment-lined baking sheet.',
        'Second rise: Cover and let the braided loaves rise again for about 30 minutes. Meanwhile, preheat your oven to 180°C (350°F).',
        'Egg wash & topping: Brush the loaves gently with the beaten egg yolks. Sprinkle sesame seeds over the top if desired.',
        'Bake: Bake for 30–35 minutes, or until the loaves are deeply golden and sound hollow when tapped on the bottom.',
        'Cool: Transfer to a wire rack to cool before slicing.'
    ],
    'notes', 'This recipe yields two medium-sized loaves. To make one large loaf, braid all strands together and increase bake time by 5–8 minutes. The overall hydration (water plus eggs) is about 65%, which creates a tender, enriched dough. Challah freezes well: wrap a cooled loaf in plastic and foil, then freeze up to one month.',
    'featuredDates', jsonb_build_object('start', '09-01', 'end', '11-30')
)
WHERE slug = 'challah-bread';