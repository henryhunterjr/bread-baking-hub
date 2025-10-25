import React, { Component, ReactNode, ComponentType, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { logger } from '@/utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  componentName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

class ChunkLoadErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Check if this is a chunk load error
    const isChunkError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('Loading chunk') ||
      error.name === 'ChunkLoadError';

    return {
      hasError: true,
      error: isChunkError ? error : null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const isChunkError = 
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('Loading chunk') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      logger.error('Chunk loading error caught:', {
        component: this.props.componentName,
        error: error.message,
        retryCount: this.state.retryCount,
        errorInfo
      });

      // Auto-retry once for chunk errors
      if (this.state.retryCount === 0) {
        setTimeout(() => {
          this.handleRetry();
        }, 500);
      }
    } else {
      // Re-throw non-chunk errors to be handled by parent error boundary
      throw error;
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      retryCount: prevState.retryCount + 1
    }));
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to Load Component</AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p>
                The page couldn't load properly. This usually happens after a site update.
                Please refresh the page to get the latest version.
              </p>
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  variant="outline" 
                  size="sm"
                >
                  Go Home
                </Button>
              </div>
              {this.state.retryCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Retry attempt: {this.state.retryCount}
                </p>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC that wraps lazy-loaded components with chunk error handling
 */
export function withChunkErrorBoundary<P extends object>(
  LazyComponent: ComponentType<P>,
  componentName: string
): ComponentType<P> {
  return (props: P) => (
    <ChunkLoadErrorBoundary componentName={componentName}>
      <LazyComponent {...props} />
    </ChunkLoadErrorBoundary>
  );
}

/**
 * Enhanced lazy loader with automatic retry on chunk load failure
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
): React.LazyExoticComponent<T> {
  const LazyComponent = lazy(async () => {
    try {
      return await importFn();
    } catch (error: any) {
      const isChunkError = 
        error.message?.includes('Failed to fetch dynamically imported module') ||
        error.message?.includes('Importing a module script failed') ||
        error.message?.includes('Loading chunk') ||
        error.name === 'ChunkLoadError';

      if (isChunkError) {
        logger.error(`Chunk load failed for ${componentName}, will retry on mount`, error);
        // Return a component that will trigger the error boundary
        const ErrorComponent = (() => {
          throw error;
        }) as unknown as T;
        
        return {
          default: ErrorComponent
        };
      }
      throw error;
    }
  });

  return LazyComponent;
}
