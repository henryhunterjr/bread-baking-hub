-- Create search analytics table for tracking search behavior
CREATE TABLE public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  search_query TEXT NOT NULL,
  search_type TEXT NOT NULL DEFAULT 'global', -- 'global', 'recipe', 'blog', 'glossary'
  results_count INTEGER DEFAULT 0,
  clicked_result_id TEXT,
  clicked_result_type TEXT, -- 'recipe', 'blog_post', 'glossary_term'
  filters_applied JSONB DEFAULT '{}',
  session_id TEXT,
  search_context TEXT, -- page where search was initiated
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for search analytics
CREATE POLICY "Users can create search analytics" 
ON public.search_analytics 
FOR INSERT 
WITH CHECK (true); -- Allow anonymous tracking

CREATE POLICY "Users can view their own search analytics" 
ON public.search_analytics 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all search analytics" 
ON public.search_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Create user viewing history table for "Recently Viewed" functionality
CREATE TABLE public.user_viewing_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content_type TEXT NOT NULL, -- 'recipe', 'blog_post', 'glossary_term'
  content_id UUID NOT NULL,
  content_title TEXT NOT NULL,
  content_url TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_duration INTEGER, -- seconds spent viewing
  UNIQUE(user_id, content_type, content_id)
);

-- Enable RLS
ALTER TABLE public.user_viewing_history ENABLE ROW LEVEL SECURITY;

-- Create policies for viewing history
CREATE POLICY "Users can manage their own viewing history" 
ON public.user_viewing_history 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_search_analytics_user_id ON public.search_analytics(user_id);
CREATE INDEX idx_search_analytics_query ON public.search_analytics(search_query);
CREATE INDEX idx_search_analytics_type ON public.search_analytics(search_type);
CREATE INDEX idx_search_analytics_created_at ON public.search_analytics(created_at);

CREATE INDEX idx_viewing_history_user_id ON public.user_viewing_history(user_id);
CREATE INDEX idx_viewing_history_content_type ON public.user_viewing_history(content_type);
CREATE INDEX idx_viewing_history_viewed_at ON public.user_viewing_history(viewed_at);

-- Create function for full-text search across recipes
CREATE OR REPLACE FUNCTION search_recipes(
  search_query TEXT,
  dietary_filters TEXT[] DEFAULT '{}',
  difficulty_filter TEXT DEFAULT NULL,
  prep_time_max INTEGER DEFAULT NULL,
  total_time_max INTEGER DEFAULT NULL,
  ingredients_filter TEXT[] DEFAULT '{}',
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  image_url TEXT,
  tags TEXT[],
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  excerpt TEXT,
  search_rank REAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
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
    ts_rank(
      to_tsvector('english', r.title || ' ' || COALESCE(r.data->>'description', '') || ' ' || array_to_string(r.tags, ' ')),
      plainto_tsquery('english', search_query)
    ) as search_rank
  FROM public.recipes r
  WHERE 
    r.is_public = true
    AND (
      search_query = '' OR
      to_tsvector('english', r.title || ' ' || COALESCE(r.data->>'description', '') || ' ' || array_to_string(r.tags, ' ')) 
      @@ plainto_tsquery('english', search_query)
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
$$;

-- Create function for full-text search across blog posts
CREATE OR REPLACE FUNCTION search_blog_posts(
  search_query TEXT,
  tag_filters TEXT[] DEFAULT '{}',
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  subtitle TEXT,
  hero_image_url TEXT,
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  excerpt TEXT,
  search_rank REAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
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
    ts_rank(
      to_tsvector('english', bp.title || ' ' || COALESCE(bp.subtitle, '') || ' ' || bp.content || ' ' || array_to_string(bp.tags, ' ')),
      plainto_tsquery('english', search_query)
    ) as search_rank
  FROM public.blog_posts bp
  WHERE 
    bp.is_draft = false
    AND bp.published_at IS NOT NULL
    AND (
      search_query = '' OR
      to_tsvector('english', bp.title || ' ' || COALESCE(bp.subtitle, '') || ' ' || bp.content || ' ' || array_to_string(bp.tags, ' ')) 
      @@ plainto_tsquery('english', search_query)
    )
    AND (
      tag_filters = '{}' OR
      bp.tags && tag_filters
    )
  ORDER BY search_rank DESC, bp.published_at DESC
  LIMIT limit_count;
END;
$$;

-- Create function to get popular/trending recipes based on activity
CREATE OR REPLACE FUNCTION get_trending_recipes(
  days_back INTEGER DEFAULT 7,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  image_url TEXT,
  tags TEXT[],
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  activity_score BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.slug,
    r.image_url,
    r.tags,
    r.user_id,
    r.created_at,
    COUNT(uvh.id) as activity_score
  FROM public.recipes r
  LEFT JOIN public.user_viewing_history uvh ON 
    r.id = uvh.content_id 
    AND uvh.content_type = 'recipe'
    AND uvh.viewed_at > (now() - interval '1 day' * days_back)
  WHERE r.is_public = true
  GROUP BY r.id, r.title, r.slug, r.image_url, r.tags, r.user_id, r.created_at
  ORDER BY activity_score DESC, r.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Create function to get related recipes based on tags and content similarity
CREATE OR REPLACE FUNCTION get_related_recipes(
  recipe_id UUID,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  image_url TEXT,
  tags TEXT[],
  similarity_score INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  recipe_tags TEXT[];
BEGIN
  -- Get the tags of the source recipe
  SELECT r.tags INTO recipe_tags 
  FROM public.recipes r 
  WHERE r.id = recipe_id AND r.is_public = true;
  
  IF recipe_tags IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.slug,
    r.image_url,
    r.tags,
    array_length(ARRAY(SELECT unnest(r.tags) INTERSECT SELECT unnest(recipe_tags)), 1) as similarity_score
  FROM public.recipes r
  WHERE 
    r.is_public = true
    AND r.id != recipe_id
    AND r.tags && recipe_tags -- Has at least one common tag
  ORDER BY similarity_score DESC, r.created_at DESC
  LIMIT limit_count;
END;
$$;