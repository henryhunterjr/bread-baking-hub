-- Add updated_at column to recipes table
ALTER TABLE recipes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update the blueberry scones recipe with correct image
UPDATE recipes 
SET image_url = 'https://henrysbreadkitchen.wpcomstaging.com/wp-content/uploads/2024/07/blueberry-white-chocolate-chip-scones.jpg' 
WHERE slug = 'blueberry-lemon-scones' 
AND user_id = '66d74ee0-b848-4b4d-b37c-6197d5d01d66';