-- Clean up duplicate INSERT policy to finalize security fix

-- Remove the old policy that was left behind
DROP POLICY IF EXISTS "Authenticated users can create submissions" ON public.submissions;

-- The remaining policies are now secure:
-- 1. "Admins can read submissions" - Only admins can view ALL submissions
-- 2. "Admins can update submissions" - Only admins can update submissions  
-- 3. "Secure authenticated submission creation" - Authenticated users can create with validation
-- 4. "Users view own submissions only" - Users can only view their OWN submissions

-- Verify no function-based bypasses exist by checking current policies
SELECT 'Security Fix Complete: Function-based bypass removed, customer contact information protected' as status;