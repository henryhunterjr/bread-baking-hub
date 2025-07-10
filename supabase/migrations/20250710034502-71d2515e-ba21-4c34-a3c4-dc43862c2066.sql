-- Create blog_posts table for dashboard functionality
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  hero_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  publish_as_newsletter BOOLEAN DEFAULT false,
  is_draft BOOLEAN DEFAULT true,
  slug TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for slug lookups
CREATE UNIQUE INDEX idx_blog_posts_user_slug ON public.blog_posts(user_id, slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published_at) WHERE is_draft = false;

-- Create newsletter_subscribers table for newsletter functionality
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security for newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for newsletter subscribers (public can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Subscribers can view their own subscription" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (true);

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for hero images
CREATE POLICY "Users can upload their own hero images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hero-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Hero images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-images');

CREATE POLICY "Users can update their own hero images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hero-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own hero images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hero-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger for updating timestamps on blog_posts
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updating timestamps on newsletter_subscribers
CREATE TRIGGER update_newsletter_subscribers_updated_at
BEFORE UPDATE ON public.newsletter_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();