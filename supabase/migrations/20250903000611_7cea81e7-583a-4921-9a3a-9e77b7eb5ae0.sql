-- Fix security definer view issue by recreating blog_posts_public with proper permissions

-- Drop the existing view that has security definer-like behavior
DROP VIEW IF EXISTS public.blog_posts_public;

-- Recreate the view with explicit security invoker behavior
-- This ensures the view uses the permissions of the querying user, not the creator
CREATE VIEW public.blog_posts_public 
WITH (security_invoker = true)
AS 
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  bp.subtitle,
  bp.content,
  substring(bp.content, 1, 200) AS excerpt,
  bp.hero_image_url,
  bp.inline_image_url, 
  bp.social_image_url,
  bp.tags,
  bp.published_at,
  bp.created_at,
  bp.updated_at,
  p.display_name AS author_display_name
FROM public.blog_posts bp
LEFT JOIN public.profiles p ON p.user_id = bp.user_id
WHERE bp.is_draft = false 
  AND bp.published_at IS NOT NULL;

-- Grant appropriate permissions to roles
GRANT SELECT ON public.blog_posts_public TO anon, authenticated;

-- Add comment explaining the security approach
COMMENT ON VIEW public.blog_posts_public IS 
'Public view of published blog posts with security_invoker to ensure queries use caller permissions rather than view creator permissions';