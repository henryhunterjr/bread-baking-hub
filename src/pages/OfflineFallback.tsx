import { Button } from '@/components/ui/button';
import { WifiOff, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfflineFallback = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <WifiOff className="h-24 w-24 text-muted-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold text-primary">You're Offline</h1>
        
        <p className="text-lg text-muted-foreground">
          You're currently offline. Only saved content is available. 
          AI features and voice controls are temporarily disabled.
        </p>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can still access:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Previously viewed recipes</li>
            <li>• Saved images and content</li>
            <li>• App navigation</li>
          </ul>
        </div>
        
        <Button variant="hero" size="lg" asChild className="w-full">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OfflineFallback;