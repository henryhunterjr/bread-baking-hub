import { test, expect } from '@playwright/test';

test.describe('Recipe Functionality', () => {
  const testEmail = `recipetest${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Sign Up")').catch(async () => {
      await page.click('button:has-text("Sign In")');
    });
    await expect(page).toHaveURL('/');
  });

  test('should open recipe modal and favorite recipe', async ({ page }) => {
    // Go to recipes page
    await page.goto('/recipes');
    
    // Wait for recipes to load
    await page.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    
    // Click on first recipe
    await page.click('[data-testid="recipe-card"]');
    
    // Recipe modal should open
    await expect(page.locator('[data-testid="recipe-modal"]')).toBeVisible();
    
    // Click favorite button
    await page.click('[data-testid="favorite-button"]');
    
    // Should show favorited state
    await expect(page.locator('[data-testid="favorite-button"][data-favorited="true"]')).toBeVisible();
    
    // Close modal
    await page.press('body', 'Escape');
    
    // Go to My Library
    await page.click('text="My Library"');
    
    // Should see favorites tab
    await expect(page.locator('text="Favorites"')).toBeVisible();
    await page.click('text="Favorites"');
    
    // Should see the favorited recipe
    await expect(page.locator('[data-testid="recipe-card"]')).toBeVisible();
  });

  test('should show recipe count in My Library', async ({ page }) => {
    await page.goto('/my-recipe-library');
    
    // Should show tabs with counts
    await expect(page.locator('text="Saved"')).toBeVisible();
    await expect(page.locator('text="Favorites"')).toBeVisible();
    
    // Should show count badges if there are recipes
    const savedTab = page.locator('[data-testid="saved-tab"]');
    const favoritesTab = page.locator('[data-testid="favorites-tab"]');
    
    if (await savedTab.isVisible()) {
      await expect(savedTab).toContainText(/\d+/);
    }
    if (await favoritesTab.isVisible()) {
      await expect(favoritesTab).toContainText(/\d+/);
    }
  });
});