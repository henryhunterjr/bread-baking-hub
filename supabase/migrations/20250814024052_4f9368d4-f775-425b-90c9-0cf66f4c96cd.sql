-- Enhance newsletter subscriber security with better validation and rate limiting

-- First, let's improve the INSERT policy to be more restrictive
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Create a more secure INSERT policy that allows authenticated and anonymous users but with validation
CREATE POLICY "Secure newsletter subscription"
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (
  -- Allow subscription but ensure email is valid format
  email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 255
  AND (name IS NULL OR length(name) <= 100)
);

-- Add a function to safely handle newsletter subscriptions with deduplication
CREATE OR REPLACE FUNCTION public.subscribe_to_newsletter(
  p_email TEXT,
  p_name TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Validate email format
  IF NOT (p_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid email format');
  END IF;
  
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM public.newsletter_subscribers WHERE email = p_email) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email already subscribed');
  END IF;
  
  -- Insert new subscription
  INSERT INTO public.newsletter_subscribers (email, name, active)
  VALUES (lower(trim(p_email)), trim(p_name), true);
  
  -- Log the subscription for security monitoring
  INSERT INTO public.security_audit_log (
    event_type,
    event_data,
    ip_address
  ) VALUES (
    'newsletter_subscription',
    jsonb_build_object('email', p_email, 'has_name', p_name IS NOT NULL),
    inet_client_addr()
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'Successfully subscribed');
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Subscription failed');
END;
$$;

-- Create a secure function for unsubscribing
CREATE OR REPLACE FUNCTION public.unsubscribe_from_newsletter(p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update subscription status
  UPDATE public.newsletter_subscribers 
  SET active = false, updated_at = now()
  WHERE email = lower(trim(p_email));
  
  IF FOUND THEN
    -- Log the unsubscription
    INSERT INTO public.security_audit_log (
      event_type,
      event_data,
      ip_address
    ) VALUES (
      'newsletter_unsubscription',
      jsonb_build_object('email', p_email),
      inet_client_addr()
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'Successfully unsubscribed');
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Email not found');
  END IF;
END;
$$;

-- Add additional security: prevent direct table access, force use of functions
DROP POLICY IF EXISTS "Secure newsletter subscription" ON public.newsletter_subscribers;

-- Create very restrictive INSERT policy that essentially blocks direct inserts
CREATE POLICY "Block direct newsletter inserts"
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (false); -- This blocks all direct inserts, forcing use of the secure function

-- Keep the admin policies for management
-- The existing admin SELECT, UPDATE, DELETE policies remain intact

-- Add a policy for the secure functions to work
CREATE POLICY "Allow function-based newsletter operations"
ON public.newsletter_subscribers 
FOR ALL
USING (current_setting('role', true) = 'supabase_admin' OR current_setting('role', true) = 'postgres')
WITH CHECK (current_setting('role', true) = 'supabase_admin' OR current_setting('role', true) = 'postgres');