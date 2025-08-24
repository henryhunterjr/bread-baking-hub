-- Enhance content indexing for RAG system
-- Add new columns to content_items for better categorization
ALTER TABLE public.content_items 
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS ingredients TEXT[],
  ADD COLUMN IF NOT EXISTS method_steps TEXT[],
  ADD COLUMN IF NOT EXISTS difficulty TEXT,
  ADD COLUMN IF NOT EXISTS prep_time TEXT,
  ADD COLUMN IF NOT EXISTS indexed_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for content search
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_indexed_at ON public.content_items(indexed_at);

-- Create function to search content with vector similarity
CREATE OR REPLACE FUNCTION public.search_site_content(
  query_text TEXT,
  content_types TEXT[] DEFAULT ARRAY['recipe', 'blog', 'help'],
  similarity_threshold REAL DEFAULT 0.3,
  max_results INTEGER DEFAULT 5
)
RETURNS TABLE(
  content_type TEXT,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  url TEXT,
  similarity_score REAL,
  metadata JSONB
)
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