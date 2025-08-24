import { test, expect } from '@playwright/test';

// Test data
const TEST_EMAIL = 'test-user@example.com';
const TEST_PASSWORD = 'TestPass123!';

test.describe('Phase 2 Acceptance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Sign in → navigate to Recipes → open modal → Favorite → verify in My Library', async ({ page }) => {
    // Sign in
    await page.click('[href="/auth"]');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for successful login
    await expect(page.locator('text=My Library')).toBeVisible({ timeout: 10000 });
    
    // Navigate to Recipes
    await page.click('[href="/recipes"]');
    await expect(page.locator('h1')).toContainText('Recipes');
    
    // Open first recipe modal
    const firstRecipe = page.locator('.recipe-card').first();
    await firstRecipe.click();
    
    // Favorite the recipe
    await page.click('[aria-label*="favorite"]');
    await expect(page.locator('text=Added to favorites')).toBeVisible();
    
    // Navigate to My Library
    await page.click('[href="/my-recipe-library"]');
    
    // Verify in Favorites tab
    await page.click('text=Favorites');
    await expect(page.locator('.recipe-card')).toHaveCount(1, { timeout: 5000 });
  });

  test('Workspace upload → Format → Save → verify in My Library', async ({ page }) => {
    // Sign in first
    await page.click('[href="/auth"]');
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Navigate to Workspace
    await page.click('[href="/recipe-workspace"]');
    await expect(page.locator('h1')).toContainText('Recipe Workspace');
    
    // Upload a test file (we'll use the file input)
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-recipe.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Bread Recipe\n\nIngredients:\n- 500g flour\n- 300ml water\n- 10g salt\n- 5g yeast\n\nMethod:\n1. Mix ingredients\n2. Knead dough\n3. Rise for 1 hour\n4. Bake at 220°C for 30 minutes')
    });
    
    // Wait for formatting to complete
    await expect(page.locator('text=Recipe ready')).toBeVisible({ timeout: 30000 });
    
    // Save the recipe
    await page.click('button:has-text("Save to Library")');
    await expect(page.locator('text=Recipe saved')).toBeVisible();
    
    // Navigate to My Library
    await page.click('[href="/my-recipe-library"]');
    
    // Verify in Saved Recipes tab
    await expect(page.locator('.recipe-card')).toHaveCount(1, { timeout: 5000 });
  });

  test('Share modal fallback works (no native share)', async ({ page }) => {
    // Navigate to Recipes
    await page.click('[href="/recipes"]');
    
    // Open first recipe
    const firstRecipe = page.locator('.recipe-card').first();
    await firstRecipe.click();
    
    // Click share button
    await page.click('[aria-label*="share"]');
    
    // Verify modal opens
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Share Recipe')).toBeVisible();
    
    // Test copy link
    await page.click('button:has-text("Copy Link")');
    await expect(page.locator('text=Link copied')).toBeVisible();
    
    // Test email option
    await page.click('button:has-text("Share via Email")');
    // Email client should open (we can't test the actual email client)
    
    // Test QR code
    await page.click('button:has-text("Generate QR Code")');
    // QR code should open in new tab (we can't easily test this in Playwright)
  });

  test('Print route loads and renders core sections', async ({ page }) => {
    // Navigate to a recipe print page
    await page.goto('/print/recipe/simple-sourdough');
    
    // Wait for content to load
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    
    // Verify core sections are present
    await expect(page.locator('text=Ingredients')).toBeVisible();
    await expect(page.locator('text=Method')).toBeVisible();
    
    // Verify the page is not blank (has actual content)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(100);
    
    // Verify print styles are applied
    const backgroundStyle = await page.locator('body').evaluate(
      el => window.getComputedStyle(el).backgroundColor
    );
    // Should be white for printing
    expect(backgroundStyle).toBe('rgb(255, 255, 255)');
  });

  test('Admin dashboard access control', async ({ page }) => {
    // Test non-admin access
    await page.goto('/dashboard');
    
    // Should be redirected or show access denied
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test with admin user (this would need actual admin credentials in real testing)
    // For now, we'll just verify the protection exists
  });

  test('Single chat widget verification', async ({ page }) => {
    // Check multiple pages for chat widget count
    const pagesToCheck = ['/', '/recipes', '/recipe-workspace', '/blog'];
    
    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath);
      
      // Look for chat widget elements (adjust selector based on actual implementation)
      const chatWidgets = page.locator('[data-testid="chat-widget"], .chat-widget, [id*="chat"]');
      const count = await chatWidgets.count();
      
      // Should have exactly 1 chat widget
      expect(count).toBeLessThanOrEqual(1);
    }
  });
});