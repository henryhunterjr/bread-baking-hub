-- Create format_jobs table for tracking recipe formatting attempts
CREATE TABLE IF NOT EXISTS public.format_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  source_type text, -- 'pdf' | 'image' | 'text'
  raw_text text,
  status text CHECK (status IN ('success','failed')) NOT NULL,
  error_code text,
  error_detail text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.format_jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for logging failures)
CREATE POLICY "allow_insert_format_jobs" ON public.format_jobs 
FOR INSERT WITH CHECK (true);

-- Allow users to view their own jobs
CREATE POLICY "view_own_format_jobs" ON public.format_jobs 
FOR SELECT USING (auth.uid() = user_id);

-- Allow admins to view all jobs
CREATE POLICY "admin_view_all_format_jobs" ON public.format_jobs 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);