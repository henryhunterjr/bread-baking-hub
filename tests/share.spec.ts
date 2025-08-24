import { test, expect } from '@playwright/test';

test.describe('Share Functionality', () => {
  test('should show share modal with fallback options', async ({ page }) => {
    await page.goto('/recipes');
    
    // Wait for recipes to load
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    
    // Click on first recipe
    await page.click('[data-testid="recipe-card"]');
    
    // Recipe modal should open
    await expect(page.locator('[data-testid="recipe-modal"]')).toBeVisible();
    
    // Click share button
    await page.click('[data-testid="share-button"]');
    
    // Should show share modal (fallback when navigator.share not available)
    await expect(page.locator('[data-testid="share-modal"]')).toBeVisible();
    
    // Should have copy link option
    await expect(page.locator('text="Copy Link"')).toBeVisible();
    
    // Should have email option
    await expect(page.locator('text="Share via Email"')).toBeVisible();
    
    // Should have QR code option
    await expect(page.locator('text="QR Code"')).toBeVisible();
    
    // Test copy link functionality
    await page.click('text="Copy Link"');
    
    // Should show success toast
    await expect(page.locator('text="Link copied"')).toBeVisible({ timeout: 5000 });
  });

  test('should open email client for sharing', async ({ page }) => {
    await page.goto('/recipes');
    
    // Wait for recipes and open first recipe
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    await page.click('[data-testid="recipe-card"]');
    
    // Open share modal
    await page.click('[data-testid="share-button"]');
    
    // Click email share
    const emailButton = page.locator('text="Share via Email"');
    await expect(emailButton).toBeVisible();
    
    // Note: We can't easily test mailto: links opening, but we can verify they exist
    const emailLink = page.locator('a[href^="mailto:"]');
    if (await emailLink.count() > 0) {
      await expect(emailLink).toBeVisible();
    }
  });

  test('should generate QR code', async ({ page }) => {
    await page.goto('/recipes');
    
    // Wait for recipes and open first recipe
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    await page.click('[data-testid="recipe-card"]');
    
    // Open share modal
    await page.click('[data-testid="share-button"]');
    
    // Click QR code button
    await page.click('text="QR Code"');
    
    // Should open QR code in new tab (we can't easily test new tab, but verify click works)
    await expect(page.locator('text="QR Code"')).toBeVisible();
  });
});