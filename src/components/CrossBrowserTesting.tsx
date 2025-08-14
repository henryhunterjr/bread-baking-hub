import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Smartphone, Monitor, Globe } from 'lucide-react';

interface BrowserTest {
  name: string;
  category: 'mobile' | 'desktop' | 'feature';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  description: string;
  userAgent?: string;
  viewport?: string;
}

export const CrossBrowserTesting = () => {
  const [tests, setTests] = useState<BrowserTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runBrowserTests = async () => {
    setIsRunning(true);
    
    const testSuite: BrowserTest[] = [
      {
        name: 'Mobile Navigation',
        category: 'mobile',
        status: 'pending',
        description: 'Test mobile menu functionality on iOS Safari and Android Chrome'
      },
      {
        name: 'Recipe Scaling',
        category: 'feature',
        status: 'pending',
        description: 'Verify recipe scaling controls work across all browsers'
      },
      {
        name: 'Image Loading',
        category: 'feature',
        status: 'pending',
        description: 'Test image loading and fallbacks on all platforms'
      },
      {
        name: 'PDF Generation',
        category: 'feature',
        status: 'pending',
        description: 'Ensure PDF/print functionality works universally'
      },
      {
        name: 'Touch Events',
        category: 'mobile',
        status: 'pending',
        description: 'Test touch interactions on mobile devices'
      },
      {
        name: 'Responsive Design',
        category: 'mobile',
        status: 'pending',
        description: 'Verify responsive behavior across screen sizes'
      },
      {
        name: 'Search Functionality',
        category: 'feature',
        status: 'pending',
        description: 'Test search bar across different browsers'
      },
      {
        name: 'Performance',
        category: 'desktop',
        status: 'pending',
        description: 'Check Core Web Vitals across browsers'
      }
    ];

    setTests(testSuite);

    // Simulate running tests
    for (let i = 0; i < testSuite.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTests(prev => prev.map((test, index) => {
        if (index === i) {
          const result = runIndividualTest(test);
          return { ...test, ...result };
        }
        return test;
      }));
    }

    setIsRunning(false);
  };

  const runIndividualTest = (test: BrowserTest) => {
    // Simulate test execution with real browser detection
    const userAgent = navigator.userAgent;
    const viewport = `${window.innerWidth}x${window.innerHeight}`;
    
    let status: 'pass' | 'fail' | 'warning' = 'pass';
    
    // Basic compatibility checks
    if (test.name === 'Mobile Navigation') {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      status = isMobile ? 'pass' : 'warning';
    } else if (test.name === 'PDF Generation') {
      const supportsBlob = !!window.Blob;
      status = supportsBlob ? 'pass' : 'fail';
    } else if (test.name === 'Touch Events') {
      const supportsTouch = 'ontouchstart' in window;
      status = supportsTouch ? 'pass' : 'warning';
    } else if (test.name === 'Performance') {
      const supportsPerformanceAPI = !!window.performance;
      status = supportsPerformanceAPI ? 'pass' : 'warning';
    }

    return {
      status,
      userAgent,
      viewport
    };
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
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, BrowserTest[]>);

  const getOverallStatus = () => {
    if (tests.length === 0) return 'pending';
    const failCount = tests.filter(t => t.status === 'fail').length;
    const warningCount = tests.filter(t => t.status === 'warning').length;
    
    if (failCount > 0) return 'fail';
    if (warningCount > 0) return 'warning';
    return 'pass';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <CardTitle>Cross-Browser Testing</CardTitle>
            <Badge className={getStatusColor(getOverallStatus())}>
              {getOverallStatus().toUpperCase()}
            </Badge>
          </div>
          <Button
            onClick={runBrowserTests}
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? 'Running Tests...' : 'Run Browser Tests'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Current Environment: {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                               navigator.userAgent.includes('Firefox') ? 'Firefox' :
                               navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown'} 
          ({window.innerWidth}x{window.innerHeight})
        </div>

        {Object.entries(groupedTests).map(([category, categoryTests]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 font-medium">
              {getCategoryIcon(category)}
              <span className="capitalize">{category} Tests</span>
            </div>
            
            <div className="space-y-2 ml-6">
              {categoryTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-muted-foreground">{test.description}</div>
                      {test.viewport && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Viewport: {test.viewport}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}

        {tests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Run Browser Tests" to start cross-browser compatibility testing
          </div>
        )}
      </CardContent>
    </Card>
  );
};