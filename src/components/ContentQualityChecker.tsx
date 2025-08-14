import * as React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface QualityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
}

interface ContentQualityCheckerProps {
  enabled?: boolean;
  showInProduction?: boolean;
}

export const ContentQualityChecker = ({ 
  enabled = process.env.NODE_ENV === 'development',
  showInProduction = false 
}: ContentQualityCheckerProps) => {
  const [issues, setIssues] = React.useState<QualityIssue[]>([]);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!enabled && !showInProduction) return;

    const checkContentQuality = () => {
      const foundIssues: QualityIssue[] = [];

      // Check H1 tags - should have exactly one per page
      const h1Elements = document.querySelectorAll('h1');
      if (h1Elements.length === 0) {
        foundIssues.push({
          type: 'error',
          message: 'No H1 tag found on page',
          element: 'h1'
        });
      } else if (h1Elements.length > 1) {
        foundIssues.push({
          type: 'error',
          message: `Multiple H1 tags found (${h1Elements.length}). Should have exactly one.`,
          element: 'h1'
        });
      }

      // Check heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      
      headings.forEach((heading, index) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        
        if (index > 0 && currentLevel > previousLevel + 1) {
          foundIssues.push({
            type: 'warning',
            message: `Heading hierarchy skip: ${heading.tagName} follows H${previousLevel}`,
            element: heading.tagName.toLowerCase()
          });
        }
        
        previousLevel = currentLevel;
      });

      // Check images without alt text or with poor alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        const alt = img.getAttribute('alt');
        const src = img.getAttribute('src');
        
        if (!alt) {
          foundIssues.push({
            type: 'error',
            message: `Image ${index + 1} missing alt text`,
            element: `img[src="${src}"]`
          });
        } else if (alt.length < 3) {
          foundIssues.push({
            type: 'warning',
            message: `Image ${index + 1} has very short alt text: "${alt}"`,
            element: `img[src="${src}"]`
          });
        } else if (alt.includes('image') || alt.includes('photo') || alt.includes('picture')) {
          foundIssues.push({
            type: 'info',
            message: `Image ${index + 1} alt text could be more descriptive: "${alt}"`,
            element: `img[src="${src}"]`
          });
        }
        
        // Check for filename-based alt text
        const filename = src?.split('/').pop()?.split('?')[0];
        if (filename && alt === filename) {
          foundIssues.push({
            type: 'warning',
            message: `Image ${index + 1} alt text appears to be a filename: "${alt}"`,
            element: `img[src="${src}"]`
          });
        }
      });

      // Check for missing meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription || !metaDescription.getAttribute('content')) {
        foundIssues.push({
          type: 'error',
          message: 'Missing meta description',
          element: 'meta[name="description"]'
        });
      } else {
        const content = metaDescription.getAttribute('content') || '';
        if (content.length < 120) {
          foundIssues.push({
            type: 'warning',
            message: `Meta description too short (${content.length} chars). Aim for 150-160.`,
            element: 'meta[name="description"]'
          });
        } else if (content.length > 160) {
          foundIssues.push({
            type: 'warning',
            message: `Meta description too long (${content.length} chars). May be truncated.`,
            element: 'meta[name="description"]'
          });
        }
      }

      // Check for links without meaningful text
      const links = document.querySelectorAll('a');
      links.forEach((link, index) => {
        const text = link.textContent?.trim();
        const badLinkTexts = ['click here', 'read more', 'here', 'link', 'more'];
        
        if (text && badLinkTexts.includes(text.toLowerCase())) {
          foundIssues.push({
            type: 'info',
            message: `Link ${index + 1} has non-descriptive text: "${text}"`,
            element: 'a'
          });
        }
      });

      setIssues(foundIssues);
    };

    // Initial check
    checkContentQuality();

    // Check again after DOM mutations
    const observer = new MutationObserver(() => {
      setTimeout(checkContentQuality, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['alt', 'src']
    });

    return () => observer.disconnect();
  }, [enabled, showInProduction]);

  if (!enabled && !showInProduction) return null;
  if (issues.length === 0) return null;

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
        title={`Content Quality: ${errorCount} errors, ${warningCount} warnings, ${infoCount} suggestions`}
      >
        <AlertTriangle className="w-5 h-5" />
        {errorCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {errorCount}
          </span>
        )}
      </button>

      {isVisible && (
        <div className="absolute bottom-16 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">Content Quality Report</h3>
            <p className="text-sm text-gray-600">
              {errorCount} errors, {warningCount} warnings, {infoCount} suggestions
            </p>
          </div>
          
          <div className="p-4 space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {issue.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  {issue.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{issue.message}</p>
                  {issue.element && (
                    <p className="text-xs text-gray-500 mt-1">Element: {issue.element}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};