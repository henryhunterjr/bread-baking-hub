-- Update the pumpkin recipe slug to create a new URL that bypasses social media caching
UPDATE recipes 
SET slug = 'festive-pumpkin-sourdough-loaf'
WHERE slug = 'pumpkin-shaped-sourdough-loaf' AND id = '10632efc-2188-4f66-a3a4-8baa0a10d68d';