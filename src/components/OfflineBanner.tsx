import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Download } from 'lucide-react';
import { BlogPost } from '@/utils/blogFetcher';

interface OfflineBannerProps {
  onRetry?: () => void;
  cachedPosts?: BlogPost[];
}

const OfflineBanner = ({ onRetry, cachedPosts = [] }: OfflineBannerProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-orange-600" />
          <div className="flex-1">
            <h3 className="font-medium text-orange-800 dark:text-orange-400">
              You're currently offline
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {cachedPosts.length > 0 
                ? `Showing ${cachedPosts.length} cached blog posts. Some content may be outdated.`
                : 'Unable to load blog posts. Please check your connection.'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {cachedPosts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
                onClick={() => setShowBanner(false)}
              >
                <Download className="h-4 w-4 mr-1" />
                Use Cached
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
              onClick={() => {
                if (onRetry) {
                  onRetry();
                } else {
                  window.location.reload();
                }
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfflineBanner;