-- Enable pg_trgm extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Drop existing search functions
DROP FUNCTION IF EXISTS public.search_recipes(text, text[], text, integer, integer, text[], integer);
DROP FUNCTION IF EXISTS public.search_blog_posts(text, text[], integer);

-- Enhanced search_recipes function with full-text search and fuzzy matching
CREATE OR REPLACE FUNCTION public.search_recipes(
  search_query text,
  dietary_filters text[] DEFAULT '{}'::text[],
  difficulty_filter text DEFAULT NULL::text,
  prep_time_max integer DEFAULT NULL::integer,
  total_time_max integer DEFAULT NULL::integer,
  ingredients_filter text[] DEFAULT '{}'::text[],
  limit_count integer DEFAULT 20
)
RETURNS TABLE(
  id uuid,
  title text,
  slug text,
  image_url text,
  tags text[],
  user_id uuid,
  created_at timestamp with time zone,
  excerpt text,
  search_rank real,
  author_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- If search query is empty, return popular/featured recipes
  IF search_query IS NULL OR trim(search_query) = '' THEN
    RETURN QUERY
    SELECT 
      r.id,
      r.title,
      r.slug,
      r.image_url,
      r.tags,
      r.user_id,
      r.created_at,
      SUBSTRING(COALESCE(r.data->>'description', ''), 1, 200) as excerpt,
      1.0::real as search_rank,
      r.author_name
    FROM public.recipes r
    WHERE r.is_public = true
    ORDER BY r.created_at DESC
    LIMIT limit_count;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.slug,
    r.image_url,
    r.tags,
    r.user_id,
    r.created_at,
    SUBSTRING(COALESCE(r.data->>'description', ''), 1, 200) as excerpt,
    (
      -- Full-text search ranking
      ts_rank(
        to_tsvector('english', 
          r.title || ' ' || 
          COALESCE(r.data->>'description', '') || ' ' || 
          COALESCE(r.data->>'subtitle', '') || ' ' ||
          array_to_string(r.tags, ' ')
        ),
        plainto_tsquery('english', search_query)
      ) * 10 +
      -- Exact title match bonus (case insensitive)
      CASE WHEN lower(r.title) = lower(search_query) THEN 50.0
           WHEN lower(r.title) ILIKE '%' || lower(search_query) || '%' THEN 20.0
           ELSE 0.0
      END +
      -- Tag match bonus
      CASE WHEN EXISTS (
        SELECT 1 FROM unnest(r.tags) t 
        WHERE lower(t) ILIKE '%' || lower(search_query) || '%'
      ) THEN 15.0 ELSE 0.0 END +
      -- Fuzzy similarity bonus (trigram matching)
      (similarity(r.title, search_query) * 10)
    )::real as search_rank,
    r.author_name
  FROM public.recipes r
  WHERE 
    r.is_public = true
    AND (
      -- Full-text search match
      to_tsvector('english', 
        r.title || ' ' || 
        COALESCE(r.data->>'description', '') || ' ' || 
        COALESCE(r.data->>'subtitle', '') || ' ' ||
        array_to_string(r.tags, ' ')
      ) @@ plainto_tsquery('english', search_query)
      OR
      -- Fuzzy match (Levenshtein distance ≤ 3)
      similarity(r.title, search_query) > 0.3
      OR
      -- Partial title match
      lower(r.title) ILIKE '%' || lower(search_query) || '%'
      OR
      -- Tag match
      EXISTS (
        SELECT 1 FROM unnest(r.tags) t 
        WHERE lower(t) ILIKE '%' || lower(search_query) || '%'
      )
    )
    AND (
      dietary_filters = '{}' OR
      r.tags && dietary_filters
    )
    AND (
      difficulty_filter IS NULL OR
      r.data->>'difficulty' = difficulty_filter
    )
    AND (
      prep_time_max IS NULL OR
      (r.data->>'prepTime')::INTEGER <= prep_time_max
    )
    AND (
      total_time_max IS NULL OR
      (r.data->>'totalTime')::INTEGER <= total_time_max
    )
    AND (
      ingredients_filter = '{}' OR
      EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(r.data->'ingredients') ingredient
        WHERE ingredient ILIKE ANY (SELECT '%' || unnest(ingredients_filter) || '%')
      )
    )
  ORDER BY search_rank DESC, r.created_at DESC
  LIMIT limit_count;
END;
$function$;

-- Enhanced search_blog_posts function with full-text search and fuzzy matching
CREATE OR REPLACE FUNCTION public.search_blog_posts(
  search_query text,
  tag_filters text[] DEFAULT '{}'::text[],
  limit_count integer DEFAULT 20
)
RETURNS TABLE(
  id uuid,
  title text,
  slug text,
  subtitle text,
  hero_image_url text,
  tags text[],
  published_at timestamp with time zone,
  excerpt text,
  search_rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- If search query is empty, return recent posts
  IF search_query IS NULL OR trim(search_query) = '' THEN
    RETURN QUERY
    SELECT 
      bp.id,
      bp.title,
      bp.slug,
      bp.subtitle,
      bp.hero_image_url,
      bp.tags,
      bp.published_at,
      SUBSTRING(bp.content, 1, 200) as excerpt,
      1.0::real as search_rank
    FROM public.blog_posts bp
    WHERE 
      bp.is_draft = false
      AND bp.published_at IS NOT NULL
    ORDER BY bp.published_at DESC
    LIMIT limit_count;
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.subtitle,
    bp.hero_image_url,
    bp.tags,
    bp.published_at,
    SUBSTRING(bp.content, 1, 200) as excerpt,
    (
      -- Full-text search ranking
      ts_rank(
        to_tsvector('english', 
          bp.title || ' ' || 
          COALESCE(bp.subtitle, '') || ' ' || 
          bp.content || ' ' || 
          array_to_string(bp.tags, ' ')
        ),
        plainto_tsquery('english', search_query)
      ) * 10 +
      -- Exact title match bonus (case insensitive)
      CASE WHEN lower(bp.title) = lower(search_query) THEN 50.0
           WHEN lower(bp.title) ILIKE '%' || lower(search_query) || '%' THEN 20.0
           ELSE 0.0
      END +
      -- Tag match bonus
      CASE WHEN EXISTS (
        SELECT 1 FROM unnest(bp.tags) t 
        WHERE lower(t) ILIKE '%' || lower(search_query) || '%'
      ) THEN 15.0 ELSE 0.0 END +
      -- Fuzzy similarity bonus (trigram matching)
      (similarity(bp.title, search_query) * 10)
    )::real as search_rank
  FROM public.blog_posts bp
  WHERE 
    bp.is_draft = false
    AND bp.published_at IS NOT NULL
    AND (
      -- Full-text search match
      to_tsvector('english', 
        bp.title || ' ' || 
        COALESCE(bp.subtitle, '') || ' ' || 
        bp.content || ' ' || 
        array_to_string(bp.tags, ' ')
      ) @@ plainto_tsquery('english', search_query)
      OR
      -- Fuzzy match (Levenshtein distance ≤ 3)
      similarity(bp.title, search_query) > 0.3
      OR
      -- Partial title match
      lower(bp.title) ILIKE '%' || lower(search_query) || '%'
      OR
      -- Tag match
      EXISTS (
        SELECT 1 FROM unnest(bp.tags) t 
        WHERE lower(t) ILIKE '%' || lower(search_query) || '%'
      )
    )
    AND (
      tag_filters = '{}' OR
      bp.tags && tag_filters
    )
  ORDER BY search_rank DESC, bp.published_at DESC
  LIMIT limit_count;
END;
$function$;