import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ABTestProviderProps {
  children: React.ReactNode;
}

interface ABTestContextType {
  getVariant: (experimentName: string) => string | null;
  isLoading: boolean;
}

const ABTestContext = React.createContext<ABTestContextType>({
  getVariant: () => null,
  isLoading: true
});

export const ABTestProvider: React.FC<ABTestProviderProps> = ({ children }) => {
  const [variants, setVariants] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const sessionId = React.useMemo(() => {
    let id = sessionStorage.getItem('ab_session_id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('ab_session_id', id);
    }
    return id;
  }, []);

  useEffect(() => {
    loadExperiments();
  }, [user, sessionId]);

  const loadExperiments = async () => {
    try {
      // Get active experiments
      const { data: experiments } = await supabase
        .from('ab_experiments')
        .select('experiment_name')
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .or('end_date.is.null,end_date.gte.' + new Date().toISOString());

      if (!experiments) return;

      const newVariants: Record<string, string> = {};

      // Get variant assignments for each active experiment
      for (const experiment of experiments) {
        try {
          const { data: variant } = await supabase.rpc('assign_ab_variant', {
            experiment_name: experiment.experiment_name,
            user_identifier: user?.id || null,
            session_identifier: sessionId
          });

          if (variant) {
            newVariants[experiment.experiment_name] = variant;
          }
        } catch (error) {
          console.error(`Error assigning variant for ${experiment.experiment_name}:`, error);
        }
      }

      setVariants(newVariants);
    } catch (error) {
      console.error('Error loading A/B test experiments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVariant = (experimentName: string): string | null => {
    return variants[experimentName] || null;
  };

  return (
    <ABTestContext.Provider value={{ getVariant, isLoading }}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = () => {
  const context = React.useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
};

// Hook for specific A/B test usage
export const useABTestVariant = (experimentName: string) => {
  const { getVariant, isLoading } = useABTest();
  const variant = getVariant(experimentName);
  
  return {
    variant,
    isLoading,
    isControl: variant === 'control',
    isVariant: (variantName: string) => variant === variantName
  };
};

export default ABTestProvider;