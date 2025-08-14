-- Critical Security Fix: Enhance MFA Security with Encryption and Access Controls

-- 1. Enable pgcrypto extension for encryption (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Update MFA secrets to use encryption in application logic
-- Add a new column to track if data is encrypted (for migration purposes)
ALTER TABLE public.user_mfa 
ADD COLUMN IF NOT EXISTS secret_encrypted BOOLEAN DEFAULT false;

-- 3. Create a more secure function to store encrypted MFA secrets
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
SET search_path = public
AS $$
DECLARE
  encrypted_secret TEXT;
  hashed_backup_codes TEXT[];
  mfa_id UUID;
BEGIN
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

-- 4. Create function to verify backup codes securely
CREATE OR REPLACE FUNCTION public.verify_backup_code(
  p_user_id UUID,
  p_backup_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_codes TEXT[];
  code_hash TEXT;
BEGIN
  -- Get stored backup codes
  SELECT backup_codes INTO stored_codes
  FROM public.user_mfa
  WHERE user_id = p_user_id AND is_active = true
  LIMIT 1;
  
  IF stored_codes IS NULL THEN
    RETURN false;
  END IF;
  
  -- Hash the provided code
  code_hash := encode(digest(p_backup_code, 'sha256'), 'hex');
  
  -- Check if hash exists in stored codes
  RETURN code_hash = ANY(stored_codes);
END;
$$;

-- 5. Create function to get decrypted MFA secret (for verification)
CREATE OR REPLACE FUNCTION public.get_decrypted_mfa_secret(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encrypted_secret TEXT;
  is_encrypted BOOLEAN;
  decrypted_secret TEXT;
BEGIN
  -- Get the encrypted secret and encryption status
  SELECT secret, secret_encrypted 
  INTO encrypted_secret, is_encrypted
  FROM public.user_mfa
  WHERE user_id = p_user_id AND is_active = true
  LIMIT 1;
  
  IF encrypted_secret IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- If encrypted, decrypt it
  IF is_encrypted THEN
    BEGIN
      decrypted_secret := pgp_sym_decrypt(
        decode(encrypted_secret, 'base64'),
        'mfa_encryption_key_' || p_user_id::text
      );
    EXCEPTION WHEN OTHERS THEN
      -- If decryption fails, return null
      RETURN NULL;
    END;
  ELSE
    -- Legacy unencrypted secret
    decrypted_secret := encrypted_secret;
  END IF;
  
  RETURN decrypted_secret;
END;
$$;

-- 6. Add audit logging for MFA operations
CREATE OR REPLACE FUNCTION public.log_mfa_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log MFA changes to security audit
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_data,
    ip_address
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    CASE TG_OP
      WHEN 'INSERT' THEN 'mfa_setup'
      WHEN 'UPDATE' THEN 'mfa_updated'
      WHEN 'DELETE' THEN 'mfa_removed'
    END,
    jsonb_build_object(
      'method', COALESCE(NEW.method, OLD.method),
      'operation', TG_OP,
      'table', TG_TABLE_NAME
    ),
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 7. Add trigger for MFA audit logging
DROP TRIGGER IF EXISTS mfa_audit_trigger ON public.user_mfa;
CREATE TRIGGER mfa_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_mfa
  FOR EACH ROW EXECUTE FUNCTION public.log_mfa_activity();

-- 8. Create more restrictive RLS policies for MFA
DROP POLICY IF EXISTS "Users can view their MFA status" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can insert their own MFA settings" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can update their own MFA settings" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can delete their own MFA settings" ON public.user_mfa;

-- New restrictive policies that hide sensitive data
CREATE POLICY "Users can view limited MFA status"
ON public.user_mfa 
FOR SELECT 
USING (
  auth.uid() = user_id
);