-- Create recipe_versions table for tracking recipe changes
CREATE TABLE public.recipe_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  image_url TEXT,
  folder TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  slug TEXT,
  version_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  UNIQUE(recipe_id, version_number)
);

-- Enable Row Level Security
ALTER TABLE public.recipe_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for recipe versions
CREATE POLICY "Users can view their own recipe versions" 
ON public.recipe_versions 
FOR SELECT 
USING (created_by = auth.uid());

CREATE POLICY "Users can create their own recipe versions" 
ON public.recipe_versions 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own recipe versions" 
ON public.recipe_versions 
FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own recipe versions" 
ON public.recipe_versions 
FOR DELETE 
USING (created_by = auth.uid());

-- Create index for better performance
CREATE INDEX idx_recipe_versions_recipe_id ON public.recipe_versions(recipe_id);
CREATE INDEX idx_recipe_versions_version_number ON public.recipe_versions(recipe_id, version_number DESC);

-- Create function to automatically create version when recipe is updated
CREATE OR REPLACE FUNCTION public.create_recipe_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if this is an update (not insert)
  IF TG_OP = 'UPDATE' THEN
    -- Get the next version number
    INSERT INTO public.recipe_versions (
      recipe_id,
      version_number,
      title,
      data,
      image_url,
      folder,
      tags,
      is_public,
      slug,
      version_notes,
      created_by
    )
    SELECT 
      OLD.id,
      COALESCE((
        SELECT MAX(version_number) + 1 
        FROM public.recipe_versions 
        WHERE recipe_id = OLD.id
      ), 1),
      OLD.title,
      OLD.data,
      OLD.image_url,
      OLD.folder,
      OLD.tags,
      OLD.is_public,
      OLD.slug,
      'Auto-saved version before update',
      OLD.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically version recipes
CREATE TRIGGER recipe_versioning_trigger
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_recipe_version();