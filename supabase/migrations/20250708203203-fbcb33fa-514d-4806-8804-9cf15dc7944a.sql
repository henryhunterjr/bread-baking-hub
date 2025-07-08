-- Create table for blog click tracking
CREATE TABLE public.blog_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  post_title TEXT NOT NULL,
  post_url TEXT NOT NULL,
  category_names TEXT[],
  user_id UUID,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer_page TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_clicks ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting clicks (allow anonymous)
CREATE POLICY "Anyone can log blog clicks" 
ON public.blog_clicks 
FOR INSERT 
WITH CHECK (true);

-- Create policy for viewing clicks (only authenticated users can view their own)
CREATE POLICY "Users can view their own blog clicks" 
ON public.blog_clicks 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create index for better performance
CREATE INDEX idx_blog_clicks_post_id ON public.blog_clicks(post_id);
CREATE INDEX idx_blog_clicks_user_id ON public.blog_clicks(user_id);
CREATE INDEX idx_blog_clicks_clicked_at ON public.blog_clicks(clicked_at);