-- Enhance product_clicks table for better conversion tracking
ALTER TABLE public.product_clicks 
ADD COLUMN referrer_slug TEXT,
ADD COLUMN conversion_flag BOOLEAN DEFAULT false;

-- Create index for better query performance on new fields
CREATE INDEX idx_product_clicks_referrer_slug ON public.product_clicks(referrer_slug);
CREATE INDEX idx_product_clicks_conversion_flag ON public.product_clicks(conversion_flag);

-- Create index for product performance analysis
CREATE INDEX idx_product_clicks_product_referrer ON public.product_clicks(product_id, referrer_slug);