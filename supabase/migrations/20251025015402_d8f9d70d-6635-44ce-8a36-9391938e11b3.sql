-- Create affiliate_products table
CREATE TABLE public.affiliate_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  regions TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  seasonal_tags TEXT[] NOT NULL DEFAULT '{}',
  offer_text TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  utm_params TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (products should be viewable by everyone)
CREATE POLICY "Anyone can view affiliate products"
  ON public.affiliate_products
  FOR SELECT
  USING (true);

-- Create policy for admin management
CREATE POLICY "Admins can manage affiliate products"
  ON public.affiliate_products
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for common queries
CREATE INDEX idx_affiliate_products_category ON public.affiliate_products(category);
CREATE INDEX idx_affiliate_products_featured ON public.affiliate_products(featured) WHERE featured = true;
CREATE INDEX idx_affiliate_products_keywords ON public.affiliate_products USING GIN(keywords);
CREATE INDEX idx_affiliate_products_regions ON public.affiliate_products USING GIN(regions);

-- Create updated_at trigger
CREATE TRIGGER update_affiliate_products_updated_at
  BEFORE UPDATE ON public.affiliate_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();