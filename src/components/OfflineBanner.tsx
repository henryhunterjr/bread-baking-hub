import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const OfflineBanner = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 rounded-none border-warning bg-warning text-warning-foreground">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're offline. Only saved content is available.
      </AlertDescription>
    </Alert>
  );
};