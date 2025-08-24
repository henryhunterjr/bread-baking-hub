-- Create recipe_drafts table for auto-save functionality
CREATE TABLE IF NOT EXISTS public.recipe_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  source_type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recipe_drafts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own drafts
CREATE POLICY "users_manage_own_drafts" ON public.recipe_drafts
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_recipe_drafts_user_id ON public.recipe_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_drafts_updated_at ON public.recipe_drafts(updated_at DESC);