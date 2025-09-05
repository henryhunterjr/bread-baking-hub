-- Fix Security Linter Issues

-- Fix Function Search Path Mutable issues by updating remaining functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE profiles.user_id = is_admin_user.user_id), false);
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user(user_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT user_email = 'henry@bakinggreatbread.blog';
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT is_admin_user(auth.email());
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.match_content(query_embedding extensions.vector, match_count integer, filter_type text)
RETURNS TABLE(content_id uuid, chunk_index integer, text_chunk text, score real)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT ce.content_id, ce.chunk_index, ce.text_chunk,
         1 - (ce.embedding <=> query_embedding) AS score
  FROM public.content_embeddings ce
  JOIN public.content_items ci ON ci.id = ce.content_id
  WHERE (filter_type IS NULL OR ci.type = filter_type)
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
$$;

CREATE OR REPLACE FUNCTION public.search_site_content(query_text text, content_types text[] DEFAULT ARRAY['recipe'::text, 'blog'::text, 'help'::text], similarity_threshold real DEFAULT 0.3, max_results integer DEFAULT 5)
RETURNS TABLE(content_type text, title text, slug text, excerpt text, url text, similarity_score real, metadata jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Update extensions to recommended versions
ALTER EXTENSION "uuid-ossp" UPDATE;
ALTER EXTENSION "pgcrypto" UPDATE;
ALTER EXTENSION "pgjwt" UPDATE;