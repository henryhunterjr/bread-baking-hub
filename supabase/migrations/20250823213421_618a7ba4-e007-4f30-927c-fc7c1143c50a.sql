-- Create storage bucket for recipe uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-uploads', 'recipe-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the recipe-uploads bucket
CREATE POLICY IF NOT EXISTS "Allow anonymous uploads to recipe-uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'recipe-uploads');

CREATE POLICY IF NOT EXISTS "Allow public access to recipe-uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'recipe-uploads');