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
  // Simplified React check - just ensure React is available
  const ReactInstance = (globalThis as any).React;
  if (!ReactInstance || typeof ReactInstance.createElement !== 'function') {
    console.error('React not available, rendering children only');
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