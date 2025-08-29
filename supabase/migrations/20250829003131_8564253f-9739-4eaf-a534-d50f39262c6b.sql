-- Insert Challah Bread recipe into the database
-- First, get an existing user_id from a public recipe (or use the first admin user)
DO $$
DECLARE
    recipe_user_id UUID;
BEGIN
    -- Get a user_id from existing public recipes, or fallback to first profile
    SELECT user_id INTO recipe_user_id 
    FROM recipes 
    WHERE is_public = true 
    LIMIT 1;
    
    -- If no public recipes exist, get first profile
    IF recipe_user_id IS NULL THEN
        SELECT user_id INTO recipe_user_id 
        FROM profiles 
        LIMIT 1;
    END IF;
    
    -- Insert the Challah recipe
    INSERT INTO recipes (
        user_id,
        title,
        slug,
        data,
        image_url,
        tags,
        is_public,
        folder
    ) VALUES (
        recipe_user_id,
        'Challah Bread',
        'challah-bread',
        jsonb_build_object(
            'subtitle', 'Mastering the Art of Challah: A Step-by-Step Guide to Homemade Perfection',
            'introduction', 'Challah holds a revered place in Jewish culinary heritage. Its soft, sweet crumb and golden braided crust aren''t just delicious—this bread symbolizes community, unity, and the continuity of tradition. Each braid and strand carries cultural meaning, woven together in a ritual that has been passed down through generations. Baking challah invites us not only to enjoy a wholesome loaf but also to participate in an ancient tradition that celebrates togetherness and the sanctity of special occasions.',
            'description', 'Traditional Jewish braided bread with a soft, sweet crumb and golden crust, perfect for special occasions and holidays.',
            'prep_time', '30 minutes',
            'cook_time', '35 minutes', 
            'total_time', '3-4 hours',
            'bulk_time', '1 hour 30 minutes',
            'proof_time', '30 minutes',
            'servings', '2 loaves',
            'course', 'Bread',
            'cuisine', 'Jewish',
            'difficulty', 'Intermediate',
            'equipment', ARRAY['Large mixing bowl', 'Clean kitchen towel', 'Baking sheet', 'Parchment paper', 'Wire cooling rack'],
            'ingredients', jsonb_build_array(
                jsonb_build_object('item', '1 kg bread flour (about 7 cups)', 'category', 'Flour'),
                jsonb_build_object('item', '100 g sugar (about 1/2 cup)', 'category', 'Sweetener'),
                jsonb_build_object('item', '20 g fine sea salt (about 1 tbsp)', 'category', 'Salt'),
                jsonb_build_object('item', '14 g active dry yeast (about 2 tbsp; reduce to 10 g or 1.5 tbsp if using instant yeast)', 'category', 'Leavening'),
                jsonb_build_object('item', '4 large eggs, beaten', 'category', 'Eggs'),
                jsonb_build_object('item', '100 g vegetable oil (about 1/2 cup; canola, sunflower or olive)', 'category', 'Fat'),
                jsonb_build_object('item', '440–460 g warm water (1.8–1.9 cups)', 'category', 'Liquid'),
                jsonb_build_object('item', 'Egg wash: 2 egg yolks, beaten', 'category', 'Topping'),
                jsonb_build_object('item', 'Sesame seeds (optional)', 'category', 'Topping')
            ),
            'method', jsonb_build_array(
                jsonb_build_object(
                    'title', 'Mix dry ingredients',
                    'description', 'Combine dry ingredients evenly',
                    'instructions', ARRAY['In a large bowl, combine the flour, sugar, salt, and yeast. Stir to distribute evenly.']
                ),
                jsonb_build_object(
                    'title', 'Add wet ingredients', 
                    'description', 'Form the initial dough',
                    'instructions', ARRAY['Mix in the oil and beaten eggs. Add warm water a little at a time, stirring with one hand to bring the dough together. Continue adding water until a shaggy dough forms.']
                ),
                jsonb_build_object(
                    'title', 'Knead',
                    'description', 'Develop the gluten structure',
                    'instructions', ARRAY['Turn the dough out onto a clean surface. Knead for about 10 minutes, using the heel of your hand to push and fold. The dough should become smooth and elastic, springing back when lightly pressed.']
                ),
                jsonb_build_object(
                    'title', 'First rise',
                    'description', 'Allow the dough to double in size',
                    'instructions', ARRAY['Place the dough in a lightly oiled bowl, cover with a clean towel, and let rise in a warm place until doubled in size—about 1–2 hours.']
                ),
                jsonb_build_object(
                    'title', 'Divide & braid',
                    'description', 'Shape the challah loaves',
                    'instructions', ARRAY['Punch down the dough gently to release air. Divide into equal portions (e.g., 6 strands for two loaves). Roll each portion into a long rope and braid as desired. Transfer the braided loaves to a parchment-lined baking sheet.']
                ),
                jsonb_build_object(
                    'title', 'Second rise',
                    'description', 'Final proofing before baking',
                    'instructions', ARRAY['Cover and let the braided loaves rise again for about 30 minutes. Meanwhile, preheat your oven to 180 °C (350 °F).']
                ),
                jsonb_build_object(
                    'title', 'Egg wash & topping',
                    'description', 'Prepare for baking',
                    'instructions', ARRAY['Brush the loaves gently with the beaten egg yolks. Sprinkle sesame seeds over the top if desired.']
                ),
                jsonb_build_object(
                    'title', 'Bake',
                    'description', 'Bake until golden brown',
                    'instructions', ARRAY['Bake for 30–35 minutes, or until the loaves are deeply golden and sound hollow when tapped on the bottom.']
                ),
                jsonb_build_object(
                    'title', 'Cool',
                    'description', 'Cool before serving',
                    'instructions', ARRAY['Transfer to a wire rack to cool before slicing.']
                )
            ),
            'tips', ARRAY[
                'This recipe yields two medium-sized loaves. To make one large loaf, braid all strands together and increase bake time by 5–8 minutes.',
                'The overall hydration (water plus eggs) is about 65%, which creates a tender, enriched dough. Adjust water slightly based on flour absorption and desired dough feel.',
                'Challah freezes well: wrap a cooled loaf in plastic and foil, then freeze up to one month. Thaw at room temperature before reheating.'
            ],
            'social_image_url', 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/challah-bread/xxx-facebook-post.png',
            'inline_images', jsonb_build_array(
                jsonb_build_object(
                    'url', 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/challah-bread/fbxv-facebook-post.png',
                    'alt', 'Braided challah dough sprinkled with sesame seeds ready to bake',
                    'caption', 'Braided challah dough sprinkled with sesame seeds ready to bake.'
                )
            )
        ),
        'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/general/challahfacebook-post.png',
        ARRAY['bread', 'challah', 'enriched', 'Jewish', 'holiday'],
        'Seasonal'
    )
    ON CONFLICT (user_id, slug) DO UPDATE SET
        title = EXCLUDED.title,
        data = EXCLUDED.data,
        image_url = EXCLUDED.image_url,
        tags = EXCLUDED.tags,
        updated_at = NOW();
    
END $$;