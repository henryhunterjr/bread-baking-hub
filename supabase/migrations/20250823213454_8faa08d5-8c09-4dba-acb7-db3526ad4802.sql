-- Create storage bucket for recipe uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-uploads', 'recipe-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Drop and recreate policies to avoid syntax errors
DROP POLICY IF EXISTS "Allow anonymous uploads to recipe-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to recipe-uploads" ON storage.objects;

-- Create storage policies for the recipe-uploads bucket
CREATE POLICY "Allow anonymous uploads to recipe-uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'recipe-uploads');

CREATE POLICY "Allow public access to recipe-uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'recipe-uploads');