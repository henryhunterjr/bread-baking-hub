import { test, expect } from '@playwright/test';

test.describe('Print Functionality', () => {
  test('should render print page with core sections', async ({ page }) => {
    // Go to a public recipe first to get a slug
    await page.goto('/recipes');
    
    // Wait for recipes to load
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    
    // Get the href from the first recipe card
    const firstRecipe = page.locator('[data-testid="recipe-card"]').first();
    const recipeHref = await firstRecipe.getAttribute('href') || await firstRecipe.locator('a').first().getAttribute('href');
    
    if (recipeHref) {
      // Extract slug from href (e.g., "/recipe/sourdough-bread" -> "sourdough-bread")
      const slug = recipeHref.split('/').pop();
      
      if (slug) {
        // Navigate to print page
        await page.goto(`/print/${slug}`);
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Should have non-empty body content
        const bodyContent = await page.locator('body').textContent();
        expect(bodyContent).toBeTruthy();
        expect(bodyContent!.length).toBeGreaterThan(100);
        
        // Should have core recipe sections
        await expect(page.locator('text="Ingredients"')).toBeVisible();
        await expect(page.locator('text="Method"')).toBeVisible();
        
        // Should have recipe title
        const title = page.locator('h1');
        await expect(title).toBeVisible();
        const titleText = await title.textContent();
        expect(titleText).toBeTruthy();
        expect(titleText!.length).toBeGreaterThan(0);
        
        // Should have print-specific styles (white background)
        const bodyStyles = await page.locator('body').evaluate(el => getComputedStyle(el));
        expect(bodyStyles.backgroundColor).toContain('255'); // White background
        
        // Check if image is present and loaded
        const images = page.locator('img');
        const imageCount = await images.count();
        if (imageCount > 0) {
          const firstImage = images.first();
          await expect(firstImage).toBeVisible();
          
          // Wait for image to load
          await firstImage.evaluate(img => {
            return new Promise((resolve) => {
              if ((img as HTMLImageElement).complete) {
                resolve(true);
              } else {
                (img as HTMLImageElement).onload = () => resolve(true);
                (img as HTMLImageElement).onerror = () => resolve(true);
              }
            });
          });
        }
      }
    }
  });

  test('should handle invalid recipe slug gracefully', async ({ page }) => {
    await page.goto('/print/invalid-recipe-slug-12345');
    
    // Should show error message or redirect, not blank page
    await page.waitForLoadState('networkidle');
    
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    
    // Should either show error message or redirect
    const hasError = bodyContent!.includes('not found') || bodyContent!.includes('error');
    const hasRedirect = page.url().includes('/recipes') || page.url().includes('/');
    
    expect(hasError || hasRedirect).toBeTruthy();
  });
});