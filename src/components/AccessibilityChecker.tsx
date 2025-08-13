import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Check, Eye, Keyboard } from 'lucide-react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  element?: string;
  suggestion?: string;
}

export const AccessibilityChecker = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Run accessibility audit on component mount and route changes
    const runAccessibilityAudit = () => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check 1: Images without alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt]), img[alt=""]');
      if (imagesWithoutAlt.length > 0) {
        foundIssues.push({
          type: 'error',
          category: 'Images',
          message: `${imagesWithoutAlt.length} images missing alt text`,
          suggestion: 'Add descriptive alt attributes to all images'
        });
      }

      // Check 2: Headings hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let previousLevel = 0;
      let hierarchyErrors = 0;

      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > previousLevel + 1) {
          hierarchyErrors++;
        }
        previousLevel = level;
      });

      if (hierarchyErrors > 0) {
        foundIssues.push({
          type: 'error',
          category: 'Headings',
          message: `${hierarchyErrors} heading hierarchy violations`,
          suggestion: 'Ensure headings follow a logical order (h1 → h2 → h3, etc.)'
        });
      }

      // Check 3: Interactive elements without labels
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      let unlabeledCount = 0;

      interactiveElements.forEach(element => {
        const hasLabel = element.getAttribute('aria-label') ||
                        element.getAttribute('aria-labelledby') ||
                        element.textContent?.trim() ||
                        (element as HTMLInputElement).placeholder ||
                        element.getAttribute('title');
        
        if (!hasLabel) {
          unlabeledCount++;
        }
      });

      if (unlabeledCount > 0) {
        foundIssues.push({
          type: 'warning',
          category: 'Labels',
          message: `${unlabeledCount} interactive elements may need labels`,
          suggestion: 'Add aria-label, aria-labelledby, or visible text to interactive elements'
        });
      }

      // Check 4: Color contrast (basic check)
      const textElements = document.querySelectorAll('p, span, div, button, a, h1, h2, h3, h4, h5, h6');
      let contrastIssues = 0;

      textElements.forEach(element => {
        const styles = getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Basic contrast check for obvious issues
        if (color === backgroundColor || 
            (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)')) {
          contrastIssues++;
        }
      });

      if (contrastIssues > 0) {
        foundIssues.push({
          type: 'warning',
          category: 'Contrast',
          message: `${contrastIssues} potential color contrast issues`,
          suggestion: 'Ensure text has sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)'
        });
      }

      // Check 5: Skip link
      const skipLink = document.querySelector('a[href="#main-content"]');
      if (!skipLink) {
        foundIssues.push({
          type: 'warning',
          category: 'Navigation',
          message: 'Missing skip link',
          suggestion: 'Add a "Skip to main content" link for keyboard users'
        });
      }

      // Check 6: Main landmark
      const mainLandmark = document.querySelector('main, [role="main"]');
      if (!mainLandmark) {
        foundIssues.push({
          type: 'error',
          category: 'Landmarks',
          message: 'Missing main content landmark',
          suggestion: 'Add <main> element or role="main" to identify the main content area'
        });
      }

      // Check 7: Focus management
      const focusableElements = document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      let focusIssues = 0;
      focusableElements.forEach(element => {
        const styles = getComputedStyle(element);
        if (styles.outline === 'none' && !styles.boxShadow.includes('focus')) {
          focusIssues++;
        }
      });

      if (focusIssues > 0) {
        foundIssues.push({
          type: 'warning',
          category: 'Focus',
          message: `${focusIssues} elements missing focus indicators`,
          suggestion: 'Ensure all interactive elements have visible focus indicators'
        });
      }

      // Check 8: Form labels
      const formInputs = document.querySelectorAll('input, select, textarea');
      let unlabeledInputs = 0;

      formInputs.forEach(input => {
        const id = input.getAttribute('id');
        const hasLabel = id && document.querySelector(`label[for="${id}"]`) ||
                         input.getAttribute('aria-label') ||
                         input.getAttribute('aria-labelledby');
        
        if (!hasLabel) {
          unlabeledInputs++;
        }
      });

      if (unlabeledInputs > 0) {
        foundIssues.push({
          type: 'error',
          category: 'Forms',
          message: `${unlabeledInputs} form inputs without labels`,
          suggestion: 'Associate form inputs with descriptive labels'
        });
      }

      setIssues(foundIssues);
    };

    // Run initial audit
    runAccessibilityAudit();

    // Re-run audit when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(runAccessibilityAudit, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip link activation (Alt + S)
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const skipLink = document.querySelector('a[href="#main-content"]') as HTMLElement;
        if (skipLink) {
          skipLink.focus();
          skipLink.click();
        }
      }

      // Accessibility report toggle (Alt + R)
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        setShowReport(!showReport);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showReport]);

  const errorCount = issues.filter(issue => issue.type === 'error').length;
  const warningCount = issues.filter(issue => issue.type === 'warning').length;

  if (!showReport && errorCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {/* Quick Status Indicator */}
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={() => setShowReport(!showReport)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
            errorCount > 0 
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : warningCount > 0
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
          aria-label={`Accessibility status: ${errorCount} errors, ${warningCount} warnings`}
        >
          {errorCount > 0 ? (
            <AlertTriangle className="h-4 w-4" />
          ) : warningCount > 0 ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          <span>A11y: {errorCount}E, {warningCount}W</span>
        </button>
      </div>

      {/* Detailed Report */}
      {showReport && (
        <div className="rounded-lg border bg-background p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Accessibility Report</h3>
            <button
              onClick={() => setShowReport(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close accessibility report"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {issues.length === 0 ? (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  No accessibility issues detected!
                </AlertDescription>
              </Alert>
            ) : (
              issues.map((issue, index) => (
                <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium">{issue.category}: {issue.message}</div>
                    {issue.suggestion && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        💡 {issue.suggestion}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>

          <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Keyboard className="h-3 w-3" />
                Alt+R: Toggle report
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Alt+S: Skip to main
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityChecker;