import { test, expect } from '@playwright/test';

test.describe('Route Smoke Tests', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/recipes', name: 'Recipes' },
    { path: '/recipe-workspace', name: 'Workspace' },
    { path: '/blog', name: 'Blog' },
    { path: '/books', name: 'Books' },
    { path: '/help', name: 'Help' },
    { path: '/my-recipe-library', name: 'My Library' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/novemberchallenge', name: 'November Challenge' }
  ];

  for (const route of routes) {
    test(`should load ${route.name} (${route.path}) without errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const networkErrors: string[] = [];

      // Monitor console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Monitor network errors (excluding known analytics/dev calls)
      page.on('response', response => {
        const url = response.url();
        const status = response.status();
        
        // Ignore analytics calls and known dev-only failures
        const isAnalytics = url.includes('analytics') || 
                           url.includes('vercel') || 
                           url.includes('vitals') ||
                           url.includes('speed-insights');
        
        if (status >= 400 && !isAnalytics) {
          networkErrors.push(`${status} error on ${url}`);
        }
      });

      // Navigate to route
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      // Basic page load checks
      const bodyContent = await page.locator('body').textContent();
      expect(bodyContent).toBeTruthy();
      expect(bodyContent!.length).toBeGreaterThan(50);

      // Check for error boundary or crash indicators
      const hasErrorBoundary = bodyContent!.includes('Something went wrong') || 
                              bodyContent!.includes('Error boundary') ||
                              bodyContent!.includes('Application error');
      expect(hasErrorBoundary).toBeFalsy();

      // Check that page has rendered content (not just loading state)
      const hasLoadingOnly = bodyContent!.trim() === 'Loading...' || 
                            bodyContent!.includes('Loading') && bodyContent!.length < 100;
      expect(hasLoadingOnly).toBeFalsy();

      // Header should be present on most routes
      if (route.path !== '/dashboard') {
        await expect(page.locator('header')).toBeVisible();
      }

      // Route-specific checks
      if (route.path === '/recipes') {
        await expect(page.locator('text="Recipes"')).toBeVisible();
      } else if (route.path === '/blog') {
        await expect(page.locator('text="Blog"')).toBeVisible();
      } else if (route.path === '/recipe-workspace') {
        await expect(page.locator('text="Workspace"')).toBeVisible();
      } else if (route.path === '/help') {
        await expect(page.locator('text="Help"')).toBeVisible();
      }

      // Should not have critical console errors
      const criticalErrors = consoleErrors.filter(error => 
        error.includes('TypeError') || 
        error.includes('ReferenceError') ||
        error.includes('Uncaught')
      );
      expect(criticalErrors.length).toBe(0);

      // Should not have critical network errors
      const criticalNetworkErrors = networkErrors.filter(error => 
        error.includes('5xx') || 
        error.includes('404') ||
        error.includes('403')
      );
      expect(criticalNetworkErrors.length).toBe(0);
    });
  }

  test('should have functional navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test main navigation links
    await page.click('text="Recipes"');
    await expect(page).toHaveURL('/recipes');
    
    await page.click('text="Blog"');
    await expect(page).toHaveURL('/blog');
    
    await page.click('text="Workspace"');
    await expect(page).toHaveURL('/recipe-workspace');
    
    // Go back to home
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});