import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/hooks/useAuth';
import { TooltipProvider } from '@/components/ui/safe-tooltip';
import { ChatProvider } from '@/components/ChatProvider';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import { validateReactComponent, ensureSingleReactInstance } from '@/utils/provider-validation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60_000,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Ensure single React instance
  if (!ensureSingleReactInstance()) {
    console.error('React instance validation failed');
    return <>{children}</>;
  }

  // Runtime guard to ensure all providers are valid React components
  const providersValid = [
    validateReactComponent(HelmetProvider, 'HelmetProvider'),
    validateReactComponent(QueryClientProvider, 'QueryClientProvider'), 
    validateReactComponent(AccessibilityProvider, 'AccessibilityProvider'),
    validateReactComponent(ChatProvider, 'ChatProvider'),
    validateReactComponent(AuthProvider, 'AuthProvider'),
    validateReactComponent(TooltipProvider, 'TooltipProvider')
  ].every(Boolean);

  if (!providersValid) {
    console.error('Provider validation failed, rendering children without providers');
    return <>{children}</>;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <ChatProvider>
            <AuthProvider>
              <TooltipProvider delayDuration={200}>
                {children}
              </TooltipProvider>
            </AuthProvider>
          </ChatProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}