-- Fix critical security issues in RLS policies

-- 1. Fix submissions table - restrict public email harvesting
DROP POLICY IF EXISTS "Allow public submissions" ON public.submissions;
CREATE POLICY "Authenticated users can submit" ON public.submissions
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 2. Fix site_settings table - restrict internal config exposure  
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Authenticated users can view site settings" ON public.site_settings
FOR SELECT 
USING (auth.role() = 'authenticated');

-- 3. Fix product_clicks table - prevent analytics manipulation
DROP POLICY IF EXISTS "Anyone can log product clicks" ON public.product_clicks;
CREATE POLICY "Authenticated users can log product clicks" ON public.product_clicks
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 4. Fix blog_clicks table - prevent analytics manipulation
DROP POLICY IF EXISTS "Anyone can log blog clicks" ON public.blog_clicks;
CREATE POLICY "Authenticated users can log blog clicks" ON public.blog_clicks
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');