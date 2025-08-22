-- Fix search_path security warnings for search functions

-- Update search_recipes function with proper security settings
CREATE OR REPLACE FUNCTION public.search_recipes(
  search_query text, 
  limit_count int default 50
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  excerpt text,
  image_url text,
  tags text[],
  search_rank real
) 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.slug,
    COALESCE((r.data->>'description')::text, '') as excerpt,
    r.image_url,
    r.tags,
    (
      -- Title matches get highest score
      CASE WHEN r.title ILIKE '%' || search_query || '%' THEN 3.0 ELSE 0.0 END +
      -- Trigram similarity for title
      similarity(r.title, search_query) * 2.0 +
      -- Description/excerpt matches
      CASE WHEN (r.data->>'description') ILIKE '%' || search_query || '%' THEN 1.5 ELSE 0.0 END +
      -- Tag matches
      CASE WHEN EXISTS (
        SELECT 1 FROM unnest(r.tags) t 
        WHERE t ILIKE '%' || search_query || '%'
      ) THEN 2.0 ELSE 0.0 END
    )::real as search_rank
  FROM recipes r
  WHERE r.is_public = true
    AND (
      r.title ILIKE '%' || search_query || '%'
      OR (r.data->>'description') ILIKE '%' || search_query || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(r.tags) t 
        WHERE t ILIKE '%' || search_query || '%'
      )
      OR similarity(r.title, search_query) > 0.1
    )
  ORDER BY search_rank DESC, r.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Update search_blog_posts function with proper security settings
CREATE OR REPLACE FUNCTION public.search_blog_posts(
  search_query text,
  limit_count int default 50
)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  excerpt text,
  hero_image_url text,
  tags text[],
  search_rank real
) 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    COALESCE(bp.excerpt, '') as excerpt,
    bp.hero_image_url,
    bp.tags,
    (
      -- Title matches get highest score
      CASE WHEN bp.title ILIKE '%' || search_query || '%' THEN 3.0 ELSE 0.0 END +
      -- Trigram similarity for title
      similarity(bp.title, search_query) * 2.0 +
      -- Excerpt matches
      CASE WHEN bp.excerpt ILIKE '%' || search_query || '%' THEN 1.5 ELSE 0.0 END +
      -- Content matches (lower weight)
      CASE WHEN bp.content ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END +
      -- Tag matches
      CASE WHEN EXISTS (
        SELECT 1 FROM unnest(bp.tags) t 
        WHERE t ILIKE '%' || search_query || '%'
      ) THEN 2.0 ELSE 0.0 END
    )::real as search_rank
  FROM blog_posts bp
  WHERE bp.is_draft = false 
    AND bp.published_at IS NOT NULL
    AND (
      bp.title ILIKE '%' || search_query || '%'
      OR bp.excerpt ILIKE '%' || search_query || '%'
      OR bp.content ILIKE '%' || search_query || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(bp.tags) t 
        WHERE t ILIKE '%' || search_query || '%'
      )
      OR similarity(bp.title, search_query) > 0.1
    )
  ORDER BY search_rank DESC, bp.published_at DESC
  LIMIT limit_count;
END;
$$;