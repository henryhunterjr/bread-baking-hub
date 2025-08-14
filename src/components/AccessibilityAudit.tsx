import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Eye, Keyboard, MousePointer } from 'lucide-react';

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'keyboard' | 'screen-reader' | 'color-contrast' | 'focus' | 'aria';
  element: string;
  description: string;
  suggestion: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
}

export const AccessibilityAudit = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [focusOutlineVisible, setFocusOutlineVisible] = useState(false);

  const runAccessibilityAudit = async () => {
    setIsScanning(true);
    const foundIssues: AccessibilityIssue[] = [];

    // Check for missing alt text
    document.querySelectorAll('img').forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        foundIssues.push({
          id: `img-alt-${index}`,
          type: 'error',
          category: 'screen-reader',
          element: `img[src="${img.src}"]`,
          description: 'Image missing alt text',
          suggestion: 'Add descriptive alt text for screen readers',
          wcagLevel: 'A'
        });
      }
    });

    // Check for missing ARIA labels on interactive elements
    document.querySelectorAll('button, a, input').forEach((element, index) => {
      const hasLabel = element.getAttribute('aria-label') || 
                      element.getAttribute('aria-labelledby') ||
                      (element as HTMLElement).innerText?.trim();
      
      if (!hasLabel) {
        foundIssues.push({
          id: `aria-label-${index}`,
          type: 'warning',
          category: 'aria',
          element: element.tagName.toLowerCase(),
          description: 'Interactive element missing accessible name',
          suggestion: 'Add aria-label or visible text content',
          wcagLevel: 'A'
        });
      }
    });

    // Check for proper heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let currentLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      if (level > currentLevel + 1) {
        foundIssues.push({
          id: `heading-hierarchy-${index}`,
          type: 'warning',
          category: 'screen-reader',
          element: heading.tagName.toLowerCase(),
          description: 'Heading level skipped in hierarchy',
          suggestion: 'Use proper heading level sequence (h1 → h2 → h3)',
          wcagLevel: 'AA'
        });
      }
      currentLevel = level;
    });

    // Check for color contrast (simplified)
    const checkContrast = (element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      
      // Basic check for white/black combinations (simplified)
      if (bgColor === 'rgb(255, 255, 255)' && textColor === 'rgb(128, 128, 128)') {
        return false; // Poor contrast
      }
      return true;
    };

    document.querySelectorAll('p, span, div').forEach((element, index) => {
      if ((element as HTMLElement).innerText?.trim() && !checkContrast(element as HTMLElement)) {
        foundIssues.push({
          id: `contrast-${index}`,
          type: 'error',
          category: 'color-contrast',
          element: element.tagName.toLowerCase(),
          description: 'Poor color contrast ratio',
          suggestion: 'Ensure contrast ratio meets WCAG AA standards (4.5:1)',
          wcagLevel: 'AA'
        });
      }
    });

    // Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === '-1' && element.tagName !== 'INPUT') {
        foundIssues.push({
          id: `keyboard-${index}`,
          type: 'warning',
          category: 'keyboard',
          element: element.tagName.toLowerCase(),
          description: 'Interactive element not keyboard accessible',
          suggestion: 'Remove tabindex="-1" or add keyboard event handlers',
          wcagLevel: 'A'
        });
      }
    });

    setIssues(foundIssues);
    setIsScanning(false);
  };

  const enableFocusOutlines = () => {
    setFocusOutlineVisible(!focusOutlineVisible);
    const style = document.getElementById('focus-outline-style') || document.createElement('style');
    style.id = 'focus-outline-style';
    
    if (!focusOutlineVisible) {
      style.textContent = `
        *:focus {
          outline: 3px solid #007BFF !important;
          outline-offset: 2px !important;
        }
      `;
    } else {
      style.textContent = '';
    }
    
    document.head.appendChild(style);
  };

  const testKeyboardNavigation = () => {
    alert('Use Tab to navigate forward, Shift+Tab to navigate backward. Ensure all interactive elements are reachable and usable with keyboard only.');
  };

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: AccessibilityIssue['category']) => {
    switch (category) {
      case 'keyboard': return <Keyboard className="h-4 w-4" />;
      case 'screen-reader': return <Eye className="h-4 w-4" />;
      case 'color-contrast': return <MousePointer className="h-4 w-4" />;
      case 'focus': return <MousePointer className="h-4 w-4" />;
      case 'aria': return <Eye className="h-4 w-4" />;
    }
  };

  const issuesByCategory = issues.reduce((acc, issue) => {
    if (!acc[issue.category]) acc[issue.category] = [];
    acc[issue.category].push(issue);
    return acc;
  }, {} as Record<string, AccessibilityIssue[]>);

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Audit</CardTitle>
          <div className="flex gap-4 flex-wrap">
            <Button 
              onClick={runAccessibilityAudit} 
              disabled={isScanning}
              variant="default"
            >
              {isScanning ? 'Scanning...' : 'Run Accessibility Scan'}
            </Button>
            <Button 
              onClick={enableFocusOutlines}
              variant={focusOutlineVisible ? 'default' : 'outline'}
            >
              {focusOutlineVisible ? 'Hide' : 'Show'} Focus Outlines
            </Button>
            <Button 
              onClick={testKeyboardNavigation}
              variant="outline"
            >
              Test Keyboard Navigation
            </Button>
          </div>
        </CardHeader>
        
        {issues.length > 0 && (
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Badge variant="destructive">{errorCount} Errors</Badge>
              <Badge variant="secondary">{warningCount} Warnings</Badge>
              <Badge variant="outline">{issues.length - errorCount - warningCount} Info</Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {Object.entries(issuesByCategory).map(([category, categoryIssues]) => (
        <Card key={category}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {getCategoryIcon(category as AccessibilityIssue['category'])}
              <CardTitle className="capitalize">{category.replace('-', ' ')}</CardTitle>
              <Badge variant="outline">{categoryIssues.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryIssues.map(issue => (
              <div key={issue.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{issue.description}</span>
                      <Badge variant="outline" className="text-xs">
                        WCAG {issue.wcagLevel}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Element: <code className="bg-muted px-1 rounded">{issue.element}</code>
                    </div>
                    <div className="text-sm bg-blue-50 p-2 rounded">
                      <strong>Suggestion:</strong> {issue.suggestion}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {issues.length === 0 && !isScanning && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No accessibility scan has been run yet.</p>
              <p className="text-sm">Click "Run Accessibility Scan" to check for issues.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessibilityAudit;