-- Re-index content to ensure the sourdough recipe is properly indexed
-- First, let's check what content is already indexed
SELECT title, type, slug FROM content_items WHERE (title ILIKE '%foolproof%' OR title ILIKE '%sourdough%' OR body_text ILIKE '%foolproof%' OR body_text ILIKE '%sourdough%') ORDER BY title;