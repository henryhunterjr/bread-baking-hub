-- Fix database function security warnings by adding SET search_path
ALTER FUNCTION public.search_recipes SET search_path TO 'public';
ALTER FUNCTION public.search_blog_posts SET search_path TO 'public';
ALTER FUNCTION public.get_trending_recipes SET search_path TO 'public';
ALTER FUNCTION public.get_related_recipes SET search_path TO 'public';
ALTER FUNCTION public.get_core_web_vitals_summary SET search_path TO 'public';
ALTER FUNCTION public.assign_ab_variant SET search_path TO 'public';