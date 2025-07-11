-- Add a simplified AI draft with the bread scoring content
INSERT INTO public.ai_drafts (
  type,
  payload,
  run_date,
  imported,
  discarded
) VALUES (
  'blog',
  '{"blogDraft": {"title": "The Art and Science of Bread Scoring", "subtitle": "Master the essential technique that transforms your loaves from good to extraordinary", "excerpt": "Scoring bread is one of the most transformative techniques in artisan baking. Learn the essential tools, techniques, and patterns to create beautiful and functional bread.", "tags": ["bread scoring", "artisan baking", "technique", "bread making", "baking tips"], "imageUrls": ["https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/general/untitled-design.png"]}}',
  CURRENT_DATE,
  false,
  false
);