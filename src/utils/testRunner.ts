// Automated testing utilities for final verification
import { runRichResultsValidation } from './richResultsValidation';

export interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export const runPerformanceTests = (): TestResult[] => {
  const results: TestResult[] = [];

  // Test 1: Check for critical resource preloading
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  results.push({
    testName: 'Critical Resource Preloading',
    status: preloadLinks.length > 0 ? 'pass' : 'warning',
    message: `Found ${preloadLinks.length} preload links`,
    details: Array.from(preloadLinks).map(link => ({
      href: link.getAttribute('href'),
      as: link.getAttribute('as')
    }))
  });

  // Test 2: Check for lazy loading implementation
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const totalImages = document.querySelectorAll('img').length;
  const lazyPercentage = totalImages > 0 ? (lazyImages.length / totalImages) * 100 : 0;
  
  results.push({
    testName: 'Image Lazy Loading',
    status: lazyPercentage > 70 ? 'pass' : 'warning',
    message: `${lazyPercentage.toFixed(1)}% of images use lazy loading`,
    details: { lazyImages: lazyImages.length, totalImages }
  });

  // Test 3: Check for explicit image dimensions
  const imagesWithDimensions = Array.from(document.querySelectorAll('img')).filter(img => 
    img.width || img.height || img.style.aspectRatio || img.style.width || img.style.height
  );
  const dimensionPercentage = totalImages > 0 ? (imagesWithDimensions.length / totalImages) * 100 : 0;

  results.push({
    testName: 'Image Dimensions',
    status: dimensionPercentage > 80 ? 'pass' : 'warning',
    message: `${dimensionPercentage.toFixed(1)}% of images have explicit dimensions`,
    details: { withDimensions: imagesWithDimensions.length, totalImages }
  });

  // Test 4: Check for font optimization
  const fontPreloads = document.querySelectorAll('link[rel="preload"][as="font"]');
  const fontOptimization = document.querySelector('style[data-critical]');
  
  results.push({
    testName: 'Font Optimization',
    status: fontOptimization ? 'pass' : 'warning',
    message: `Critical CSS injection: ${fontOptimization ? 'enabled' : 'disabled'}`,
    details: { fontPreloads: fontPreloads.length }
  });

  return results;
};

export const runAccessibilityTests = (): TestResult[] => {
  const results: TestResult[] = [];

  // Test 1: Skip link functionality
  const skipLink = document.querySelector('a[href="#main-content"]');
  const mainContent = document.querySelector('#main-content');
  
  results.push({
    testName: 'Skip Link',
    status: skipLink && mainContent ? 'pass' : 'fail',
    message: skipLink && mainContent ? 'Skip link properly implemented' : 'Skip link missing or target not found'
  });

  // Test 2: Heading hierarchy
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let headingErrors = 0;
  let previousLevel = 0;

  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    if (currentLevel > previousLevel + 1) {
      headingErrors++;
    }
    previousLevel = currentLevel;
  });

  results.push({
    testName: 'Heading Hierarchy',
    status: headingErrors === 0 ? 'pass' : 'fail',
    message: headingErrors === 0 ? 'Proper heading hierarchy' : `${headingErrors} heading hierarchy issues found`,
    details: { totalHeadings: headings.length, errors: headingErrors }
  });

  // Test 3: Image alt text
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
  
  results.push({
    testName: 'Image Alt Text',
    status: imagesWithoutAlt.length === 0 ? 'pass' : 'fail',
    message: imagesWithoutAlt.length === 0 ? 'All images have alt text' : `${imagesWithoutAlt.length} images missing alt text`,
    details: { totalImages: images.length, missingAlt: imagesWithoutAlt.length }
  });

  // Test 4: Interactive element labels
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  const unlabeledElements = Array.from(interactiveElements).filter(element => {
    const hasLabel = element.getAttribute('aria-label') || 
                    element.getAttribute('aria-labelledby') ||
                    element.textContent?.trim() ||
                    element.getAttribute('title') ||
                    (element as HTMLInputElement).placeholder;
    return !hasLabel;
  });

  results.push({
    testName: 'Interactive Element Labels',
    status: unlabeledElements.length === 0 ? 'pass' : 'warning',
    message: unlabeledElements.length === 0 ? 'All interactive elements labeled' : `${unlabeledElements.length} elements may need labels`,
    details: { totalElements: interactiveElements.length, unlabeled: unlabeledElements.length }
  });

  // Test 5: Color contrast (basic check)
  const textElements = document.querySelectorAll('p, span, div, button, a, h1, h2, h3, h4, h5, h6');
  let contrastIssues = 0;

  Array.from(textElements).forEach(element => {
    const styles = getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // Very basic contrast check
    if (color === backgroundColor || (color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(255, 255, 255)')) {
      contrastIssues++;
    }
  });

  results.push({
    testName: 'Color Contrast (Basic)',
    status: contrastIssues === 0 ? 'pass' : 'warning',
    message: contrastIssues === 0 ? 'No obvious contrast issues' : `${contrastIssues} potential contrast issues`,
    details: { totalElements: textElements.length, issues: contrastIssues }
  });

  return results;
};

