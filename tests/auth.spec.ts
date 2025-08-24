import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should sign up new user successfully', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill signup form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Click sign up button
    await page.click('button:has-text("Sign Up")');
    
    // Should redirect to home or show success message
    await expect(page).toHaveURL('/');
    
    // Check if user is logged in (header should show user menu)
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/auth');
    
    // Switch to login mode if needed
    await page.click('text="Already have an account?"', { timeout: 5000 }).catch(() => {});
    
    // Fill login form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Click sign in button
    await page.click('button:has-text("Sign In")');
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
    
    // Check if user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should logout user', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Sign In")');
    
    await expect(page).toHaveURL('/');
    
    // Click user menu and logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text="Sign Out"');
    
    // Should redirect to home and show login option
    await expect(page.locator('text="Sign In"')).toBeVisible();
  });

  test('should show password reset link', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for forgot password link visibility
    await expect(page.locator('text="Forgot password?"')).toBeVisible();
  });
});