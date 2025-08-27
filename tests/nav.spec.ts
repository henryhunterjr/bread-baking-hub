import { test, expect, devices } from '@playwright/test';

test.describe('Navigation Dropdown Tests', () => {
  const desktopViewport = devices['Desktop Chrome'].viewport!;
  const mobileViewport = devices['iPhone 13'].viewport!;

  test.describe('Desktop Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(desktopViewport);
      await page.goto('/');
    });

    test('More dropdown - hover opens menu and clicking Community works', async ({ page }) => {
      // Hover over More button
      const moreButton = page.locator('button:has-text("More")');
      await expect(moreButton).toBeVisible();
      await moreButton.hover();

      // Menu should be visible after hover
      const dropdownMenu = page.locator('[role="menu"]').first();
      await expect(dropdownMenu).toBeVisible();

      // Menu should stay open and Community link should be clickable
      const communityLink = page.locator('a[href="/community"]').first();
      await expect(communityLink).toBeVisible();
      await communityLink.click();

      // Should navigate to community page
      await expect(page).toHaveURL('/community');
    });

    test('More dropdown - click opens menu and navigation works', async ({ page }) => {
      // Click More button to open dropdown
      const moreButton = page.locator('button:has-text("More")');
      await moreButton.click();

      // Menu should be visible
      const dropdownMenu = page.locator('[role="menu"]').first();
      await expect(dropdownMenu).toBeVisible();

      // Click Glossary link
      const glossaryLink = page.locator('a[href="/glossary"]').first();
      await expect(glossaryLink).toBeVisible();
      await glossaryLink.click();

      // Should navigate to glossary page
      await expect(page).toHaveURL('/glossary');
    });

    test('More dropdown - keyboard navigation works', async ({ page }) => {
      // Tab to More button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // May need more tabs depending on page structure
      
      // Find the More button and focus it
      const moreButton = page.locator('button:has-text("More")');
      await moreButton.focus();

      // Press Enter to open dropdown
      await page.keyboard.press('Enter');

      // Menu should be visible
      const dropdownMenu = page.locator('[role="menu"]').first();
      await expect(dropdownMenu).toBeVisible();

      // Press ArrowDown to move to first item
      await page.keyboard.press('ArrowDown');
      
      // First item should be focused (Glossary)
      const glossaryLink = page.locator('a[href="/glossary"]').first();
      await expect(glossaryLink).toBeFocused();

      // Press ArrowDown again to move to next item
      await page.keyboard.press('ArrowDown');
      
      // Second item should be focused (Troubleshooting)
      const troubleshootingLink = page.locator('a[href="/troubleshooting"]').first();
      await expect(troubleshootingLink).toBeFocused();

      // Press Escape to close menu
      await page.keyboard.press('Escape');

      // Menu should be hidden
      await expect(dropdownMenu).not.toBeVisible();
    });

    test('Navigation menu items are accessible', async ({ page }) => {
      // Check that main navigation items are visible and clickable
      const navItems = [
        { text: 'Recipes', href: '/recipes' },
        { text: 'Vitale Starter', href: '/vitale-starter' },
        { text: 'Library', href: '/books' },
        { text: 'Workspace', href: '/recipe-workspace' },
        { text: 'Blog', href: '/blog' }
      ];

      for (const item of navItems) {
        const link = page.locator(`a[href="${item.href}"]`).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveText(item.text);
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');
    });

    test('Mobile menu opens and navigation works', async ({ page }) => {
      // Mobile menu button should be visible
      const menuButton = page.locator('button[aria-label*="navigation menu"]');
      await expect(menuButton).toBeVisible();

      // Click to open mobile menu
      await menuButton.click();

      // Mobile menu should be visible
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();

      // Community link should be visible in mobile menu
      const communityLink = page.locator('#mobile-menu a[href="/community"]');
      await expect(communityLink).toBeVisible();
      await communityLink.click();

      // Should navigate to community page
      await expect(page).toHaveURL('/community');
    });

    test('Mobile menu closes with overlay click', async ({ page }) => {
      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="navigation menu"]');
      await menuButton.click();

      // Menu should be visible
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();

      // Click overlay to close
      const overlay = page.locator('.bg-black\\/50');
      await overlay.click();

      // Menu should be hidden
      await expect(mobileMenu).not.toBeVisible();
    });

    test('Mobile menu closes with Escape key', async ({ page }) => {
      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="navigation menu"]');
      await menuButton.click();

      // Menu should be visible
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeVisible();

      // Press Escape to close
      await page.keyboard.press('Escape');

      // Menu should be hidden
      await expect(mobileMenu).not.toBeVisible();
    });

    test('Mobile menu navigation items are accessible', async ({ page }) => {
      // Open mobile menu
      const menuButton = page.locator('button[aria-label*="navigation menu"]');
      await menuButton.click();

      // Check that navigation items are visible in mobile menu
      const navItems = [
        'Recipes',
        'Vitale Starter', 
        'Library',
        'Recipe Workspace',
        'Blog',
        'Community',
        'Troubleshooting',
        'Help'
      ];

      for (const item of navItems) {
        const link = page.locator(`#mobile-menu a:has-text("${item}")`);
        await expect(link).toBeVisible();
      }
    });
  });
});