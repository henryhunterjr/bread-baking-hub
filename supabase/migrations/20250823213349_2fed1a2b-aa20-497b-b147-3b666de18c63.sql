-- Create the error_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_name TEXT NOT NULL,
    error_type TEXT,
    error_message TEXT,
    error_stack TEXT,
    request_payload JSONB,
    timestamp TIMESTAMPTZ DEFAULT now(),
    severity TEXT DEFAULT 'error',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_error_logs_function_timestamp 
ON public.error_logs(function_name, timestamp DESC);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access (edge functions can insert)
CREATE POLICY "Allow service role to insert errors" ON public.error_logs
FOR INSERT
WITH CHECK (true);

-- Create policy for admins to read errors
CREATE POLICY "Allow admins to read errors" ON public.error_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
    OR auth.jwt() ->> 'role' = 'service_role'
);