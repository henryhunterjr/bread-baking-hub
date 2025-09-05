import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { logSecurityEvent } from '@/utils/securityUtils';

/**
 * Custom hook for enhanced authentication security monitoring
 * Automatically logs security events for authentication state changes
 */
export const useSecureAuth = () => {
  const { user, session, signOut } = useAuth();

  useEffect(() => {
    const logAuthEvent = async () => {
      if (user && session) {
        // Log successful authentication
        await logSecurityEvent('user_authenticated', user.id, {
          login_method: session.user?.app_metadata?.provider || 'email',
          user_email: session.user?.email
        });
      }
    };

    logAuthEvent();
  }, [user, session]);

  // Enhanced logout with security logging
  const secureSignOut = async () => {
    if (user) {
      await logSecurityEvent('user_logout', user.id);
    }
    await signOut();
  };

  // Session timeout handler
  useEffect(() => {
    if (session?.expires_at) {
      const expiryTime = new Date(session.expires_at * 1000);
      const timeUntilExpiry = expiryTime.getTime() - Date.now();
      
      if (timeUntilExpiry > 0) {
        const timeoutId = setTimeout(async () => {
          if (user) {
            await logSecurityEvent('session_timeout', user.id);
          }
          await secureSignOut();
        }, timeUntilExpiry);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [session, user]);

  return {
    user,
    session,
    signOut: secureSignOut,
    isAuthenticated: !!user
  };
};