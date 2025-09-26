-- Delete duplicate Black Garlic Sourdough Bread recipes
-- Keep only the one with slug 'black-garlic-sourdough-bread' (ID: 24b0e1c3-69ec-4b46-b1e7-b19c8e70a859)

DELETE FROM recipes 
WHERE title = 'Black Garlic Sourdough Bread' 
AND id != '24b0e1c3-69ec-4b46-b1e7-b19c8e70a859';