export const runSEOTests = (): TestResult[] => {
  const results: TestResult[] = [];

  // Test 1: Basic meta tags
  const title = document.querySelector('title');
  const description = document.querySelector('meta[name="description"]');
  const canonical = document.querySelector('link[rel="canonical"]');

  results.push({
    testName: 'Basic SEO Meta Tags',
    status: title && description && canonical ? 'pass' : 'fail',
    message: `Title: ${!!title}, Description: ${!!description}, Canonical: ${!!canonical}`,
    details: {
      titleLength: title?.textContent?.length || 0,
      descriptionLength: description?.getAttribute('content')?.length || 0
    }
  });

  // Test 2: Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');

  results.push({
    testName: 'Open Graph Tags',
    status: ogTitle && ogDescription && ogImage ? 'pass' : 'warning',
    message: `OG Title: ${!!ogTitle}, OG Description: ${!!ogDescription}, OG Image: ${!!ogImage}`
  });

  // Test 3: Structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  results.push({
    testName: 'Structured Data',
    status: structuredData.length > 0 ? 'pass' : 'warning',
    message: `Found ${structuredData.length} structured data blocks`
  });

  // Test 4: Rich results validation
  const richResultsValidation = runRichResultsValidation();
  results.push({
    testName: 'Rich Results Validation',
    status: richResultsValidation.isValid ? 'pass' : richResultsValidation.errors.length > 0 ? 'fail' : 'warning',
    message: `Errors: ${richResultsValidation.errors.length}, Warnings: ${richResultsValidation.warnings.length}`,
    details: richResultsValidation
  });

  return results;
};

export const runCrossBrowserTests = (): TestResult[] => {
  const results: TestResult[] = [];

  // Test 1: Browser feature support
  const features = {
    webp: 'CSS.supports("background-image", "url(data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==)")',
    grid: 'CSS.supports("display", "grid")',
    flexbox: 'CSS.supports("display", "flex")',
    customProperties: 'CSS.supports("color", "var(--test)")',
    intersectionObserver: 'typeof IntersectionObserver !== "undefined"',
    serviceWorker: '"serviceWorker" in navigator'
  };

  const supportedFeatures = Object.entries(features).filter(([name, test]) => {
    try {
      return eval(test);
    } catch {
      return false;
    }
  });

  results.push({
    testName: 'Browser Feature Support',
    status: supportedFeatures.length >= 4 ? 'pass' : 'warning',
    message: `${supportedFeatures.length}/${Object.keys(features).length} features supported`,
    details: { supported: supportedFeatures.map(([name]) => name) }
  });

  // Test 2: Responsive design breakpoints
  const viewport = window.visualViewport || { width: window.innerWidth, height: window.innerHeight };
  const isResponsive = viewport.width >= 320 && viewport.width <= 1920;

  results.push({
    testName: 'Responsive Viewport',
    status: isResponsive ? 'pass' : 'warning',
    message: `Viewport: ${viewport.width}x${viewport.height}`,
    details: { width: viewport.width, height: viewport.height }
  });

  return results;
};

export const runAllTests = () => {
  console.group('🔍 Final Performance & Testing Verification');
  
  const performanceResults = runPerformanceTests();
  const accessibilityResults = runAccessibilityTests();
  const seoResults = runSEOTests();
  const crossBrowserResults = runCrossBrowserTests();

  const allResults = [
    ...performanceResults,
    ...accessibilityResults,
    ...seoResults,
    ...crossBrowserResults
  ];

  // Summary
  const passed = allResults.filter(r => r.status === 'pass').length;
  const failed = allResults.filter(r => r.status === 'fail').length;
  const warnings = allResults.filter(r => r.status === 'warning').length;

  console.group('📊 Test Summary');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  console.groupEnd();

  // Detailed results
  console.group('📋 Detailed Results');
  allResults.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${result.testName}: ${result.message}`);
    if (result.details) {
      console.log('   Details:', result.details);
    }
  });
  console.groupEnd();

  console.groupEnd();

  return {
    summary: { passed, failed, warnings, total: allResults.length },
    results: allResults,
    score: ((passed + warnings * 0.5) / allResults.length) * 100
  };
};