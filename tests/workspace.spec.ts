import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Workspace Functionality', () => {
  const testEmail = `workspace${Date.now()}@example.com`;
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

  test('should upload and format recipe file', async ({ page }) => {
    await page.goto('/recipe-workspace');
    
    // Create test files
    const testImagePath = path.join(__dirname, 'fixtures', 'test-recipe.jpg');
    const testPdfPath = path.join(__dirname, 'fixtures', 'recipe.pdf');
    const testTextPath = path.join(__dirname, 'fixtures', 'recipe.txt');
    
    // Try uploading an image file (most common scenario)
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.isVisible()) {
      // Create a simple test file content
      await page.setInputFiles('input[type="file"]', {
        name: 'test-recipe.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Test Recipe\n\nIngredients:\n- 2 cups flour\n- 1 cup water\n\nInstructions:\n1. Mix ingredients\n2. Bake at 350F')
      });
      
      // Click format button
      await page.click('button:has-text("Format Recipe")');
      
      // Wait for formatting to complete
      await expect(page.locator('[data-testid="formatted-recipe"]')).toBeVisible({ timeout: 30000 });
      
      // Should show formatted recipe content
      await expect(page.locator('text="Test Recipe"')).toBeVisible();
      await expect(page.locator('text="Ingredients"')).toBeVisible();
      await expect(page.locator('text="Instructions"')).toBeVisible();
      
      // Save to library
      await page.click('button:has-text("Save to Library")');
      
      // Should show success message
      await expect(page.locator('text="Recipe saved"')).toBeVisible();
      
      // Go to My Library and verify it's there
      await page.click('text="My Library"');
      await expect(page.locator('text="Saved"')).toBeVisible();
      await page.click('text="Saved"');
      
      // Should see the saved recipe
      await expect(page.locator('text="Test Recipe"')).toBeVisible();
    }
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    await page.goto('/recipe-workspace');
    
    // Try uploading an invalid file type
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.isVisible()) {
      await page.setInputFiles('input[type="file"]', {
        name: 'invalid.exe',
        mimeType: 'application/x-executable',
        buffer: Buffer.from('invalid content')
      });
      
      // Should show error message
      await expect(page.locator('text="Invalid file type"')).toBeVisible({ timeout: 10000 });
    }
  });
});