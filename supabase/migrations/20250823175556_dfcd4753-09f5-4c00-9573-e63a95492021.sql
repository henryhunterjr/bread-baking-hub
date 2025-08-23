-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Content types enum
CREATE TYPE content_type AS ENUM ('recipe', 'blog', 'glossary', 'help');

-- Main content items table
CREATE TABLE public.content_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type content_type NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  url TEXT NOT NULL,
  summary TEXT,
  body_text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(type, slug)
);

-- Content embeddings table  
CREATE TABLE public.content_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  embedding vector(1536) NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  text_chunk TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Help topics table
CREATE TABLE public.help_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  audience TEXT[] DEFAULT '{"all"}',
  summary TEXT NOT NULL,
  steps TEXT[] DEFAULT '{}',
  links JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_content_items_type ON public.content_items(type);
CREATE INDEX idx_content_items_slug ON public.content_items(slug);
CREATE INDEX idx_content_items_tags ON public.content_items USING GIN(tags);
CREATE INDEX idx_content_items_updated_at ON public.content_items(updated_at);
CREATE INDEX idx_content_embeddings_content_id ON public.content_embeddings(content_id);
CREATE INDEX idx_content_embeddings_embedding ON public.content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_help_topics_key ON public.help_topics(key);
CREATE INDEX idx_help_topics_audience ON public.help_topics USING GIN(audience);

-- Enable Row Level Security
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_topics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_items
CREATE POLICY "Anyone can view content items" ON public.content_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage content items" ON public.content_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content_embeddings  
CREATE POLICY "Anyone can view content embeddings" ON public.content_embeddings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage content embeddings" ON public.content_embeddings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for help_topics
CREATE POLICY "Anyone can view help topics" ON public.help_topics
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage help topics" ON public.help_topics
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Function for semantic search
CREATE OR REPLACE FUNCTION match_content_embeddings(
  query_embedding vector(1536),
  match_count int DEFAULT 6,
  filter_type text DEFAULT NULL
) RETURNS TABLE (
  content_id uuid,
  chunk_index int,
  text_chunk text,
  similarity float
) LANGUAGE sql STABLE AS $$
  SELECT 
    ce.content_id,
    ce.chunk_index,
    ce.text_chunk,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM content_embeddings ce
  JOIN content_items ci ON ci.id = ce.content_id
  WHERE (filter_type IS NULL OR ci.type::text = filter_type)
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_content()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_content();

CREATE TRIGGER update_content_embeddings_updated_at
  BEFORE UPDATE ON public.content_embeddings  
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_content();

CREATE TRIGGER update_help_topics_updated_at
  BEFORE UPDATE ON public.help_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_content();

-- Insert initial help topics
INSERT INTO public.help_topics (key, title, summary, steps, links, audience) VALUES
('saving-recipes', 'Saving Recipes', 'Save recipes from any recipe card or detail page to your personal collection.', 
 '{"Open any recipe page", "Click the Save button", "Choose a collection or create new one", "Recipe is saved to your account"}',
 '[{"label": "My Recipes", "url": "/my-recipes"}, {"label": "Browse Recipes", "url": "/recipes"}]',
 '{"all"}'),

('print-pdf', 'Save as PDF', 'Print any recipe using the dedicated print route for clean, kitchen-friendly PDFs.',
 '{"Open a recipe page", "Click Save as PDF button", "A print-optimized page opens", "Use your browser print function", "Save as PDF"}',
 '[{"label": "Recipe Collection", "url": "/recipes"}, {"label": "Help Center", "url": "/help#print"}]',
 '{"all"}'),

('recipe-workspace', 'Recipe Workspace', 'Upload, format, and edit recipes using AI-powered tools.',
 '{"Go to Recipe Workspace", "Paste recipe text or upload image", "Click Format Recipe", "Review and edit the formatted recipe", "Save to your collection"}',
 '[{"label": "Recipe Workspace", "url": "/workspace"}, {"label": "My Recipes", "url": "/my-recipes"}]',
 '{"all"}'),

('troubleshooting', 'Troubleshooting Tool', 'Diagnose bread problems using visual and text analysis.',
 '{"Open Troubleshooting page", "Choose between Crust & Crumb visual tool or text description", "Follow the diagnostic prompts", "Review the AI analysis and recommendations", "Save results to history"}',
 '[{"label": "Troubleshooting", "url": "/troubleshooting"}, {"label": "Crust & Crumb Tool", "url": "/crust-and-crumb"}]',
 '{"all"}'),

('library', 'Books & Library', 'Browse and preview books, with audio excerpts and purchase options.',
 '{"Visit the Books section", "Browse available books", "Click on a book for details", "Listen to audio previews", "Purchase or download preview"}',
 '[{"label": "Books Library", "url": "/books"}, {"label": "Browse by Category", "url": "/books#categories"}]',
 '{"all"}'),

('glossary', 'Bread Glossary', 'Search and learn bread terminology and techniques.',
 '{"Open the Glossary", "Use the search function or browse alphabetically", "Click on any term for detailed definition", "Explore related terms"}',
 '[{"label": "Glossary", "url": "/glossary"}, {"label": "Search Glossary", "url": "/glossary#search"}]',
 '{"all"}'),

('monthly-challenge', 'Monthly Baking Challenge', 'Join our community baking challenges with featured recipes and techniques.',
 '{"Check the current monthly challenge", "Download the featured recipe", "Bake and share your results", "Connect with other bakers in the community"}',
 '[{"label": "Current Challenge", "url": "/challenge"}, {"label": "Community", "url": "/community"}]',
 '{"all"}'),

('dashboard-admin', 'Admin Dashboard', 'Administrative tools and content management (Henry only).',
 '{"Access is restricted to site administrator", "Dashboard includes content management", "Recipe and blog post moderation", "User management and analytics"}',
 '[{"label": "Dashboard", "url": "/dashboard"}]',
 '{"admin"}'),

('using-krusty', 'Using KRUSTY AI Assistant', 'Get help with baking questions, site navigation, and recipe advice.',
 '{"Ask KRUSTY about any baking topic", "Request specific recipes or techniques", "Get site navigation help", "Ask for ingredient substitutions or scaling advice"}',
 '[{"label": "Chat with KRUSTY", "url": "/"}, {"label": "Help Center", "url": "/help"}]',
 '{"all"}'),

('voice-features', 'Voice Commands', 'Use voice input and speech features throughout the site.',
 '{"Enable microphone access when prompted", "Click voice input buttons on recipe pages", "Speak clearly for best recognition", "Use voice commands in KRUSTY chat"}',
 '[{"label": "Voice Demo", "url": "/workspace"}, {"label": "Accessibility", "url": "/help#accessibility"}]',
 '{"all"}');