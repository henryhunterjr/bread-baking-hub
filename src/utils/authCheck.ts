import { supabase } from '@/integrations/supabase/client';

// Simple authentication check that doesn't rely on React hooks
export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth check error:', error);
      return { user: null, session: null, isAuthenticated: false };
    }
    
    return {
      user: session?.user || null,
      session,
      isAuthenticated: !!session?.user
    };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { user: null, session: null, isAuthenticated: false };
  }
};

// Helper to redirect to auth page if not authenticated
export const requireAuth = async (navigate: (path: string) => void, currentPath?: string) => {
  const { isAuthenticated } = await checkAuthStatus();
  
  if (!isAuthenticated) {
    // Store the current path to redirect back after login
    if (currentPath) {
      localStorage.setItem('redirectAfterAuth', currentPath);
    }
    navigate('/auth');
    return false;
  }
  
  return true;
};