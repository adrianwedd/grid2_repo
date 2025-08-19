import { test, expect } from '@playwright/test';

// ==========================================
// VISUAL REGRESSION TESTS
// ==========================================

test.describe('Visual Regression - Screenshots', () => {
  test('home page - full page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-full-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('home page - above the fold', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-above-fold.png', {
      clip: { x: 0, y: 0, width: 1280, height: 720 }
    });
  });

  test('editor page - initial state', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('editor-initial.png');
  });

  test('editor page - with preview', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    // Apply a transform
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('make the hero bold');
    
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('editor-with-preview.png');
  });

  test('lucky page - before generation', async ({ page }) => {
    await page.goto('/lucky');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('lucky-initial.png');
  });

  test('lucky page - after generation', async ({ page }) => {
    await page.goto('/lucky');
    
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    await luckyBtn.click();
    
    await page.waitForResponse('**/api/generate');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('lucky-generated.png');
  });
});

test.describe('Visual Regression - Individual Components', () => {
  test('navigation bar - all states', async ({ page }) => {
    // Home page nav
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toHaveScreenshot('nav-home.png');
    
    // Editor page nav
    await page.goto('/editor');
    await expect(nav).toHaveScreenshot('nav-editor.png');
    
    // Lucky page nav
    await page.goto('/lucky');
    await expect(nav).toHaveScreenshot('nav-lucky.png');
  });

  test('style cards - hover states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('.group').first();
    
    // Normal state
    await expect(firstCard).toHaveScreenshot('card-normal.png');
    
    // Hover state
    await firstCard.hover();
    await page.waitForTimeout(300);
    await expect(firstCard).toHaveScreenshot('card-hover.png');
  });

  test('button states', async ({ page }) => {
    await page.goto('/editor');
    
    // Apply button - enabled
    const applyBtn = page.locator('button:has-text("Apply")');
    await expect(applyBtn).toHaveScreenshot('button-apply-disabled.png');
    
    // Type to enable
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('test');
    await expect(applyBtn).toHaveScreenshot('button-apply-enabled.png');
    
    // Undo/Redo buttons
    const undoBtn = page.locator('button:has-text("Undo")');
    await expect(undoBtn).toHaveScreenshot('button-undo.png');
    
    const redoBtn = page.locator('button:has-text("Redo")');
    await expect(redoBtn).toHaveScreenshot('button-redo.png');
  });
});

test.describe('Visual Regression - Responsive Layouts', () => {
  test('mobile viewport - 375x667', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-home.png', { fullPage: true });
    
    // Editor
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-editor.png', { fullPage: true });
    
    // Lucky
    await page.goto('/lucky');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-lucky.png', { fullPage: true });
  });

  test('tablet viewport - 768x1024', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('tablet-home.png', { fullPage: true });
    
    // Editor
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('tablet-editor.png', { fullPage: true });
  });

  test('desktop viewport - 1920x1080', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-home.png');
    
    // Editor
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('desktop-editor.png');
  });
});

test.describe('Visual Regression - Theme Application', () => {
  test('default theme', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    const preview = page.locator('.lg\\:col-span-8');
    await expect(preview).toHaveScreenshot('theme-default.png');
  });

  test('applied custom theme', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Apply first available theme
    const themeButton = page.locator('button[class*="border"]').filter({
      has: page.locator('div[class*="w-3 h-3"]')
    }).first();
    
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(1000);
      
      const preview = page.locator('.lg\\:col-span-8');
      await expect(preview).toHaveScreenshot('theme-custom.png');
    }
  });
});

test.describe('Visual Regression - Loading States', () => {
  test('capture loading spinner', async ({ page }) => {
    await page.goto('/lucky');
    
    // Intercept to delay response
    await page.route('**/api/generate', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      route.continue();
    });
    
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    await luckyBtn.click();
    
    // Capture loading state
    await expect(luckyBtn).toHaveScreenshot('loading-spinner.png');
  });

  test('editor preview loading', async ({ page }) => {
    await page.goto('/editor');
    
    // Intercept to delay
    await page.route('**/api/preview', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      route.continue();
    });
    
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('test command');
    
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    // Capture preview loading text
    const loadingText = page.locator('text=Previewing...');
    if (await loadingText.isVisible()) {
      await expect(loadingText).toHaveScreenshot('preview-loading.png');
    }
  });
});

test.describe('Visual Regression - Error States', () => {
  test('API error display', async ({ page }) => {
    await page.goto('/editor');
    
    // Force an error
    await page.route('**/api/preview', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error message for screenshot' })
      });
    });
    
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('test');
    
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    await page.waitForTimeout(500);
    
    const errorMsg = page.locator('text=Test error message');
    if (await errorMsg.isVisible()) {
      await expect(errorMsg).toHaveScreenshot('error-message.png');
    }
  });
});

test.describe('Visual Regression - Animations', () => {
  test('card hover animation sequence', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const card = page.locator('.group').first();
    
    // Capture animation frames
    await card.hover();
    
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(100);
      await expect(card).toHaveScreenshot(`card-animation-${i}.png`);
    }
  });

  test('button state transitions', async ({ page }) => {
    await page.goto('/editor');
    
    const generateTab = page.locator('button:has-text("Generate")');
    
    // Before click
    await expect(generateTab).toHaveScreenshot('tab-inactive.png');
    
    // Click and capture transition
    await generateTab.click();
    await page.waitForTimeout(150);
    await expect(generateTab).toHaveScreenshot('tab-active.png');
  });
});

test.describe('Visual Regression - Cross-browser', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`home page in ${browserName}`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveScreenshot(`home-${browserName}.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });
});

test.describe('Visual Regression - Dark Mode Support', () => {
  test('system dark mode preference', async ({ page }) => {
    // Emulate dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-dark-mode.png', {
      fullPage: true
    });
  });

  test('system light mode preference', async ({ page }) => {
    // Emulate light mode
    await page.emulateMedia({ colorScheme: 'light' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('home-light-mode.png', {
      fullPage: true
    });
  });
});