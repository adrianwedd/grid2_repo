import { test, expect } from '@playwright/test';

test.describe('Theme Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    // Wait for the editor to load
    await page.waitForSelector('.text-xl:has-text("Grid 2.0 Editor")', { timeout: 10000 });
  });

  test('should load theme previewer component', async ({ page }) => {
    // Check that the Theme Previewer section exists
    const themePreviewer = page.locator('h3:has-text("Live Theme Preview")');
    await expect(themePreviewer).toBeVisible();
  });

  test('should load cached themes from API', async ({ page }) => {
    // Wait for themes to load
    await page.waitForResponse(response => 
      response.url().includes('/api/claude-cache-list') && response.status() === 200
    );

    // Check that at least one theme button is visible
    const themeButtons = page.locator('button').filter({ 
      hasText: /Versailles|Soviet|Japanese|1970s|Blade Runner/i 
    });
    
    const count = await themeButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should preview theme when clicked', async ({ page }) => {
    // Wait for themes to load
    await page.waitForResponse(response => 
      response.url().includes('/api/claude-cache-list') && response.status() === 200
    );

    // Find and click a theme button
    const luxuryTheme = page.locator('button').filter({ hasText: /Versailles/i }).first();
    
    if (await luxuryTheme.count() > 0) {
      await luxuryTheme.click();

      // Wait for the feeling-lucky API call
      await page.waitForResponse(response => 
        response.url().includes('/api/feeling-lucky') && response.status() === 200
      );

      // Check that theme details are displayed
      const philosophyText = page.locator('.bg-gray-50').filter({ hasText: /Versailles/i });
      await expect(philosophyText).toBeVisible();

      // Check that color swatches are displayed
      const colorSwatch = page.locator('div[title="Primary"]');
      await expect(colorSwatch).toBeVisible();
    }
  });

  test('should apply theme on double-click', async ({ page }) => {
    // Wait for themes to load
    await page.waitForResponse(response => 
      response.url().includes('/api/claude-cache-list') && response.status() === 200
    );

    // Get initial CSS variable value
    const initialPrimaryColor = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
    );

    // Find a theme button
    const brutalistTheme = page.locator('button').filter({ hasText: /Soviet|brutalist/i }).first();
    
    if (await brutalistTheme.count() > 0) {
      // First click to select
      await brutalistTheme.click();
      await page.waitForTimeout(500);

      // Double-click to apply
      await brutalistTheme.dblclick();
      await page.waitForTimeout(500);

      // Check that CSS variables have changed
      const newPrimaryColor = await page.evaluate(() => 
        getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
      );

      expect(newPrimaryColor).not.toBe(initialPrimaryColor);
    }
  });

  test('should reset theme when reset button clicked', async ({ page }) => {
    // Wait for themes to load
    await page.waitForResponse(response => 
      response.url().includes('/api/claude-cache-list') && response.status() === 200
    );

    // Select a theme first
    const anyTheme = page.locator('button').filter({ hasText: /Versailles|Soviet|Japanese/i }).first();
    
    if (await anyTheme.count() > 0) {
      await anyTheme.click();
      await page.waitForTimeout(500);

      // Check reset button appears
      const resetButton = page.locator('button:has-text("Reset")');
      await expect(resetButton).toBeVisible();

      // Click reset
      await resetButton.click();

      // Check that theme details are hidden
      const philosophyText = page.locator('.bg-gray-50').filter({ hasText: /philosophy/i });
      await expect(philosophyText).not.toBeVisible();
    }
  });
});

test.describe('API Tests', () => {
  test('claude-cache-list API should return valid data', async ({ request }) => {
    const response = await request.get('/api/claude-cache-list');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const firstItem = data[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('philosophy');
      expect(firstItem).toHaveProperty('spec');
      expect(firstItem.spec).toHaveProperty('brandTokens');
    }
  });

  test('feeling-lucky API should load specific theme', async ({ request }) => {
    // First get list of available themes
    const listResponse = await request.get('/api/claude-cache-list');
    const themes = await listResponse.json();

    if (themes.length > 0) {
      const themeId = themes[0].id;
      
      // Try to load specific theme
      const response = await request.post('/api/feeling-lucky', {
        data: { specId: themeId }
      });

      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('cached');
      expect(data).toHaveProperty('spec');
      expect(data.cached.id).toBe(themeId);
    }
  });
});