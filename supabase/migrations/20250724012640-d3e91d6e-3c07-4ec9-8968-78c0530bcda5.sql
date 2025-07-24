-- Generate slugs for recipes that don't have them
UPDATE recipes 
SET slug = generate_recipe_slug(title, user_id)
WHERE user_id = '66d74ee0-b848-4b4d-b37c-6197d5d01d66' 
AND (slug IS NULL OR slug = '');