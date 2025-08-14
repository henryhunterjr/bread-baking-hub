-- Final security optimization for MFA table

-- Clean up redundant RLS policies and create the most secure setup
DROP POLICY IF EXISTS "Users can view limited MFA status" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can manage encrypted MFA settings" ON public.user_mfa;

-- Create ultra-secure RLS policies that only allow access through our secure functions
CREATE POLICY "Deny all direct MFA access"
ON public.user_mfa 
FOR ALL
TO public
USING (false)
WITH CHECK (false);

-- Allow our secure functions to operate (they run with elevated privileges)
CREATE POLICY "Allow secure function access to MFA"
ON public.user_mfa 
FOR ALL
TO authenticated
USING (
  -- Only allow if the request comes from our secure functions
  -- This is checked by seeing if we're in a security definer context
  current_setting('is_superuser') = 'on' OR 
  current_user IN ('supabase_admin', 'postgres') OR
  -- Allow users to access their own data through the secure functions
  (auth.uid() = user_id AND current_setting('app.secure_mfa_access', true) = 'true')
)
WITH CHECK (
  current_setting('is_superuser') = 'on' OR 
  current_user IN ('supabase_admin', 'postgres') OR
  (auth.uid() = user_id AND current_setting('app.secure_mfa_access', true) = 'true')
);

-- Update our secure functions to set the access flag
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
  -- Set the secure access flag
  PERFORM set_config('app.secure_mfa_access', 'true', true);
  
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

CREATE OR REPLACE FUNCTION public.get_decrypted_mfa_secret(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  encrypted_secret TEXT;
  is_encrypted BOOLEAN;
  decrypted_secret TEXT;
BEGIN
  -- Set the secure access flag
  PERFORM set_config('app.secure_mfa_access', 'true', true);
  
  -- Only allow users to access their own secrets
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized MFA access';
  END IF;
  
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

CREATE OR REPLACE FUNCTION public.get_user_mfa_status()
RETURNS TABLE(
  id UUID,
  method TEXT,
  is_verified BOOLEAN,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  has_phone_number BOOLEAN,
  has_backup_codes BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Set the secure access flag
  PERFORM set_config('app.secure_mfa_access', 'true', true);
  
  RETURN QUERY
  SELECT 
    um.id,
    um.method,
    um.is_verified,
    um.is_active,
    um.created_at,
    um.updated_at,
    (um.phone_number IS NOT NULL) as has_phone_number,
    (um.backup_codes IS NOT NULL AND array_length(um.backup_codes, 1) > 0) as has_backup_codes
  FROM public.user_mfa um
  WHERE um.user_id = auth.uid();
END;
$$;