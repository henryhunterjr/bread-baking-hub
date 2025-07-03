-- Create table for tracking affiliate product clicks
CREATE TABLE public.product_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  recipe_title TEXT,
  user_id UUID,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for product clicks (allow anyone to insert for analytics)
CREATE POLICY "Anyone can log product clicks" 
ON public.product_clicks 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view click data (or you can make it viewable by authenticated users)
CREATE POLICY "Admins can view all product clicks" 
ON public.product_clicks 
FOR SELECT 
USING (false); -- Change to your admin condition when needed

-- Create index for performance
CREATE INDEX idx_product_clicks_product_id ON public.product_clicks(product_id);
CREATE INDEX idx_product_clicks_clicked_at ON public.product_clicks(clicked_at);
CREATE INDEX idx_product_clicks_user_id ON public.product_clicks(user_id);