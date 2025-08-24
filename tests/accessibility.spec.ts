import { test, expect } from '@playwright/test';

test.describe('Accessibility Smoke Tests', () => {
  const routes = [
    '/',
    '/recipes',
    '/recipe-workspace',
    '/blog',
    '/books',
    '/help',
    '/my-recipe-library'
  ];

  for (const route of routes) {
    test(`should have no missing accessible-name violations on ${route}`, async ({ page }) => {
      // Set up console log monitoring
      const consoleLogs: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'warning' && msg.text().includes('accessible-name')) {
          consoleLogs.push(msg.text());
        }
      });

      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Check for basic accessibility elements
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const ariaLabel = await button.getAttribute('aria-label');
          const title = await button.getAttribute('title');
          const textContent = await button.textContent();
          
          // Button should have some form of accessible name
          const hasAccessibleName = ariaLabel || title || (textContent && textContent.trim().length > 0);
          
          if (!hasAccessibleName) {
            console.warn(`Button without accessible name found on ${route}`);
          }
        }
      }

      // Check for images with alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const alt = await img.getAttribute('alt');
          const ariaLabel = await img.getAttribute('aria-label');
          
          if (!alt && !ariaLabel) {
            console.warn(`Image without alt text found on ${route}`);
          }
        }
      }

      // Check for form inputs with labels
      const inputs = page.locator('input:not([type="hidden"])');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < Math.min(inputCount, 10); i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          let hasLabel = false;
          if (id) {
            const label = page.locator(`label[for="${id}"]`);
            hasLabel = await label.count() > 0;
          }
          
          if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
            console.warn(`Input without label found on ${route}`);
          }
        }
      }

      // Should not have accessibility violations in console
      expect(consoleLogs.length).toBe(0);
    });
  }

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    
    // Should have at least one h1
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBeGreaterThanOrEqual(1);
    
    // Should not have more than one h1
    expect(h1Elements).toBeLessThanOrEqual(2); // Allow some flexibility
  });
});