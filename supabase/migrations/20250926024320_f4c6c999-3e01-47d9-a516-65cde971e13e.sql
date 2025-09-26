-- Add author_name field to recipes table for proper attribution
ALTER TABLE recipes ADD COLUMN author_name TEXT;

-- Update the existing Black Garlic recipe with the author from the introduction
UPDATE recipes 
SET author_name = 'Delvin Tan'
WHERE slug = 'black-garlic-sourdough-bread';