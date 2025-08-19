import { test, expect } from '@playwright/test';

// ==========================================
// BASIC FUNCTIONALITY TESTS
// ==========================================

test.describe('Basic Navigation', () => {
  test('all pages should load without errors', async ({ page }) => {
    // Test home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Grid 2.0/);
    
    // Test editor page
    await page.goto('/editor');
    await expect(page.locator('h2:has-text("Grid 2.0 Editor")')).toBeVisible();
    
    // Test lucky page
    await page.goto('/lucky');
    await expect(page.locator('h1:has-text("I\'m Feeling Lucky")')).toBeVisible();
  });

  test('navigation links should work', async ({ page }) => {
    await page.goto('/');
    
    // Click Editor link
    await page.click('a:has-text("Editor")');
    await expect(page).toHaveURL('/editor');
    
    // Click Lucky link
    await page.click('a:has-text("I\'m Feeling Lucky")');
    await expect(page).toHaveURL('/lucky');
    
    // Click Home link
    await page.click('a:has-text("Home")');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Home Page - StyleShowcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display Grid 2.0 title and description', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText('Grid 2.0');
    await expect(page.locator('text=AI Director meets Deterministic Engine')).toBeVisible();
  });

  test('should display design style cards', async ({ page }) => {
    // Check that at least some style cards are visible
    const cards = page.locator('.group');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display image statistics', async ({ page }) => {
    // Check for any image stats text
    const statsText = page.locator('text=/\\d+ (AI images|generated images|placeholders)/');
    await expect(statsText).toBeVisible();
  });
});

test.describe('Editor Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
  });

  test('should have Transform and Generate tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("Transform")')).toBeVisible();
    await expect(page.locator('button:has-text("Generate")')).toBeVisible();
  });

  test('should have command input textarea', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute('placeholder', /make the hero more dramatic|Describe your website/);
  });

  test('should have Apply button in Transform mode', async ({ page }) => {
    // Ensure we're in Transform mode
    const transformTab = page.locator('button:has-text("Transform")');
    if (!(await transformTab.evaluate(el => el.classList.contains('bg-white')))) {
      await transformTab.click();
    }
    
    await expect(page.locator('button:has-text("Apply")')).toBeVisible();
  });

  test('should switch between Transform and Generate modes', async ({ page }) => {
    const transformTab = page.locator('button:has-text("Transform")');
    const generateTab = page.locator('button:has-text("Generate")');
    
    // Click Generate
    await generateTab.click();
    await expect(page.locator('text=Generate Mode')).toBeVisible();
    
    // Click Transform
    await transformTab.click();
    await expect(page.locator('text=Edit Mode')).toBeVisible();
  });

  test('should show preview area', async ({ page }) => {
    await expect(page.locator('text=Preview')).toBeVisible();
    const previewArea = page.locator('.lg\\:col-span-8');
    await expect(previewArea).toBeVisible();
  });
});

test.describe('Lucky Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lucky');
    await page.waitForLoadState('networkidle');
  });

  test('should have "I\'m Feeling Lucky" button', async ({ page }) => {
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    await expect(luckyBtn).toBeVisible();
    await expect(luckyBtn).toBeEnabled();
  });

  test('should show initial empty state message', async ({ page }) => {
    await expect(page.locator('text=/Click.*Feeling Lucky.*to see/')).toBeVisible();
  });

  test('clicking lucky button should trigger generation', async ({ page }) => {
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    // Start monitoring network
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/generate') && response.status() === 200
    );
    
    // Click button
    await luckyBtn.click();
    
    // Should show loading state
    await expect(page.locator('text=Getting Lucky...')).toBeVisible();
    
    // Wait for response
    await responsePromise;
    
    // Should show results
    await expect(page.locator('text=Claude\'s Design Philosophy')).toBeVisible();
  });
});

test.describe('API Health Checks', () => {
  test('GET /api/generate should return API info', async ({ request }) => {
    const response = await request.get('/api/generate');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('availableTones');
    expect(data.availableTones).toContain('minimal');
    expect(data.availableTones).toContain('bold');
  });

  test('POST /api/generate with minimal parameters', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        mode: 'tone',
        tone: 'minimal'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('tone', 'minimal');
    expect(data).toHaveProperty('page');
    expect(data.page).toHaveProperty('sections');
    expect(Array.isArray(data.page.sections)).toBeTruthy();
  });

  test('POST /api/generate random mode', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        mode: 'random'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('tone');
    expect(data).toHaveProperty('page');
  });
});

test.describe('Responsive Design', () => {
  test('mobile navigation should work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Navigation should still be visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Should be able to navigate
    await page.click('a:has-text("Editor")');
    await expect(page).toHaveURL('/editor');
  });

  test('tablet layout should work', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Content should be visible
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/editor');
    
    // Intercept and fail the API
    await page.route('**/api/preview', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error' })
      });
    });
    
    // Try to apply a transform
    const textarea = page.locator('textarea').first();
    await textarea.fill('test command');
    
    // Apply button should exist
    const applyBtn = page.locator('button:has-text("Apply")');
    if (await applyBtn.isVisible() && await applyBtn.isEnabled()) {
      await applyBtn.click();
      
      // Should show error
      await expect(page.locator('text=Test error')).toBeVisible({ timeout: 10000 });
    }
  });
});

test.describe('User Interactions', () => {
  test('should type in editor textarea', async ({ page }) => {
    await page.goto('/editor');
    
    const textarea = page.locator('textarea').first();
    await textarea.fill('make the design more minimal');
    
    const value = await textarea.inputValue();
    expect(value).toBe('make the design more minimal');
  });

  test('should switch editor modes', async ({ page }) => {
    await page.goto('/editor');
    
    // Switch to Generate
    await page.click('button:has-text("Generate")');
    await expect(page.locator('text=Generate Mode')).toBeVisible();
    
    // Switch back to Transform
    await page.click('button:has-text("Transform")');
    await expect(page.locator('text=Edit Mode')).toBeVisible();
  });

  test('lucky button should be clickable', async ({ page }) => {
    await page.goto('/lucky');
    
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    await expect(luckyBtn).toBeEnabled();
    
    // Click should trigger loading state
    await luckyBtn.click();
    await expect(page.locator('text=Getting Lucky...')).toBeVisible();
  });
});