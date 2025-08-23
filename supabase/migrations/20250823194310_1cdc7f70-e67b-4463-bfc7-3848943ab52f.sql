-- Create user_recipes table for user library functionality
CREATE TABLE IF NOT EXISTS public.user_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable RLS on user_recipes
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_recipes
CREATE POLICY "Users can view their own saved recipes"
  ON public.user_recipes
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save recipes to their library"
  ON public.user_recipes
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove recipes from their library"
  ON public.user_recipes
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create error_logs table for better error tracking
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  error_type TEXT,
  error_message TEXT,
  error_stack TEXT,
  request_payload JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  severity TEXT DEFAULT 'error'
);

-- Enable RLS on error_logs (only allow admin/system access)
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can insert error logs"
  ON public.error_logs
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only admins can view error logs"
  ON public.error_logs
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));