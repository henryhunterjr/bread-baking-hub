import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Setting up test environment...');
  
  // Create test image fixture
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Create a simple test image by taking a screenshot of a colored div
  await page.setContent(`
    <div style="width: 400px; height: 300px; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); 
                display: flex; align-items: center; justify-content: center; 
                font-size: 24px; color: white; font-family: Arial;">
      Test Recipe Image
    </div>
  `);
  
  await page.screenshot({ 
    path: 'tests/fixtures/test-recipe.jpg',
    clip: { x: 0, y: 0, width: 400, height: 300 }
  });
  
  await browser.close();
  
  console.log('Test environment setup complete.');
}

export default globalSetup;