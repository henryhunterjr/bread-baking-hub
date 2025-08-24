-- Set up nightly content indexing job
-- First, enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule nightly content indexing at 2 AM UTC
SELECT cron.schedule(
  'nightly-content-indexing',
  '0 2 * * *', -- Every day at 2 AM UTC
  $$
  SELECT
    net.http_post(
      url := 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/index-content',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeWNrc2t1Y25lbGp2dXF6cnN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjc0MjQxNSwiZXhwIjoyMDUyMzE4NDE1fQ.SaHaZfhfIgAGJBFWLQW99-jV7Q4hQXjSH1rkfT0pvlM"}'::jsonb,
      body := '{"type": "all"}'::jsonb
    ) as request_id;
  $$
);

-- Add some initial help content to help_topics table
INSERT INTO public.help_topics (key, title, summary, steps, audience, links) VALUES 
('save-recipe', 'How to Save a Recipe', 'Learn how to save recipes to your personal library', 
 ARRAY[
   'Navigate to any recipe on the site',
   'Click the "Save to Library" button or bookmark icon',
   'Choose a folder or leave it in the default location',
   'Access your saved recipes from "My Library" in the header'
 ], 
 ARRAY['all'], 
 ARRAY['{"url": "/my-recipe-library", "title": "My Recipe Library"}'::jsonb]
),
('format-recipe', 'How to Format a Recipe', 'Use the Recipe Workspace to format and save your own recipes',
 ARRAY[
   'Go to the Recipe Workspace from the main menu',
   'Upload an image, PDF, or paste text of your recipe',
   'Wait for AI to format your recipe automatically',
   'Review and edit the formatted recipe as needed',
   'Save the recipe to your personal library'
 ],
 ARRAY['all'],
 ARRAY['{"url": "/recipe-workspace", "title": "Recipe Workspace"}'::jsonb]
),
('workspace-guide', 'Using the Recipe Workspace', 'Complete guide to the Recipe Workspace features',
 ARRAY[
   'Upload recipe images (JPG, PNG) or PDFs up to 20MB',
   'The AI will extract ingredients, method, and timing',
   'Edit any details in the formatted recipe',
   'Add your own photos to the recipe',
   'Save to your library with custom folder organization'
 ],
 ARRAY['all'],
 ARRAY['{"url": "/recipe-workspace", "title": "Recipe Workspace"}'::jsonb]
),
('favorites-guide', 'Managing Your Favorites', 'How to favorite and organize recipes you love',
 ARRAY[
   'Click the heart icon on any recipe to add to favorites',
   'View all favorites in My Library → Favorites tab',
   'Remove favorites by clicking the heart icon again',
   'Favorites are separate from your saved recipes'
 ],
 ARRAY['all'],
 ARRAY['{"url": "/my-recipe-library", "title": "My Recipe Library"}'::jsonb]
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  steps = EXCLUDED.steps,
  updated_at = now();