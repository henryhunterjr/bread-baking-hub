-- Add image_url column to recipes table
ALTER TABLE public.recipes 
ADD COLUMN image_url TEXT;

-- Create storage bucket for recipe uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recipe-uploads', 'recipe-uploads', true);

-- Create storage policies for recipe uploads
CREATE POLICY "Recipe images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'recipe-uploads');

CREATE POLICY "Users can upload their own recipe images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'recipe-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own recipe images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'recipe-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own recipe images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'recipe-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);