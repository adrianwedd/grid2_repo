import { test, expect } from '@playwright/test';

// Vercel deployment URL - update this with your actual deployment URL
const VERCEL_URL = 'https://grid2repo.vercel.app';

test.describe('Vercel Deployment Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto(VERCEL_URL);
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Grid 2.0/i);
    
    // Check for main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should have all 32 styles in the style gallery', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/style-gallery`);
    
    // Wait for the styles to load
    await page.waitForLoadState('networkidle');
    
    // Check for the Grid 2.0 heading
    await expect(page.locator('h1:has-text("Grid 2.0")')).toBeVisible();
    
    // Count all style cards
    const styleCards = page.locator('[class*="group relative overflow-hidden rounded-xl"]');
    const count = await styleCards.count();
    
    console.log(`Found ${count} style cards`);
    
    // Should have exactly 32 styles
    expect(count).toBe(32);
    
    // Check that the footer shows the correct count
    const footer = page.locator('text=/32 unique design philosophies/');
    await expect(footer).toBeVisible();
  });

  test('should display all style categories', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/style-gallery`);
    
    // Expected styles with their names
    const expectedStyles = [
      // Original 12 styles
      'Minimal Swiss',
      'Bold Brutalist',
      'Playful Memphis',
      'Corporate Professional',
      'Elegant Editorial',
      'Modern Tech',
      'Warm Organic',
      'Luxury Premium',
      'Creative Artistic',
      'Nature Eco',
      'Retro Vintage',
      'Zen Tranquil',
      // Original 8 AI styles
      'Quantum Nebula',
      'DeepSeek Enigma',
      'Thunder Goat',
      'VOIDWHISPER',
      'Psychedelic Café',
      'GlitchGizzard',
      'GLM Air Flow',
      'Quantum Quokka',
      // New 12 AI styles
      'Neon Ghost Protocol',
      'Ethereal Zen Garden',
      'Pixel Paradise Arcade',
      'Nocturne Arcana Library',
      'Sunrise Symphony',
      'Digital Sunset Mall',
      'Concrete Monolith',
      'Geometric Playground',
      'Void Whisper Station',
      'Digital Cottage Haven',
      'Everything Everywhere',
      'Reality.exe Error'
    ];
    
    // Check that each style is present
    for (const styleName of expectedStyles) {
      const styleElement = page.locator(`text="${styleName}"`).first();
      await expect(styleElement).toBeVisible({ timeout: 10000 });
    }
  });

  test('should be able to preview a style', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/style-gallery`);
    
    // Wait for styles to load
    await page.waitForLoadState('networkidle');
    
    // Click on the first style card
    const firstCard = page.locator('[class*="group relative overflow-hidden rounded-xl"]').first();
    await firstCard.click();
    
    // Check that the preview modal opens
    const modal = page.locator('[class*="fixed inset-0 bg-black"]');
    await expect(modal).toBeVisible();
    
    // Check for close button
    const closeButton = page.locator('button[aria-label="Close preview"]');
    await expect(closeButton).toBeVisible();
    
    // Close the modal
    await closeButton.click();
    
    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('should load editor page', async ({ page }) => {
    await page.goto(`${VERCEL_URL}/editor`);
    
    // Check that editor loads - use more specific selector
    await expect(page.locator('h1:has-text("Grid 2.0 Editor")')).toBeVisible({ timeout: 15000 });
  });

  test('should have working API health endpoint', async ({ page }) => {
    const response = await page.request.get(`${VERCEL_URL}/api/health`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    // API may return 'degraded' if some services are missing (like API keys)
    expect(['healthy', 'degraded']).toContain(data.status);
  });
});