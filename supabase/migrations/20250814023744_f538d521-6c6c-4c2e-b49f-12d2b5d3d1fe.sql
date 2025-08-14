-- Fix security definer view issue by removing the view and using functions instead

-- Remove the security definer view
DROP VIEW IF EXISTS public.user_mfa_status;

-- Create a secure function to get MFA status instead
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