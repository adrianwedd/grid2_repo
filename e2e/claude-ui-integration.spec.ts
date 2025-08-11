// e2e/claude-ui-integration.spec.ts  
// Quick smoke tests for Grid 2.0 components
import { test, expect } from '@playwright/test';

test.describe('Grid 2.0 Smoke Tests', () => {
  test('Home page loads with navigation', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Navigation should be visible
    await expect(page.locator('nav')).toBeVisible({ timeout: 10000 });
    
    // Check for navigation links
    await expect(page.locator('text=Demo')).toBeVisible();
    await expect(page.locator('text=Editor')).toBeVisible();
  });
  
  test('Demo page shows generated content', async ({ page }) => {
    await page.goto('http://localhost:3001/demo');
    
    // Should load without errors
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });
  
  test('Editor page loads interface', async ({ page }) => {
    await page.goto('http://localhost:3001/editor');
    
    // Should see the editor interface
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });
});