import { test, expect } from '@playwright/test';

test.describe('Quick Smoke Tests', () => {
  test.setTimeout(10000); // 10 second timeout per test

  test('home page loads', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Grid 2.0/);
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
  });

  test('editor page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/editor');
    // Check for main editor elements
    await expect(page.getByText(/Preview/)).toBeVisible();
    await expect(page.getByPlaceholder(/Describe your vision/)).toBeVisible();
  });

  test('demo page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/demo');
    // Check for generated content
    await expect(page.locator('section').first()).toBeVisible();
  });

  test('feeling lucky page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/lucky');
    // Check for the feeling lucky component
    await expect(page.getByText(/Feeling Lucky/)).toBeVisible();
  });

  test('API endpoints respond', async ({ request }) => {
    // Test preview API
    const previewResponse = await request.post('http://localhost:3000/api/preview', {
      data: {
        action: 'get',
        sessionId: 'test-session'
      }
    });
    expect(previewResponse.ok()).toBeTruthy();

    // Test AI director API (should work in demo mode)
    const aiResponse = await request.post('http://localhost:3000/api/ai-director', {
      data: {
        prompt: 'test',
        preset: 'apple'
      }
    });
    expect(aiResponse.ok()).toBeTruthy();
  });
});