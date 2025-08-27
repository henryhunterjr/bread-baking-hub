-- Create admin user and profile for Henry
-- First, let's check if the user exists and create a profile
DO $$
DECLARE
    henry_user_id UUID := '66d74ee0-b848-4b4d-b37c-6197d5d01d66';
BEGIN
    -- Create/update profile for Henry with admin privileges
    INSERT INTO public.profiles (user_id, display_name, is_admin)
    VALUES (henry_user_id, 'Henry Hunter Jr', true)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        is_admin = true,
        display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
        updated_at = now();

    -- Also add to user_roles table for the role-based system
    INSERT INTO public.user_roles (user_id, role)
    VALUES (henry_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin access granted for Henry Hunter Jr (%)', henry_user_id;
END $$;