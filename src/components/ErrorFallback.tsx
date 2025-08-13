import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  context?: string;
}

export const ErrorFallback = ({ error, resetError, context }: ErrorFallbackProps) => {
  const friendlyMessage = getFriendlyErrorMessage(error.message, context);

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Oops! Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{friendlyMessage}</p>
        <div className="flex gap-2">
          <Button onClick={resetError} variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="default"
            className="flex-1"
          >
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function getFriendlyErrorMessage(error: string, context?: string): string {
  if (error.includes('Network')) {
    return "We're having trouble connecting. Please check your internet connection and try again.";
  }
  if (error.includes('auth') || error.includes('permission')) {
    return "You need to be signed in to perform this action. Please log in and try again.";
  }
  if (error.includes('not found') || error.includes('404')) {
    return "The recipe or page you're looking for couldn't be found. It may have been moved or deleted.";
  }
  if (context === 'recipe') {
    return "There was a problem loading this recipe. Please try refreshing the page.";
  }
  if (context === 'save') {
    return "We couldn't save your changes right now. Please try again in a moment.";
  }
  return "Something unexpected happened. Our team has been notified and we're working on a fix.";
}