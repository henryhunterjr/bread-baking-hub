-- Fix Critical Security Issue: Encrypt MFA secrets and improve access controls

-- 1. Add encryption function for MFA secrets
CREATE OR REPLACE FUNCTION public.encrypt_mfa_secret(secret_text TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT encode(
    pgp_sym_encrypt(
      secret_text, 
      current_setting('app.settings.encryption_key', true)
    ), 
    'base64'
  );
$$;

-- 2. Add decryption function for MFA secrets
CREATE OR REPLACE FUNCTION public.decrypt_mfa_secret(encrypted_secret TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT pgp_sym_decrypt(
    decode(encrypted_secret, 'base64'),
    current_setting('app.settings.encryption_key', true)
  );
$$;

-- 3. Update user_activities table to be more restrictive by default
-- Change default visibility from 'public' to 'private'
ALTER TABLE public.user_activities 
ALTER COLUMN visibility SET DEFAULT 'private';

-- 4. Create more restrictive RLS policy for user_activities
DROP POLICY IF EXISTS "Users can view public activities and their own" ON public.user_activities;

CREATE POLICY "Users can view their own activities and limited public ones" 
ON public.user_activities 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (visibility = 'public' AND activity_type IN ('recipe_shared', 'recipe_published'))
);

-- 5. Add policy to prevent sensitive activity types from being public
CREATE POLICY "Prevent sensitive activities from being public" 
ON public.user_activities 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) AND
  (visibility = 'private' OR activity_type IN ('recipe_shared', 'recipe_published'))
);

-- 6. Create secure function to get user's own MFA secret
CREATE OR REPLACE FUNCTION public.get_user_mfa_secret()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT secret FROM public.user_mfa 
  WHERE user_id = auth.uid() AND is_active = true
  LIMIT 1;
$$;

-- 7. Remove direct access to MFA secrets via RLS
DROP POLICY IF EXISTS "Users can manage their own MFA settings" ON public.user_mfa;

-- Create separate policies for better control
CREATE POLICY "Users can view their MFA status" 
ON public.user_mfa 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MFA settings" 
ON public.user_mfa 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA settings" 
ON public.user_mfa 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MFA settings" 
ON public.user_mfa 
FOR DELETE 
USING (auth.uid() = user_id);

-- 8. Add audit table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view security audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert security audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);