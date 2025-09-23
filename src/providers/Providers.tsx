import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/hooks/useAuth';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ChatProvider } from '@/components/ChatProvider';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, refetchOnReconnect: false, staleTime: 60_000 } }
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ChatProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </AuthProvider>
        </ChatProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}