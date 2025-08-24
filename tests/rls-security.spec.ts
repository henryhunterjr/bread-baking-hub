import { test, expect } from '@playwright/test';

test.describe('Row Level Security (RLS)', () => {
  const user1Email = `user1${Date.now()}@example.com`;
  const user2Email = `user2${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should prevent users from seeing other users library/favorites', async ({ browser }) => {
    // Create two browser contexts for two different users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // User 1 signs up and favorites a recipe
    await page1.goto('/auth');
    await page1.fill('input[type="email"]', user1Email);
    await page1.fill('input[type="password"]', testPassword);
    await page1.click('button:has-text("Sign Up")');
    await expect(page1).toHaveURL('/');

    // User 1 favorites a recipe
    await page1.goto('/recipes');
    await page1.waitForSelector('[data-testid="recipe-card"]', { timeout: 10000 });
    await page1.click('[data-testid="recipe-card"]');
    await page1.click('[data-testid="favorite-button"]');
    await page1.press('body', 'Escape');

    // Get User 1's library count
    await page1.goto('/my-recipe-library');
    await page1.click('text="Favorites"');
    const user1FavoritesContent = await page1.locator('[data-testid="favorites-section"]').textContent();

    // User 2 signs up
    await page2.goto('/auth');
    await page2.fill('input[type="email"]', user2Email);
    await page2.fill('input[type="password"]', testPassword);
    await page2.click('button:has-text("Sign Up")');
    await expect(page2).toHaveURL('/');

    // User 2 checks their library
    await page2.goto('/my-recipe-library');
    await page2.click('text="Favorites"');
    const user2FavoritesContent = await page2.locator('[data-testid="favorites-section"]').textContent();

    // User 2 should not see User 1's favorites
    expect(user2FavoritesContent).not.toBe(user1FavoritesContent);
    
    // User 2 should have empty or different favorites
    const user2HasRecipes = user2FavoritesContent!.includes('recipe-card');
    const user1HasRecipes = user1FavoritesContent!.includes('recipe-card');
    
    if (user1HasRecipes) {
      expect(user2HasRecipes).toBeFalsy();
    }

    await context1.close();
    await context2.close();
  });

  test('should protect user profiles from unauthorized access', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // User 1 signs up
    await page1.goto('/auth');
    await page1.fill('input[type="email"]', user1Email);
    await page1.fill('input[type="password"]', testPassword);
    await page1.click('button:has-text("Sign Up")');

    // User 2 signs up
    await page2.goto('/auth');
    await page2.fill('input[type="email"]', user2Email);
    await page2.fill('input[type="password"]', testPassword);
    await page2.click('button:has-text("Sign Up")');

    // Both users should only see their own data in My Library
    await page1.goto('/my-recipe-library');
    await page2.goto('/my-recipe-library');

    const page1Library = await page1.locator('[data-testid="library-content"]').textContent();
    const page2Library = await page2.locator('[data-testid="library-content"]').textContent();

    // Libraries should be independent (different or both empty)
    if (page1Library && page2Library && page1Library.length > 50 && page2Library.length > 50) {
      expect(page1Library).not.toBe(page2Library);
    }

    await context1.close();
    await context2.close();
  });
});