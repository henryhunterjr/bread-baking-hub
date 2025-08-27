-- Fix the search path security warning for the admin function
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE profiles.user_id = is_admin_user.user_id), false);
$$;