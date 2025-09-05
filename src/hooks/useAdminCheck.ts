import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/securityUtils';

export const useAdminCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('has_role', { 
            _user_id: user.id, 
            _role: 'admin' 
          });

        if (error) {
          console.error('Error checking admin role:', error);
          // Log security event for failed admin check
          await logSecurityEvent('admin_check_failed', user.id, { error: error.message });
          setIsAdmin(false);
        } else {
          const adminStatus = data || false;
          setIsAdmin(adminStatus);
          
          // Log admin access attempts
          if (adminStatus) {
            await logSecurityEvent('admin_access_granted', user.id);
          }
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        await logSecurityEvent('admin_check_error', user.id, { error: String(error) });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
};