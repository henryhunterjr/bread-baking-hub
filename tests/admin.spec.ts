import { test, expect } from '@playwright/test';

test.describe('Admin Access Control', () => {
  const nonAdminEmail = `nonadmin${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should redirect non-admin users away from dashboard', async ({ page }) => {
    // Create/login as non-admin user
    await page.goto('/auth');
    await page.fill('input[type="email"]', nonAdminEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Sign Up")').catch(async () => {
      await page.click('button:has-text("Sign In")');
    });
    
    await expect(page).toHaveURL('/');
    
    // Try to access admin dashboard
    await page.goto('/dashboard');
    
    // Should be redirected away or show access denied
    await page.waitForLoadState('networkidle');
    
    // Should either redirect to home/auth or show access denied message
    const currentUrl = page.url();
    const bodyContent = await page.locator('body').textContent();
    
    const isRedirected = !currentUrl.includes('/dashboard') || currentUrl.includes('/auth');
    const hasAccessDenied = bodyContent!.includes('Access denied') || 
                           bodyContent!.includes('Unauthorized') || 
                           bodyContent!.includes('Admin required');
    
    expect(isRedirected || hasAccessDenied).toBeTruthy();
  });

  test('should show admin dashboard for admin users', async ({ page }) => {
    // Note: This test assumes there's an admin user set up
    // In a real scenario, you'd have a known admin account
    
    const adminEmail = 'henry@bakinggreatbread.blog'; // Known admin email
    const adminPassword = 'AdminPassword123!';
    
    await page.goto('/auth');
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button:has-text("Sign In")');
    
    // If admin login succeeds, try dashboard
    if (page.url().includes('/') && !page.url().includes('/auth')) {
      await page.goto('/dashboard');
      
      // Should show admin dashboard content
      await expect(page.locator('text="Dashboard"')).toBeVisible({ timeout: 10000 });
      
      // Should have admin-specific content
      const bodyContent = await page.locator('body').textContent();
      const hasAdminContent = bodyContent!.includes('Analytics') || 
                             bodyContent!.includes('Users') || 
                             bodyContent!.includes('Settings') ||
                             bodyContent!.includes('Admin');
      
      expect(hasAdminContent).toBeTruthy();
    }
  });
});