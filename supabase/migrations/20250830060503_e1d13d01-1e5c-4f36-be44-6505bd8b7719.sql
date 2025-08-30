-- Security Migration: Fix Remaining Functions and View Security
-- This addresses the remaining security warnings

-- Fix the view security issue by dropping and recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.blog_posts_public;

-- Create the view without SECURITY DEFINER (default is SECURITY INVOKER)
CREATE VIEW public.blog_posts_public AS
SELECT 
  id,
  title,
  slug,
  SUBSTRING(content, 1, 200) as excerpt,
  content,
  hero_image_url,
  inline_image_url,
  social_image_url,
  subtitle,
  tags,
  published_at,
  created_at,
  updated_at,
  -- Get author display name from profiles table instead of exposing user_id
  (SELECT display_name FROM public.profiles WHERE user_id = blog_posts.user_id) as author_display_name
FROM public.blog_posts
WHERE is_draft = false 
  AND published_at IS NOT NULL;

-- Grant access to the view for anonymous users
GRANT SELECT ON public.blog_posts_public TO anon;
GRANT SELECT ON public.blog_posts_public TO authenticated;

-- Fix remaining functions that need search_path set
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_content()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE profiles.user_id = is_admin_user.user_id), false);
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_user(user_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT user_email = 'henry@bakinggreatbread.blog';
$function$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT is_admin_user(auth.email());
$function$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(is_admin, false) 
  FROM public.profiles 
  WHERE user_id = auth.uid()
$function$;

CREATE OR REPLACE FUNCTION public.match_content(query_embedding vector, match_count integer, filter_type text)
RETURNS TABLE(content_id uuid, chunk_index integer, text_chunk text, score real)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT ce.content_id, ce.chunk_index, ce.text_chunk,
         1 - (ce.embedding <=> query_embedding) AS score
  FROM public.content_embeddings ce
  JOIN public.content_items ci ON ci.id = ce.content_id
  WHERE (filter_type IS NULL OR ci.type = filter_type)
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
$function$;

CREATE OR REPLACE FUNCTION public.get_auth_security_status()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN jsonb_build_object(
    'message', 'Auth security settings should be configured in Supabase Dashboard',
    'otp_expiry', 'Reduce OTP expiry to 600 seconds (10 minutes) in Auth > Settings',
    'password_protection', 'Enable leaked password protection in Auth > Settings',
    'timestamp', now()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_submission_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log sensitive data access for security monitoring
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_data,
    ip_address
  ) VALUES (
    auth.uid(),
    'submission_accessed',
    jsonb_build_object(
      'submission_id', NEW.id,
      'access_type', TG_OP,
      'table', TG_TABLE_NAME
    ),
    inet_client_addr()
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.subscribe_to_newsletter(p_email text, p_name text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.unsubscribe_from_newsletter(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_submissions()
RETURNS TABLE(id uuid, submitter_name text, submitter_email text, submission_data jsonb, submission_type text, priority text, status text, notes text, user_id uuid, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admins to access this function
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Unauthorized access - admin role required';
  END IF;
  
  -- Return all submissions for admin users
  RETURN QUERY
  SELECT 
    s.id,
    s.submitter_name,
    s.submitter_email,
    s.submission_data,
    s.submission_type,
    s.priority,
    s.status,
    s.notes,
    s.user_id,
    s.created_at,
    s.updated_at
  FROM public.submissions s
  ORDER BY s.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_secure_submission(p_submitter_name text, p_submitter_email text, p_submission_data jsonb, p_submission_type text DEFAULT 'family_contribution'::text, p_priority text DEFAULT 'normal'::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  submission_id UUID;
  current_user_id UUID;
BEGIN
  -- Ensure user is authenticated
  IF auth.role() != 'authenticated' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
  END IF;
  
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User ID required');
  END IF;
  
  -- Validate input data
  IF NOT (p_submitter_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid email format');
  END IF;
  
  IF length(p_submitter_name) = 0 OR length(p_submitter_name) > 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid name length');
  END IF;
  
  IF length(p_submitter_email) > 255 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email too long');
  END IF;
  
  -- Insert (RLS policies will validate automatically)
  INSERT INTO public.submissions (
    submitter_name,
    submitter_email,
    submission_data,
    submission_type,
    priority,
    user_id,
    status
  ) VALUES (
    trim(p_submitter_name),
    lower(trim(p_submitter_email)),
    p_submission_data,
    p_submission_type,
    p_priority,
    current_user_id,
    'pending'
  )
  RETURNING id INTO submission_id;
  
  -- Security audit log
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_data,
    ip_address
  ) VALUES (
    current_user_id,
    'submission_created',
    jsonb_build_object(
      'submission_id', submission_id,
      'submission_type', p_submission_type
    ),
    inet_client_addr()
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'submission_id', submission_id,
    'message', 'Submission created successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission failed');
END;
$function$;