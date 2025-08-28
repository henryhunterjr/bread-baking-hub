-- Update the pumpkin recipe slug to create a new URL that bypasses social media caching
UPDATE recipes 
SET slug = 'festive-pumpkin-sourdough-loaf'
WHERE slug = 'pumpkin-shaped-sourdough-loaf';