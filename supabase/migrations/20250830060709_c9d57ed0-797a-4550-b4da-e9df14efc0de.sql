-- Security Migration: Fix Remaining Functions (without moving vector extension)
-- Address the remaining security warnings, but keep vector in public schema due to operator dependencies

-- Move the vector extension back to public schema since it has operator dependencies
ALTER EXTENSION vector SET SCHEMA public;

-- Fix remaining functions that need search_path set
CREATE OR REPLACE FUNCTION public.log_mfa_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.store_encrypted_mfa_secret(p_user_id uuid, p_method text, p_secret text, p_phone_number text DEFAULT NULL::text, p_backup_codes text[] DEFAULT NULL::text[])
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_decrypted_mfa_secret(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_user_mfa_status()
RETURNS TABLE(id uuid, method text, is_verified boolean, is_active boolean, created_at timestamp with time zone, updated_at timestamp with time zone, has_phone_number boolean, has_backup_codes boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_user_mfa_secret()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT secret FROM public.user_mfa 
  WHERE user_id = auth.uid() AND is_active = true
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.encrypt_mfa_secret(secret_text text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT encode(
    pgp_sym_encrypt(
      secret_text, 
      current_setting('app.settings.encryption_key', true)
    ), 
    'base64'
  );
$function$;

CREATE OR REPLACE FUNCTION public.decrypt_mfa_secret(encrypted_secret text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT pgp_sym_decrypt(
    decode(encrypted_secret, 'base64'),
    current_setting('app.settings.encryption_key', true)
  );
$function$;

CREATE OR REPLACE FUNCTION public.verify_backup_code(p_user_id uuid, p_backup_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;