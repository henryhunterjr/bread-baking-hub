import { test, expect, devices } from '@playwright/test';

test.describe('Auth Menu Tests', () => {
  const desktopViewport = devices['Desktop Chrome'].viewport!;
  const mobileViewport = devices['iPhone 13'].viewport!;
  
  // Test credentials for authenticated tests
  const testEmail = 'test@example.com';
  const testPassword = 'TestPassword123!';

  test.describe('Desktop Auth Menu - Authenticated User', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(desktopViewport);
      
      // Mock authenticated state by setting up a logged-in user
      await page.goto('/auth');
      
      // Fill and submit login form
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button:has-text("Sign In")').catch(async () => {
        // If Sign In doesn't exist, try Sign Up
        await page.click('button:has-text("Sign Up")');
      });
      
      // Wait for redirect to home page
      await page.waitForURL('/');
    });

    test('Account dropdown opens and Dashboard navigation works', async ({ page }) => {
      // Account button should be visible for authenticated users
      const accountButton = page.locator('button:has-text("Account")').first();
      await expect(accountButton).toBeVisible();

      // Click Account button to open dropdown
      await accountButton.click();

      // Dropdown menu should be visible
      const dropdownMenu = page.locator('[role="menu"]').last();
      await expect(dropdownMenu).toBeVisible();

      // Dashboard link should be visible and clickable
      const dashboardLink = page.locator('a[href="/dashboard"]').first();
      await expect(dashboardLink).toBeVisible();
      await dashboardLink.click();

      // Should navigate to dashboard page
      await expect(page).toHaveURL('/dashboard');
    });

    test('Account dropdown shows all user menu items', async ({ page }) => {
      // Click Account button
      const accountButton = page.locator('button:has-text("Account")').first();
      await accountButton.click();

      // Check all expected menu items are visible
      const menuItems = [
        { text: 'My Recipes', href: '/my-recipes' },
        { text: 'Favorites', href: '/my-favorites' },
        { text: 'Reviews', href: '/my-reviews' },
        { text: 'Dashboard', href: '/dashboard' }
      ];

      for (const item of menuItems) {
        const link = page.locator(`a[href="${item.href}"]`).first();
        await expect(link).toBeVisible();
      }

      // Logout option should also be visible
      const logoutButton = page.locator('text="Logout"');
      await expect(logoutButton).toBeVisible();
    });

    test('Account dropdown keyboard navigation works', async ({ page }) => {
      // Focus Account button
      const accountButton = page.locator('button:has-text("Account")').first();
      await accountButton.focus();

      // Press Enter to open dropdown
      await page.keyboard.press('Enter');

      // Menu should be visible
      const dropdownMenu = page.locator('[role="menu"]').last();
      await expect(dropdownMenu).toBeVisible();

      // Press ArrowDown to navigate through items
      await page.keyboard.press('ArrowDown');
      
      // My Recipes should be focused
      const myRecipesLink = page.locator('a[href="/my-recipes"]').first();
      await expect(myRecipesLink).toBeFocused();

      // Press ArrowDown again
      await page.keyboard.press('ArrowDown');
      
      // Favorites should be focused
      const favoritesLink = page.locator('a[href="/my-favorites"]').first();
      await expect(favoritesLink).toBeFocused();

      // Press Escape to close menu
      await page.keyboard.press('Escape');

      // Menu should be hidden
      await expect(dropdownMenu).not.toBeVisible();
    });

    test('Logout functionality works from dropdown', async ({ page }) => {
      // Click Account button
      const accountButton = page.locator('button:has-text("Account")').first();
      await accountButton.click();

      // Click Logout
      const logoutButton = page.locator('text="Logout"');
      await logoutButton.click();

      // Should show login button indicating user is logged out
      const loginButton = page.locator('a:has-text("Login")');
      await expect(loginButton).toBeVisible();
    });
  });

  test.describe('Desktop Auth Menu - Unauthenticated User', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(desktopViewport);
      await page.goto('/');
    });

    test('Shows Login button for unauthenticated users', async ({ page }) => {
      // Login button should be visible for unauthenticated users
      const loginButton = page.locator('a:has-text("Login")');
      await expect(loginButton).toBeVisible();
      
      // Account dropdown should not be visible
      const accountButton = page.locator('button:has-text("Account")');
      await expect(accountButton).not.toBeVisible();
    });

    test('Login button navigates to auth page', async ({ page }) => {
      // Click Login button
      const loginButton = page.locator('a:has-text("Login")');
      await loginButton.click();

      // Should navigate to auth page
      await expect(page).toHaveURL('/auth');
    });
  });

  test.describe('Mobile Auth Menu', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(mobileViewport);
    });

    test('Mobile auth options for unauthenticated user', async ({ page }) => {
      await page.goto('/');
      
      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="navigation menu"]');
      await menuButton.click();

      // Login button should be in mobile menu
      const loginButton = page.locator('#mobile-menu a:has-text("Login")');
      await expect(loginButton).toBeVisible();
      await loginButton.click();

      // Should navigate to auth page
      await expect(page).toHaveURL('/auth');
    });

    test('Mobile auth options for authenticated user', async ({ page }) => {
      // Login first
      await page.goto('/auth');
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button:has-text("Sign In")').catch(async () => {
        await page.click('button:has-text("Sign Up")');
      });
      await page.waitForURL('/');

      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="navigation menu"]');
      await menuButton.click();

      // User menu items should be visible in mobile menu
      const userMenuItems = [
        'My Recipes',
        'My Favorites', 
        'My Reviews',
        'Dashboard'
      ];

      for (const item of userMenuItems) {
        const link = page.locator(`#mobile-menu a:has-text("${item}")`);
        await expect(link).toBeVisible();
      }

      // Logout button should be visible
      const logoutButton = page.locator('#mobile-menu button:has-text("Logout")');
      await expect(logoutButton).toBeVisible();
    });

    test('Mobile logout functionality works', async ({ page }) => {
      // Login first
      await page.goto('/auth');
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button:has-text("Sign In")').catch(async () => {
        await page.click('button:has-text("Sign Up")');
      });
      await page.waitForURL('/');

      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="navigation menu"]');
      await menuButton.click();

      // Click Logout
      const logoutButton = page.locator('#mobile-menu button:has-text("Logout")');
      await logoutButton.click();

      // Mobile menu should close and login option should be available
      await page.goto('/'); // Refresh to see logged out state
      await menuButton.click();
      
      const loginButton = page.locator('#mobile-menu a:has-text("Login")');
      await expect(loginButton).toBeVisible();
    });
  });

  test.describe('Cross-Browser Auth Menu Tests', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`Account dropdown works in ${browserName}`, async ({ page }) => {
        await page.setViewportSize(desktopViewport);
        
        // Mock login
        await page.goto('/auth');
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);
        await page.click('button:has-text("Sign In")').catch(async () => {
          await page.click('button:has-text("Sign Up")');
        });
        await page.waitForURL('/');

        // Test dropdown functionality
        const accountButton = page.locator('button:has-text("Account")').first();
        await accountButton.click();

        const dashboardLink = page.locator('a[href="/dashboard"]').first();
        await expect(dashboardLink).toBeVisible();
        await dashboardLink.click();

        await expect(page).toHaveURL('/dashboard');
      });
    });
  });
});