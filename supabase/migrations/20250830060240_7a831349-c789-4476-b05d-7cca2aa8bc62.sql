-- Security Migration: Fix Function Search Paths and Extensions
-- This migration addresses multiple security warnings from the linter

-- 1. Fix Function Search Paths - Set search_path for security definer functions
-- Recreate functions with explicit search_path to prevent search path hijacking

CREATE OR REPLACE FUNCTION public.search_recipes(search_query text, limit_count integer DEFAULT 50)
RETURNS TABLE(id uuid, title text, slug text, excerpt text, image_url text, tags text[], search_rank real)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.search_blog_posts(search_query text, limit_count integer DEFAULT 50)
RETURNS TABLE(id uuid, title text, slug text, excerpt text, hero_image_url text, tags text[], search_rank real)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND (ur.expires_at IS NULL OR now() < ur.expires_at)
  );
$function$;

CREATE OR REPLACE FUNCTION public.generate_recipe_slug(recipe_title text, recipe_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from title
  base_slug := lower(trim(regexp_replace(recipe_title, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'recipe';
  END IF;
  
  -- Check for uniqueness and append counter if needed
  final_slug := base_slug;
  WHILE EXISTS (
    SELECT 1 FROM public.recipes 
    WHERE user_id = recipe_user_id 
    AND slug = final_slug
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$function$;

CREATE OR REPLACE FUNCTION public.search_site_content(query_text text, content_types text[] DEFAULT ARRAY['recipe'::text, 'blog'::text, 'help'::text], similarity_threshold real DEFAULT 0.3, max_results integer DEFAULT 5)
RETURNS TABLE(content_type text, title text, slug text, excerpt text, url text, similarity_score real, metadata jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  query_embedding vector(1536);
BEGIN
  -- Generate embedding for query (this will be called from edge function)
  -- For now, return text-based search as fallback
  RETURN QUERY
  SELECT 
    ci.type::TEXT as content_type,
    ci.title::TEXT,
    ci.slug::TEXT,
    COALESCE(ci.excerpt, ci.summary, '')::TEXT as excerpt,
    ci.url::TEXT,
    (
      -- Simple text similarity scoring
      CASE WHEN ci.title ILIKE '%' || query_text || '%' THEN 1.0
           WHEN ci.summary ILIKE '%' || query_text || '%' THEN 0.8
           WHEN ci.body_text ILIKE '%' || query_text || '%' THEN 0.6
           ELSE 0.3
      END
    )::REAL as similarity_score,
    jsonb_build_object(
      'ingredients', ci.ingredients,
      'method_steps', ci.method_steps,
      'difficulty', ci.difficulty,
      'prep_time', ci.prep_time,
      'tags', ci.tags
    ) as metadata
  FROM public.content_items ci
  WHERE ci.type = ANY(content_types)
    AND (
      ci.title ILIKE '%' || query_text || '%' OR
      ci.summary ILIKE '%' || query_text || '%' OR
      ci.body_text ILIKE '%' || query_text || '%' OR
      EXISTS (
        SELECT 1 FROM unnest(ci.tags) tag 
        WHERE tag ILIKE '%' || query_text || '%'
      )
    )
  ORDER BY similarity_score DESC, ci.updated_at DESC
  LIMIT max_results;
END;
$function$;

-- 2. Move extensions from public schema to dedicated extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_trgm extension (if it exists in public)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    ALTER EXTENSION pg_trgm SET SCHEMA extensions;
  END IF;
END $$;

-- Move vector extension (if it exists in public)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    ALTER EXTENSION vector SET SCHEMA extensions;
  END IF;
END $$;

-- 3. Update extension versions to latest
ALTER EXTENSION pg_trgm UPDATE;
ALTER EXTENSION vector UPDATE;

-- 4. Create a secure view for public blog posts that excludes user_id
CREATE OR REPLACE VIEW public.blog_posts_public AS
SELECT 
  id,
  title,
  slug,
  excerpt,
  content,
  hero_image_url,
  inline_image_url,
  social_image_url,
  subtitle,
  tags,
  published_at,
  created_at,
  updated_at,
  -- Get author display name from profiles table instead of exposing user_id
  (SELECT display_name FROM public.profiles WHERE user_id = blog_posts.user_id) as author_display_name
FROM public.blog_posts
WHERE is_draft = false 
  AND published_at IS NOT NULL;

-- Grant access to the view for anonymous users
GRANT SELECT ON public.blog_posts_public TO anon;
GRANT SELECT ON public.blog_posts_public TO authenticated;

COMMENT ON VIEW public.blog_posts_public IS 'Secure view of published blog posts without exposing user_id';