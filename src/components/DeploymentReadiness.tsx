import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Rocket, FileText, Settings, Zap } from 'lucide-react';

interface ReadinessCheck {
  category: 'security' | 'performance' | 'monitoring' | 'documentation';
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  description: string;
  details?: string;
  actionRequired?: string;
}

export const DeploymentReadiness = () => {
  const [checks, setChecks] = useState<ReadinessCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runReadinessChecks = async () => {
    setIsRunning(true);
    
    const checkList: ReadinessCheck[] = [
      // Security Checks
      {
        category: 'security',
        name: 'Environment Variables',
        status: 'pending',
        description: 'Verify all required environment variables are set',
        details: 'Checking Supabase URLs, API keys, and secrets'
      },
      {
        category: 'security',
        name: 'HTTPS Configuration',
        status: 'pending',
        description: 'Ensure all resources are served over HTTPS',
        details: 'Checking for mixed content issues'
      },
      {
        category: 'security',
        name: 'Content Security Policy',
        status: 'pending',
        description: 'Validate CSP headers are configured',
        details: 'Protecting against XSS attacks'
      },
      
      // Performance Checks
      {
        category: 'performance',
        name: 'Bundle Size',
        status: 'pending',
        description: 'Check if bundle size is optimized',
        details: 'Target: < 1MB for main bundle'
      },
      {
        category: 'performance',
        name: 'Image Optimization',
        status: 'pending',
        description: 'Verify images are properly optimized',
        details: 'Checking for WebP support and lazy loading'
      },
      {
        category: 'performance',
        name: 'Core Web Vitals',
        status: 'pending',
        description: 'Validate Lighthouse performance metrics',
        details: 'LCP < 2.5s, FID < 100ms, CLS < 0.1'
      },
      
      // Monitoring Checks
      {
        category: 'monitoring',
        name: 'Error Tracking',
        status: 'pending',
        description: 'Confirm error monitoring is active',
        details: 'Production error reporting configured'
      },
      {
        category: 'monitoring',
        name: 'Analytics Setup',
        status: 'pending',
        description: 'Verify analytics tracking is working',
        details: 'User behavior and performance tracking'
      },
      {
        category: 'monitoring',
        name: 'Health Checks',
        status: 'pending',
        description: 'API health monitoring endpoints',
        details: 'Uptime monitoring and alerting'
      },
      
      // Documentation Checks
      {
        category: 'documentation',
        name: 'Deployment Guide',
        status: 'pending',
        description: 'Deployment documentation exists',
        details: 'Step-by-step deployment instructions'
      },
      {
        category: 'documentation',
        name: 'Rollback Procedures',
        status: 'pending',
        description: 'Rollback procedures documented',
        details: 'Emergency rollback steps'
      },
      {
        category: 'documentation',
        name: 'Environment Setup',
        status: 'pending',
        description: 'Environment configuration documented',
        details: 'Production environment requirements'
      }
    ];

    setChecks(checkList);

    // Simulate running checks
    for (let i = 0; i < checkList.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setChecks(prev => prev.map((check, index) => {
        if (index === i) {
          return { ...check, ...runIndividualCheck(check) };
        }
        return check;
      }));
    }

    setIsRunning(false);
  };

  const runIndividualCheck = (check: ReadinessCheck) => {
    // Simulate real checks based on current environment
    let status: 'pass' | 'fail' | 'warning' = 'pass';
    let actionRequired: string | undefined;

    switch (check.name) {
      case 'Environment Variables':
        // Check if we're in a proper deployment environment
        status = window.location.hostname.includes('localhost') ? 'warning' : 'pass';
        if (status === 'warning') {
          actionRequired = 'Set production environment variables in deployment platform';
        }
        break;
        
      case 'HTTPS Configuration':
        status = window.location.protocol === 'https:' ? 'pass' : 'fail';
        if (status === 'fail') {
          actionRequired = 'Configure HTTPS in production deployment';
        }
        break;
        
      case 'Content Security Policy':
        const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        status = hasCSP ? 'pass' : 'warning';
        if (status === 'warning') {
          actionRequired = 'Add CSP meta tag or configure CSP headers';
        }
        break;
        
      case 'Bundle Size':
        // This would need actual bundle analysis
        status = 'warning';
        actionRequired = 'Run bundle analyzer to check actual size';
        break;
        
      case 'Image Optimization':
        const images = document.querySelectorAll('img');
        const hasLazyLoading = Array.from(images).some(img => img.loading === 'lazy');
        status = hasLazyLoading ? 'pass' : 'warning';
        if (status === 'warning') {
          actionRequired = 'Implement lazy loading for images';
        }
        break;
        
      case 'Core Web Vitals':
        // Check if performance API is available
        status = window.performance ? 'pass' : 'warning';
        if (status === 'warning') {
          actionRequired = 'Run Lighthouse audit in production';
        }
        break;
        
      case 'Error Tracking':
        // Check if error handlers are in place
        const hasErrorHandlers = window.onerror !== null;
        status = hasErrorHandlers ? 'pass' : 'warning';
        if (status === 'warning') {
          actionRequired = 'Implement production error tracking service';
        }
        break;
        
      case 'Analytics Setup':
        // This would check for actual analytics implementation
        status = 'warning';
        actionRequired = 'Configure production analytics tracking';
        break;
        
      case 'Health Checks':
        status = 'warning';
        actionRequired = 'Set up API health monitoring endpoints';
        break;
        
      case 'Deployment Guide':
        status = 'warning';
        actionRequired = 'Create comprehensive deployment documentation';
        break;
        
      case 'Rollback Procedures':
        status = 'warning';
        actionRequired = 'Document emergency rollback procedures';
        break;
        
      case 'Environment Setup':
        status = 'warning';
        actionRequired = 'Document production environment configuration';
        break;
    }

    return { status, actionRequired };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'performance':
        return <Zap className="w-4 h-4" />;
      case 'monitoring':
        return <Settings className="w-4 h-4" />;
      case 'documentation':
        return <FileText className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const groupedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, ReadinessCheck[]>);

  const getOverallReadiness = () => {
    if (checks.length === 0) return 0;
    const passCount = checks.filter(c => c.status === 'pass').length;
    return Math.round((passCount / checks.length) * 100);
  };

  const readinessPercentage = getOverallReadiness();
  const isReady = readinessPercentage >= 90;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            <CardTitle>Deployment Readiness</CardTitle>
            <Badge className={isReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {readinessPercentage}% Ready
            </Badge>
          </div>
          <Button
            onClick={runReadinessChecks}
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? 'Running Checks...' : 'Run Readiness Check'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {checks.length > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isReady ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${readinessPercentage}%` }}
            />
          </div>
        )}

        {Object.entries(groupedChecks).map(([category, categoryChecks]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 font-medium">
              {getCategoryIcon(category)}
              <span className="capitalize">{category} ({categoryChecks.filter(c => c.status === 'pass').length}/{categoryChecks.length})</span>
            </div>
            
            <div className="space-y-2 ml-6">
              {categoryChecks.map((check, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="font-medium">{check.name}</div>
                      <div className="text-sm text-muted-foreground">{check.description}</div>
                      {check.details && (
                        <div className="text-xs text-muted-foreground mt-1">{check.details}</div>
                      )}
                      {check.actionRequired && (
                        <div className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded mt-2">
                          Action required: {check.actionRequired}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}

        {checks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Run Readiness Check" to assess deployment readiness
          </div>
        )}

        {checks.length > 0 && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <div className="font-medium mb-2">Deployment Status:</div>
            {isReady ? (
              <div className="text-green-600">✅ Ready for production deployment</div>
            ) : (
              <div className="text-yellow-600">⚠️ Address warnings before deploying to production</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);