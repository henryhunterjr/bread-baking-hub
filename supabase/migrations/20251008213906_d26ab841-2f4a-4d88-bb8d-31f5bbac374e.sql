-- Create blog-videos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-videos',
  'blog-videos',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4']
);

-- Create RLS policies for blog-videos bucket
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-videos');

CREATE POLICY "Public can view videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-videos');

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create blog_videos_metadata table
CREATE TABLE public.blog_videos_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  description TEXT,
  post_title TEXT,
  file_size INTEGER,
  duration NUMERIC,
  public_url TEXT NOT NULL,
  thumbnail_url TEXT,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on blog_videos_metadata
ALTER TABLE public.blog_videos_metadata ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_videos_metadata
CREATE POLICY "Users can view their own video metadata"
ON public.blog_videos_metadata FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own video metadata"
ON public.blog_videos_metadata FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video metadata"
ON public.blog_videos_metadata FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video metadata"
ON public.blog_videos_metadata FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "QA reviewers can view all video metadata"
ON public.blog_videos_metadata FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'qa_reviewer'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_blog_videos_metadata_updated_at
BEFORE UPDATE ON public.blog_videos_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_blog_videos_metadata_user_id ON public.blog_videos_metadata(user_id);
CREATE INDEX idx_blog_videos_metadata_upload_date ON public.blog_videos_metadata(upload_date DESC);