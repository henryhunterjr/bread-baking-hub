-- Add new image columns to blog_posts table
ALTER TABLE blog_posts
  ADD COLUMN inline_image_url TEXT,
  ADD COLUMN social_image_url TEXT;

-- Back-fill from existing hero_image_url
UPDATE blog_posts
SET   inline_image_url  = hero_image_url,
      social_image_url  = hero_image_url
WHERE hero_image_url IS NOT NULL;

-- Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can update site settings" 
ON public.site_settings 
FOR ALL
USING (auth.role() = 'authenticated'::text);

-- Insert default hero banner setting
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES ('hero_banner_url', '/lovable-uploads/bd157eb8-d847-4f54-913a-8483144ecb46.png')
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for automatic timestamp updates on site_settings
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();