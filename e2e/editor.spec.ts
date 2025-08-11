import { test, expect } from '@playwright/test';

test.describe('Editor Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
  });

  test('should load editor page', async ({ page }) => {
    await expect(page).toHaveTitle(/Grid 2.0 - Editor/);
    await expect(page.locator('h1')).toContainText('Grid 2.0 Editor');
  });

  test('should display generated page sections', async ({ page }) => {
    // Wait for page generation
    await page.waitForSelector('[data-section-id]', { timeout: 10000 });
    
    // Check that sections are rendered
    const sections = await page.locator('[data-section-id]').count();
    expect(sections).toBeGreaterThan(0);
  });

  test('should have working chat interface', async ({ page }) => {
    // Look for chat input
    const chatInput = page.locator('input[placeholder*="chat"], textarea[placeholder*="chat"], input[type="text"]').first();
    await expect(chatInput).toBeVisible();
    
    // Type a command
    await chatInput.fill('Make the hero more dramatic');
    await chatInput.press('Enter');
    
    // Wait for any response or UI update
    await page.waitForTimeout(1000);
  });

  test('should regenerate page on command', async ({ page }) => {
    // Get initial sections
    await page.waitForSelector('[data-section-id]');
    const initialSections = await page.locator('[data-section-id]').count();
    
    // Find regenerate button or trigger regeneration
    const regenButton = page.locator('button:has-text("Regenerate"), button:has-text("Generate")').first();
    if (await regenButton.isVisible()) {
      await regenButton.click();
      
      // Wait for regeneration
      await page.waitForTimeout(2000);
      
      // Check sections still exist
      const newSections = await page.locator('[data-section-id]').count();
      expect(newSections).toBeGreaterThan(0);
    }
  });

  test('should display brand tokens', async ({ page }) => {
    // Check for any brand color indicators
    const brandElements = await page.locator('[class*="brand"], [class*="primary"]').count();
    expect(brandElements).toBeGreaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Check sections are still visible
    const mobileSections = await page.locator('[data-section-id]').count();
    expect(mobileSections).toBeGreaterThan(0);
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    const tabletSections = await page.locator('[data-section-id]').count();
    expect(tabletSections).toBeGreaterThan(0);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    const desktopSections = await page.locator('[data-section-id]').count();
    expect(desktopSections).toBeGreaterThan(0);
  });

  test('should handle style preset selection', async ({ page }) => {
    // Look for style preset buttons
    const styleButtons = page.locator('button:has-text("Apple"), button:has-text("Stripe"), button:has-text("Linear")');
    
    if (await styleButtons.first().isVisible()) {
      // Click a style preset
      await styleButtons.first().click();
      
      // Wait for regeneration
      await page.waitForTimeout(2000);
      
      // Check that page updated
      const sections = await page.locator('[data-section-id]').count();
      expect(sections).toBeGreaterThan(0);
    }
  });

  test('should display performance metrics', async ({ page }) => {
    // Look for render time or performance indicators
    const perfElements = page.locator('text=/\\d+ms/, text=/render/i');
    
    if (await perfElements.first().isVisible()) {
      const perfText = await perfElements.first().textContent();
      expect(perfText).toBeTruthy();
    }
  });
});