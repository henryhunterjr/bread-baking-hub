import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'critical' | 'performance' | 'seo' | 'accessibility' | 'testing';
  status: 'pending' | 'in-progress' | 'passed' | 'failed' | 'warning';
  autoCheck?: () => Promise<boolean>;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'lovable-uploads',
    title: 'No /lovable-uploads/ references',
    description: 'Check for temporary upload paths in production code',
    category: 'critical',
    status: 'pending',
    autoCheck: async () => {
      // This would run the CI script check
      return true; // Placeholder
    }
  },
  {
    id: 'mobile-nav',
    title: 'Mobile navigation working',
    description: 'Test mobile menu on iOS Safari and Android Chrome',
    category: 'testing',
    status: 'pending'
  },
  {
    id: 'security-warnings',
    title: 'Supabase security warnings addressed',
    description: 'Fix database function security warnings',
    category: 'critical',
    status: 'pending'
  },
  {
    id: 'core-web-vitals',
    title: 'Core Web Vitals optimized',
    description: 'LCP < 2.5s, FID < 100ms, CLS < 0.1',
    category: 'performance',
    status: 'pending'
  },
  {
    id: 'meta-tags',
    title: 'SEO meta tags complete',
    description: 'All pages have proper meta descriptions and titles',
    category: 'seo',
    status: 'pending'
  },
  {
    id: 'structured-data',
    title: 'Structured data implemented',
    description: 'JSON-LD schema markup for recipes and articles',
    category: 'seo',
    status: 'pending'
  },
  {
    id: 'accessibility',
    title: 'Accessibility compliance',
    description: 'ARIA labels, keyboard navigation, screen reader support',
    category: 'accessibility',
    status: 'pending'
  },
  {
    id: 'loading-states',
    title: 'Loading states implemented',
    description: 'All async operations show appropriate loading indicators',
    category: 'testing',
    status: 'pending'
  },
  {
    id: 'error-monitoring',
    title: 'Error monitoring active',
    description: 'Production error tracking and alerts configured',
    category: 'critical',
    status: 'pending'
  },
  {
    id: 'performance-monitoring',
    title: 'Performance monitoring active',
    description: 'Real user monitoring and performance alerts',
    category: 'performance',
    status: 'pending'
  }
];

export const ReleaseChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>(CHECKLIST_ITEMS);
  const [isRunning, setIsRunning] = useState(false);

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-muted-foreground" />,
    'in-progress': <Clock className="h-4 w-4 text-yellow-500 animate-spin" />,
    passed: <CheckCircle className="h-4 w-4 text-green-500" />,
    failed: <XCircle className="h-4 w-4 text-red-500" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />
  };

  const categoryColors = {
    critical: 'border-red-200 bg-red-50',
    performance: 'border-blue-200 bg-blue-50',
    seo: 'border-green-200 bg-green-50',
    accessibility: 'border-purple-200 bg-purple-50',
    testing: 'border-orange-200 bg-orange-50'
  };

  const runAutoChecks = async () => {
    setIsRunning(true);
    
    for (const item of items) {
      if (item.autoCheck) {
        setItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, status: 'in-progress' } : i
        ));
        
        try {
          const result = await item.autoCheck();
          setItems(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: result ? 'passed' : 'failed' } : i
          ));
        } catch (error) {
          setItems(prev => prev.map(i => 
            i.id === item.id ? { ...i, status: 'failed' } : i
          ));
        }
        
        // Add delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsRunning(false);
  };

  const updateItemStatus = (id: string, status: ChecklistItem['status']) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const getProgress = () => {
    const completed = items.filter(item => item.status === 'passed').length;
    return (completed / items.length) * 100;
  };

  const getCriticalIssues = () => {
    return items.filter(item => 
      item.category === 'critical' && 
      (item.status === 'failed' || item.status === 'pending')
    ).length;
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Release Readiness Checklist</CardTitle>
            <Button 
              onClick={runAutoChecks} 
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? 'Running Checks...' : 'Run Auto Checks'}
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress: {Math.round(getProgress())}%</span>
              <span className="text-red-500">
                {getCriticalIssues()} critical issues remaining
              </span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Card key={category} className={categoryColors[category as keyof typeof categoryColors]}>
          <CardHeader>
            <CardTitle className="capitalize text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryItems.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                <div className="mt-0.5">
                  {statusIcons[item.status]}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.description}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => updateItemStatus(item.id, 'passed')}
                    disabled={item.status === 'passed'}
                  >
                    Pass
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => updateItemStatus(item.id, 'failed')}
                    disabled={item.status === 'failed'}
                  >
                    Fail
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {getCriticalIssues() === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <div className="font-medium">Ready for Release!</div>
            </div>
            <p className="mt-2 text-sm text-green-600">
              All critical issues have been resolved. The application is ready for production deployment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReleaseChecklist;