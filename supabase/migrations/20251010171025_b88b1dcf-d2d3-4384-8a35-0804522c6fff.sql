-- Fix Security Definer View Error
-- Drop and recreate blog_posts_public view without SECURITY DEFINER
-- Use explicit security_invoker setting to ensure proper security

DROP VIEW IF EXISTS public.blog_posts_public CASCADE;

-- Recreate view with security_invoker = true
-- This ensures queries execute with the permissions of the calling user
CREATE VIEW public.blog_posts_public 
WITH (security_invoker = true)
AS 
SELECT 
  bp.id,
  bp.title,
  bp.slug,
  SUBSTRING(bp.content, 1, 200) as excerpt,
  bp.content,
  bp.subtitle,
  bp.hero_image_url,
  bp.inline_image_url,
  bp.social_image_url,
  bp.tags,
  bp.published_at,
  bp.created_at,
  bp.updated_at,
  COALESCE(p.display_name, 'Anonymous') as author_display_name
FROM public.blog_posts bp
LEFT JOIN public.profiles p ON p.user_id = bp.user_id
WHERE bp.is_draft = false 
  AND bp.published_at IS NOT NULL;

-- Grant select permissions
GRANT SELECT ON public.blog_posts_public TO anon, authenticated;

-- Add descriptive comment
COMMENT ON VIEW public.blog_posts_public IS 
'Public view of published blog posts. Uses security_invoker to prevent privilege escalation and ensure RLS policies are respected.';
