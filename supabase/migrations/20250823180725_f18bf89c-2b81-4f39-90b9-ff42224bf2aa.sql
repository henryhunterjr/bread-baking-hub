-- Drop existing tables and recreate with cleaner schema
DROP TABLE IF EXISTS public.content_embeddings CASCADE;
DROP TABLE IF EXISTS public.content_items CASCADE;
DROP TABLE IF EXISTS public.help_topics CASCADE;
DROP TYPE IF EXISTS content_type CASCADE;
DROP FUNCTION IF EXISTS match_content_embeddings CASCADE;

-- content catalog
CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK (type IN ('recipe','blog','glossary','help')) NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  url text NOT NULL,
  summary text,
  body_text text,
  tags text[] DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- embeddings (pgvector required)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS public.content_embeddings (
  content_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  chunk_index int NOT NULL,
  embedding vector(1536) NOT NULL,
  text_chunk text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (content_id, chunk_index)
);

-- help topics
CREATE TABLE IF NOT EXISTS public.help_topics (
  key text PRIMARY KEY,
  title text NOT NULL,
  audience text[] NOT NULL DEFAULT array['all'],
  summary text NOT NULL,
  steps text[] NOT NULL,
  links jsonb[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS – read for everyone, write by service/edge
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY read_all_content ON public.content_items FOR SELECT USING (true);
CREATE POLICY read_all_embeddings ON public.content_embeddings FOR SELECT USING (true);
CREATE POLICY read_all_help ON public.help_topics FOR SELECT USING (true);

-- Allow service role full access for content management
CREATE POLICY service_manage_content ON public.content_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_manage_embeddings ON public.content_embeddings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_manage_help ON public.help_topics FOR ALL USING (auth.role() = 'service_role');

-- RPC: semantic match (pgvector cosine-ish)
CREATE OR REPLACE FUNCTION public.match_content(
  query_embedding vector(1536),
  match_count int,
  filter_type text
) RETURNS TABLE (
  content_id uuid,
  chunk_index int,
  text_chunk text,
  score float4
) LANGUAGE sql STABLE AS $$
  SELECT ce.content_id, ce.chunk_index, ce.text_chunk,
         1 - (ce.embedding <=> query_embedding) AS score
  FROM public.content_embeddings ce
  JOIN public.content_items ci ON ci.id = ce.content_id
  WHERE (filter_type IS NULL OR ci.type = filter_type)
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON public.content_items(slug);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON public.content_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_embeddings_embedding ON public.content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_help_topics_audience ON public.help_topics USING GIN(audience);

-- Insert initial help topics with proper jsonb casting
INSERT INTO public.help_topics (key, title, summary, steps, links, audience) VALUES
('saving-recipes', 'Saving Recipes', 'Save recipes from any recipe card or detail page to your personal collection.', 
 array['Open any recipe page', 'Click the Save button', 'Choose a collection or create new one', 'Recipe is saved to your account'],
 array['{"label": "My Recipes", "url": "/my-recipes"}'::jsonb, '{"label": "Browse Recipes", "url": "/recipes"}'::jsonb],
 array['all']),

('print-pdf', 'Save as PDF', 'Print any recipe using the dedicated print route for clean, kitchen-friendly PDFs.',
 array['Open a recipe page', 'Click Save as PDF button', 'A print-optimized page opens', 'Use your browser print function', 'Save as PDF'],
 array['{"label": "Recipe Collection", "url": "/recipes"}'::jsonb, '{"label": "Help Center", "url": "/help#print"}'::jsonb],
 array['all']),

('recipe-workspace', 'Recipe Workspace', 'Upload, format, and edit recipes using AI-powered tools.',
 array['Go to Recipe Workspace', 'Paste recipe text or upload image', 'Click Format Recipe', 'Review and edit the formatted recipe', 'Save to your collection'],
 array['{"label": "Recipe Workspace", "url": "/workspace"}'::jsonb, '{"label": "My Recipes", "url": "/my-recipes"}'::jsonb],
 array['all']),

('troubleshooting', 'Troubleshooting Tool', 'Diagnose bread problems using visual and text analysis.',
 array['Open Troubleshooting page', 'Choose between Crust & Crumb visual tool or text description', 'Follow the diagnostic prompts', 'Review the AI analysis and recommendations', 'Save results to history'],
 array['{"label": "Troubleshooting", "url": "/troubleshooting"}'::jsonb, '{"label": "Crust & Crumb Tool", "url": "/crust-and-crumb"}'::jsonb],
 array['all']),

('library', 'Books & Library', 'Browse and preview books, with audio excerpts and purchase options.',
 array['Visit the Books section', 'Browse available books', 'Click on a book for details', 'Listen to audio previews', 'Purchase or download preview'],
 array['{"label": "Books Library", "url": "/books"}'::jsonb, '{"label": "Browse by Category", "url": "/books#categories"}'::jsonb],
 array['all']),

('glossary', 'Bread Glossary', 'Search and learn bread terminology and techniques.',
 array['Open the Glossary', 'Use the search function or browse alphabetically', 'Click on any term for detailed definition', 'Explore related terms'],
 array['{"label": "Glossary", "url": "/glossary"}'::jsonb, '{"label": "Search Glossary", "url": "/glossary#search"}'::jsonb],
 array['all']),

('dashboard-admin', 'Admin Dashboard', 'Administrative tools and content management (Henry only).',
 array['Access is restricted to site administrator', 'Dashboard includes content management', 'Recipe and blog post moderation', 'User management and analytics'],
 array['{"label": "Dashboard", "url": "/dashboard"}'::jsonb],
 array['admin']),

('using-krusty', 'Using KRUSTY AI Assistant', 'Get help with baking questions, site navigation, and recipe advice.',
 array['Ask KRUSTY about any baking topic', 'Request specific recipes or techniques', 'Get site navigation help', 'Ask for ingredient substitutions or scaling advice'],
 array['{"label": "Chat with KRUSTY", "url": "/"}'::jsonb, '{"label": "Help Center", "url": "/help"}'::jsonb],
 array['all'])
ON CONFLICT (key) DO NOTHING;