-- Create blog-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Create policies for blog-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Create metadata table for blog images
CREATE TABLE public.blog_images_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  meta_description TEXT,
  post_title TEXT,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  file_size INTEGER,
  dimensions JSONB,
  public_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_images_metadata
ALTER TABLE public.blog_images_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_images_metadata
CREATE POLICY "Users can view their own image metadata"
ON public.blog_images_metadata
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own image metadata"
ON public.blog_images_metadata
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own image metadata"
ON public.blog_images_metadata
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own image metadata"
ON public.blog_images_metadata
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_blog_images_metadata_updated_at
BEFORE UPDATE ON public.blog_images_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();