import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Copy, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiagnosticIssue {
  metric: string;
  status: 'healthy' | 'warning' | 'critical';
  currentValue: string | number;
  targetValue: string | number;
  explanation: string;
  impact: string;
  fixes: string[];
  priority: 'high' | 'medium' | 'low';
}

interface HealthDiagnosticReportProps {
  healthStatus: {
    status: 'healthy' | 'warning' | 'critical';
    recent_events: number;
    error_rate: number;
    avg_lcp: number;
    timestamp: string;
  };
}

export const HealthDiagnosticReport = ({ healthStatus }: HealthDiagnosticReportProps) => {
  const { toast } = useToast();

  // Analyze each metric and generate diagnostic issues
  const diagnosticIssues: DiagnosticIssue[] = [];

  // Check Recent Events
  if (healthStatus.recent_events < 10) {
    diagnosticIssues.push({
      metric: 'Recent Events (1 hour)',
      status: 'warning',
      currentValue: healthStatus.recent_events,
      targetValue: '50+',
      explanation: 'Low event count suggests analytics tracking may not be properly implemented on all pages or user traffic is very low.',
      impact: 'You may be missing important user behavior data and unable to make data-driven decisions.',
      fixes: [
        'Verify analytics.track() is called on all key user interactions (clicks, form submissions, page views)',
        'Check browser console for any JavaScript errors preventing analytics from loading',
        'Ensure the analytics script is loaded on all pages',
        'Review if DNT (Do Not Track) is blocking too many users',
        'Check if ad blockers are preventing analytics collection'
      ],
      priority: 'high'
    });
  }

  // Check Error Rate
  if (healthStatus.error_rate > 5) {
    diagnosticIssues.push({
      metric: 'Error Rate (24 hours)',
      status: healthStatus.error_rate > 10 ? 'critical' : 'warning',
      currentValue: `${healthStatus.error_rate}%`,
      targetValue: '<5%',
      explanation: 'High error rate indicates users are encountering broken links, missing resources, or application errors.',
      impact: 'Poor user experience, potential loss of conversions, and damaged SEO rankings.',
      fixes: [
        'Review error logs in Supabase to identify specific 404 errors',
        'Check for broken internal links using a site crawler',
        'Verify all image URLs and asset paths are correct',
        'Implement proper redirects for moved or deleted pages',
        'Add error boundary components to catch React errors gracefully',
        'Monitor API endpoint failures and add retry logic',
        'Check browser console for JavaScript errors'
      ],
      priority: 'high'
    });
  }

  // Check LCP (Largest Contentful Paint)
  if (healthStatus.avg_lcp > 2500) {
    diagnosticIssues.push({
      metric: 'Largest Contentful Paint (LCP)',
      status: healthStatus.avg_lcp > 4000 ? 'critical' : 'warning',
      currentValue: `${healthStatus.avg_lcp}ms`,
      targetValue: '<2500ms',
      explanation: 'LCP measures how long it takes for the main content to load. Slow LCP means users wait too long to see your content.',
      impact: 'Users may leave before the page loads (high bounce rate), lower search engine rankings, and poor user experience.',
      fixes: [
        'Optimize and compress hero images (use WebP format, lazy loading)',
        'Enable image CDN for faster delivery',
        'Minimize render-blocking CSS and JavaScript',
        'Use code splitting to load only necessary JavaScript',
        'Implement server-side rendering (SSR) or static generation',
        'Reduce server response time (optimize API calls, use caching)',
        'Preload critical resources using <link rel="preload">',
        'Use font-display: swap for web fonts to prevent text blocking',
        'Remove unused CSS and JavaScript',
        'Enable gzip/brotli compression on server'
      ],
      priority: 'high'
    });
  }

  // Overall system health
  if (healthStatus.status === 'critical') {
    diagnosticIssues.push({
      metric: 'Overall System Health',
      status: 'critical',
      currentValue: 'Critical',
      targetValue: 'Healthy',
      explanation: 'Multiple critical issues detected that require immediate attention.',
      impact: 'System reliability is compromised, data collection may be incomplete, and user experience is significantly degraded.',
      fixes: [
        'Address all HIGH priority issues listed above immediately',
        'Check Supabase service status and connectivity',
        'Verify all environment variables are correctly set',
        'Review recent deployments for breaking changes',
        'Enable detailed logging to diagnose root causes',
        'Consider rollback to last known good version if issues persist'
      ],
      priority: 'high'
    });
  }

  // If everything is healthy
  if (diagnosticIssues.length === 0) {
    diagnosticIssues.push({
      metric: 'System Status',
      status: 'healthy',
      currentValue: 'Optimal',
      targetValue: 'Optimal',
      explanation: 'All metrics are within healthy ranges. Your analytics system is operating normally.',
      impact: 'Reliable data collection, good user experience, and optimal performance.',
      fixes: [
        'Continue monitoring metrics regularly',
        'Set up automated alerts for when metrics degrade',
        'Periodically review analytics data for insights',
        'Keep dependencies and libraries up to date'
      ],
      priority: 'low'
    });
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateReportText = () => {
    let report = `ANALYTICS HEALTH DIAGNOSTIC REPORT
Generated: ${new Date().toLocaleString()}

OVERALL STATUS: ${healthStatus.status.toUpperCase()}

CURRENT METRICS:
- Recent Events (1h): ${healthStatus.recent_events}
- Error Rate (24h): ${healthStatus.error_rate}%
- Average LCP: ${healthStatus.avg_lcp}ms

DIAGNOSTIC ISSUES FOUND: ${diagnosticIssues.length}

`;

    diagnosticIssues.forEach((issue, index) => {
      report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE #${index + 1}: ${issue.metric}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${issue.status.toUpperCase()}
Priority: ${issue.priority.toUpperCase()}
Current Value: ${issue.currentValue}
Target Value: ${issue.targetValue}

EXPLANATION:
${issue.explanation}

IMPACT:
${issue.impact}

RECOMMENDED FIXES:
${issue.fixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}
`;
    });

    report += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Address all HIGH priority issues immediately
2. Share this report with your development team or AI assistant
3. Implement fixes in order of priority
4. Re-run health check after each fix to verify improvement
5. Set up monitoring to track metrics over time

For AI Assistant Prompt:
"I need help fixing the following analytics issues in my web application. Please provide specific code examples and implementation steps for each fix listed above, prioritizing HIGH priority items first."
`;

    return report;
  };

  const copyReportToClipboard = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText);
    toast({
      title: "Report Copied",
      description: "Full diagnostic report copied to clipboard. Paste it into your AI assistant for help.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Health Diagnostic Report
          </h2>
          <p className="text-muted-foreground mt-1">
            Detailed analysis and actionable fixes for your analytics system
          </p>
        </div>
        <Button onClick={copyReportToClipboard} variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Copy Full Report
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>Current system status at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Overall Status</p>
              <Badge className="mt-2" variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}>
                {healthStatus.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issues Found</p>
              <p className="text-2xl font-bold mt-1">{diagnosticIssues.filter(i => i.status !== 'healthy').length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {diagnosticIssues.filter(i => i.priority === 'high').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Report Time</p>
              <p className="text-sm font-medium mt-1">{new Date(healthStatus.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Issues */}
      <div className="space-y-4">
        {diagnosticIssues.map((issue, index) => (
          <Card key={index} className="border-l-4" style={{
            borderLeftColor: issue.status === 'critical' ? '#ef4444' : 
                            issue.status === 'warning' ? '#f97316' : '#22c55e'
          }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(issue.status)}
                  <div>
                    <CardTitle className="text-lg">{issue.metric}</CardTitle>
                    <CardDescription className="mt-1">
                      <span className="font-semibold">Current:</span> {issue.currentValue} → 
                      <span className="font-semibold"> Target:</span> {issue.targetValue}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getPriorityColor(issue.priority)}>
                  {issue.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Explanation */}
              <div>
                <h4 className="font-semibold text-sm mb-2">📋 What This Means:</h4>
                <p className="text-sm text-muted-foreground">{issue.explanation}</p>
              </div>

              {/* Impact */}
              <div>
                <h4 className="font-semibold text-sm mb-2">⚠️ Impact:</h4>
                <p className="text-sm text-muted-foreground">{issue.impact}</p>
              </div>

              {/* Fixes */}
              <div>
                <h4 className="font-semibold text-sm mb-2">🔧 How to Fix:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {issue.fixes.map((fix, fixIndex) => (
                    <li key={fixIndex} className="pl-2">{fix}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle>🎯 Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Copy Full Report" above to copy this entire analysis</li>
            <li>Share the report with your AI assistant or development team</li>
            <li>Start with HIGH priority issues first</li>
            <li>Implement fixes one at a time and test each change</li>
            <li>Re-run the health check after fixes to verify improvement</li>
            <li>Set up automated monitoring to catch issues early</li>
          </ol>
          
          <div className="mt-4 p-3 bg-background rounded-md border">
            <p className="text-xs font-semibold mb-1">💡 AI Assistant Prompt:</p>
            <p className="text-xs text-muted-foreground">
              "I need help fixing analytics issues in my web application. I'll paste a diagnostic report. 
              Please provide specific code examples and step-by-step implementation for each fix, 
              starting with HIGH priority items."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
