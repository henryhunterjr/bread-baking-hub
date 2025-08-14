-- Complete MFA security policies without view RLS

-- Complete the RLS policies for user_mfa
CREATE POLICY "Users can manage encrypted MFA settings"
ON public.user_mfa 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a secure view for MFA status that doesn't expose secrets
DROP VIEW IF EXISTS public.user_mfa_status;
CREATE VIEW public.user_mfa_status AS
SELECT 
  id,
  user_id,
  method,
  is_verified,
  is_active,
  created_at,
  updated_at,
  (phone_number IS NOT NULL) as has_phone_number,
  (backup_codes IS NOT NULL AND array_length(backup_codes, 1) > 0) as has_backup_codes
FROM public.user_mfa
WHERE user_id = auth.uid(); -- Security built into the view

-- Fix all function search paths
CREATE OR REPLACE FUNCTION public.store_encrypted_mfa_secret(
  p_user_id UUID,
  p_method TEXT,
  p_secret TEXT,
  p_phone_number TEXT DEFAULT NULL,
  p_backup_codes TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  encrypted_secret TEXT;
  hashed_backup_codes TEXT[];
  mfa_id UUID;
BEGIN
  -- Only allow users to manage their own MFA
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized MFA operation';
  END IF;
  
  -- Encrypt the secret using a project-specific key
  encrypted_secret := encode(
    pgp_sym_encrypt(p_secret, 'mfa_encryption_key_' || p_user_id::text),
    'base64'
  );
  
  -- Hash backup codes for storage (one-way hash)
  IF p_backup_codes IS NOT NULL THEN
    SELECT array_agg(encode(digest(code, 'sha256'), 'hex'))
    INTO hashed_backup_codes
    FROM unnest(p_backup_codes) AS code;
  END IF;
  
  -- Insert or update MFA record
  INSERT INTO public.user_mfa (
    user_id,
    method,
    secret,
    phone_number,
    backup_codes,
    secret_encrypted,
    is_verified,
    is_active
  ) VALUES (
    p_user_id,
    p_method,
    encrypted_secret,
    p_phone_number,
    hashed_backup_codes,
    true,
    false,
    true
  )
  ON CONFLICT (user_id, method) 
  DO UPDATE SET
    secret = EXCLUDED.secret,
    phone_number = EXCLUDED.phone_number,
    backup_codes = EXCLUDED.backup_codes,
    secret_encrypted = EXCLUDED.secret_encrypted,
    updated_at = now()
  RETURNING id INTO mfa_id;
  
  RETURN mfa_id;
END;
$$;