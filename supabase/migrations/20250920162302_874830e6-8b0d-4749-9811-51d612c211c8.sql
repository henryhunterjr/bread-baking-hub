-- Fix RLS policy for hero-images bucket to allow authenticated uploads
CREATE POLICY "Authenticated users can upload to hero-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hero-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hero-images' AND auth.role() = 'authenticated');

CREATE POLICY "Hero images are publicly readable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-images');