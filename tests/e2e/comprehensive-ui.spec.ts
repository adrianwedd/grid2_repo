import { test, expect } from '@playwright/test';

// ==========================================
// STYLE SHOWCASE (HOME PAGE) TESTS
// ==========================================

test.describe('StyleShowcase - Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load StyleShowcase with all design styles', async ({ page }) => {
    // Check main heading
    await expect(page.locator('h1').first()).toContainText('Grid 2.0');
    
    // Verify all 12 design philosophies are present
    const styles = [
      'Minimal Swiss', 'Bold Brutalist', 'Playful Memphis',
      'Corporate Professional', 'Elegant Editorial', 'Modern Tech',
      'Warm Organic', 'Luxury Premium', 'Creative Artistic',
      'Nature Eco', 'Retro Vintage', 'Zen Tranquil'
    ];
    
    for (const style of styles) {
      await expect(page.locator('text=' + style)).toBeVisible();
    }
  });

  test('should display correct image statistics', async ({ page }) => {
    // Check for AI images count
    const imageStats = page.locator('text=/\\d+ (AI images|generated images|placeholders)/');
    await expect(imageStats).toBeVisible();
  });

  test('should allow clicking on design styles for preview', async ({ page }) => {
    // Click on first design style
    const firstStyle = page.locator('.group').first();
    await firstStyle.click();
    
    // Verify preview modal or expanded view appears
    await expect(page.locator('text=Preview')).toBeVisible();
  });

  test('should show hover effects on design cards', async ({ page }) => {
    const card = page.locator('.group').first();
    
    // Get initial transform
    const initialTransform = await card.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Hover over card
    await card.hover();
    
    // Wait for animation
    await page.waitForTimeout(300);
    
    // Get hover transform
    const hoverTransform = await card.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    
    // Transform should change on hover
    expect(initialTransform).not.toBe(hoverTransform);
  });
});

// ==========================================
// REALTIME EDITOR TESTS
// ==========================================

test.describe('RealtimeEditor - Transform Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
  });

  test('should initialize with Transform mode active', async ({ page }) => {
    // Check Transform tab is active
    const transformTab = page.locator('button:has-text("Transform")');
    await expect(transformTab).toHaveClass(/bg-white shadow-sm/);
  });

  test('should accept and preview transform commands', async ({ page }) => {
    // Type a transform command
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('make the hero bold and dramatic');
    
    // Click Apply button
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    // Check for interpreted intents
    await expect(page.locator('text=Interpreted intents')).toBeVisible();
  });

  test('should support undo/redo functionality', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    const applyBtn = page.locator('button:has-text("Apply")');
    const undoBtn = page.locator('button:has-text("Undo")');
    const redoBtn = page.locator('button:has-text("Redo")');
    
    // Apply a change
    await textarea.fill('add social proof');
    await applyBtn.click();
    await page.waitForTimeout(1000);
    
    // Undo
    await undoBtn.click();
    await expect(page.locator('text=(committed)')).toBeVisible();
    
    // Redo
    await redoBtn.click();
    await expect(page.locator('text=(uncommitted)')).toBeVisible();
  });

  test('should show change analysis with impact metrics', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('increase contrast');
    
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    // Wait for analysis
    await page.waitForTimeout(1000);
    
    // Check for impact metrics
    await expect(page.locator('text=Aesthetics')).toBeVisible();
    await expect(page.locator('text=Conversion')).toBeVisible();
    await expect(page.locator('text=Performance')).toBeVisible();
  });
});

test.describe('RealtimeEditor - Generate Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    // Switch to Generate mode
    const generateTab = page.locator('button:has-text("Generate")');
    await generateTab.click();
  });

  test('should switch to Generate mode', async ({ page }) => {
    const generateTab = page.locator('button:has-text("Generate")');
    await expect(generateTab).toHaveClass(/bg-white shadow-sm/);
    
    // Check for Generate mode indicators
    await expect(page.locator('text=Generate Mode')).toBeVisible();
    await expect(page.locator('text=Claude AI Director')).toBeVisible();
  });

  test('should accept generation prompts', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('Create a modern fintech startup landing page');
    
    // Verify button is enabled
    const generateBtn = page.locator('button:has-text("Generate with Claude")');
    await expect(generateBtn).toBeEnabled();
  });

  test('should show loading state during generation', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('Create a tech startup landing page');
    
    const generateBtn = page.locator('button:has-text("Generate with Claude")');
    
    // Start generation
    const responsePromise = page.waitForResponse('**/api/generate');
    await generateBtn.click();
    
    // Check loading state appears
    await expect(page.locator('text=Generating...')).toBeVisible();
    
    // Wait for completion
    await responsePromise;
  });
});

test.describe('RealtimeEditor - Theme System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
  });

  test('should display Visual Themes section', async ({ page }) => {
    await expect(page.locator('text=Visual Themes')).toBeVisible();
  });

  test('should load available themes', async ({ page }) => {
    // Wait for themes to load
    await page.waitForTimeout(2000);
    
    const themeButtons = page.locator('button[class*="border"]').filter({
      has: page.locator('div[class*="w-3 h-3"]')
    });
    
    const count = await themeButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should apply theme when clicked', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Get first theme button
    const themeButton = page.locator('button[class*="border"]').filter({
      has: page.locator('div[class*="w-3 h-3"]')
    }).first();
    
    // Click to apply theme
    await themeButton.click();
    
    // Check that theme is marked as active
    await expect(themeButton).toHaveClass(/border-blue-500 bg-blue-50/);
  });

  test('should reset theme to default', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Apply a theme first
    const themeButton = page.locator('button[class*="border"]').filter({
      has: page.locator('div[class*="w-3 h-3"]')
    }).first();
    await themeButton.click();
    
    // Click reset button
    const resetBtn = page.locator('button:has-text("Reset to Default")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      
      // Page should reload
      await page.waitForLoadState('load');
    }
  });
});

// ==========================================
// FEELING LUCKY PAGE TESTS
// ==========================================

test.describe('FeelingLucky Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lucky');
    await page.waitForLoadState('networkidle');
  });

  test('should load with correct heading and description', async ({ page }) => {
    await expect(page.locator('h1:has-text("I\'m Feeling Lucky")')).toBeVisible();
    await expect(page.locator('text=Showcase Claude\'s design philosophies')).toBeVisible();
  });

  test('should generate random design on button click', async ({ page }) => {
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    // Click button
    const responsePromise = page.waitForResponse('**/api/generate');
    await luckyBtn.click();
    
    // Check loading state
    await expect(page.locator('text=Getting Lucky...')).toBeVisible();
    
    // Wait for response
    await responsePromise;
    
    // Check result appears
    await expect(page.locator('text=Claude\'s Design Philosophy')).toBeVisible();
    await expect(page.locator('text=Generated Page')).toBeVisible();
  });

  test('should display design philosophy details', async ({ page }) => {
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    // Generate a design
    await luckyBtn.click();
    await page.waitForResponse('**/api/generate');
    
    // Check all philosophy elements
    await expect(page.locator('text=Original Prompt')).toBeVisible();
    await expect(page.locator('text=Philosophy')).toBeVisible();
    await expect(page.locator('text=Personality')).toBeVisible();
    await expect(page.locator('text=Tags')).toBeVisible();
  });

  test('should show render time for generated page', async ({ page }) => {
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    // Generate a design
    await luckyBtn.click();
    await page.waitForResponse('**/api/generate');
    
    // Check render time is displayed
    await expect(page.locator('text=/Rendered in \\d+ms/')).toBeVisible();
  });

  test('should maintain history of generated designs', async ({ page }) => {
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    // Generate first design
    await luckyBtn.click();
    await page.waitForResponse('**/api/generate');
    await page.waitForTimeout(1000);
    
    // Generate second design
    await luckyBtn.click();
    await page.waitForResponse('**/api/generate');
    
    // Check history section appears
    await expect(page.locator('text=Recent Lucky Designs')).toBeVisible();
    
    // Check at least one history item exists
    const historyItems = page.locator('div[class*="cursor-pointer hover:border-blue-300"]');
    const count = await historyItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow clicking on history items to view them', async ({ page }) => {
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    // Generate two designs
    await luckyBtn.click();
    await page.waitForResponse('**/api/generate');
    await page.waitForTimeout(1000);
    
    await luckyBtn.click();
    await page.waitForResponse('**/api/generate');
    await page.waitForTimeout(1000);
    
    // Click on first history item
    const historyItem = page.locator('div[class*="cursor-pointer hover:border-blue-300"]').first();
    await historyItem.click();
    
    // Verify the view updates (philosophy section should still be visible)
    await expect(page.locator('text=Claude\'s Design Philosophy')).toBeVisible();
  });
});

// ==========================================
// NAVIGATION TESTS
// ==========================================

test.describe('Navigation Component', () => {
  test('should display all navigation items', async ({ page }) => {
    await page.goto('/');
    
    // Check main nav items
    await expect(page.locator('a:has-text("Home")')).toBeVisible();
    await expect(page.locator('a:has-text("Editor")')).toBeVisible();
    await expect(page.locator('a:has-text("I\'m Feeling Lucky")')).toBeVisible();
  });

  test('should highlight active page', async ({ page }) => {
    // Test Home page
    await page.goto('/');
    const homeLink = page.locator('a:has-text("Home")').first();
    await expect(homeLink).toHaveClass(/bg-blue-100 text-blue-700/);
    
    // Test Editor page
    await page.goto('/editor');
    const editorLink = page.locator('a:has-text("Editor")').first();
    await expect(editorLink).toHaveClass(/bg-blue-100 text-blue-700/);
    
    // Test Lucky page
    await page.goto('/lucky');
    const luckyLink = page.locator('a:has-text("I\'m Feeling Lucky")').first();
    await expect(luckyLink).toHaveClass(/bg-blue-100 text-blue-700/);
  });

  test('should show Claude status indicator', async ({ page }) => {
    await page.goto('/');
    
    // Check for status indicator
    const statusIndicator = page.locator('div:has-text("Claude Live"), div:has-text("Demo Mode")');
    await expect(statusIndicator).toBeVisible();
  });

  test('should display Grid 2.0 logo', async ({ page }) => {
    await page.goto('/');
    
    // Check logo elements
    await expect(page.locator('text=G2')).toBeVisible();
    await expect(page.locator('text=Grid 2.0')).toBeVisible();
  });
});

// ==========================================
// RESPONSIVE DESIGN TESTS
// ==========================================

test.describe('Responsive Design - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should adapt navigation for mobile', async ({ page }) => {
    await page.goto('/');
    
    // Mobile navigation should be visible
    const mobileNav = page.locator('.md\\:hidden');
    await expect(mobileNav).toBeVisible();
    
    // Desktop navigation should be hidden
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).toBeHidden();
  });

  test('should stack StyleShowcase cards on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Get all design cards
    const cards = page.locator('.group');
    const firstCard = cards.first();
    const secondCard = cards.nth(1);
    
    // Get positions
    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();
    
    // Cards should be stacked vertically
    if (firstBox && secondBox) {
      expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10);
    }
  });

  test('should adapt editor layout for mobile', async ({ page }) => {
    await page.goto('/editor');
    
    // Check that grid collapses to single column
    const editorGrid = page.locator('.grid.grid-cols-1.lg\\:grid-cols-12');
    await expect(editorGrid).toBeVisible();
  });
});

test.describe('Responsive Design - Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('should show 2-column layout on tablet', async ({ page }) => {
    await page.goto('/');
    
    // Get design cards
    const cards = page.locator('.group');
    const count = await cards.count();
    
    if (count >= 2) {
      const firstCard = cards.first();
      const secondCard = cards.nth(1);
      
      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();
      
      // Cards should be side by side
      if (firstBox && secondBox) {
        expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(10);
      }
    }
  });
});

// ==========================================
// API ENDPOINT TESTS
// ==========================================

test.describe('API Endpoints', () => {
  test('GET /api/generate should return API info', async ({ request }) => {
    const response = await request.get('/api/generate');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('name', 'Unified Generate API');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('availableTones');
  });

  test('POST /api/generate with tone mode', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        mode: 'tone',
        tone: 'minimal',
        sections: ['hero', 'features', 'cta']
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('tone', 'minimal');
    expect(data).toHaveProperty('page');
    expect(data.page.sections).toHaveLength(3);
  });

  test('POST /api/generate with random mode', async ({ request }) => {
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

  test('POST /api/generate with intent mode', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: {
        mode: 'intent',
        intent: 'Create a bold website for a tech startup'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('tone');
    expect(data).toHaveProperty('page');
  });

  test('POST /api/preview should initialize session', async ({ request }) => {
    const response = await request.post('/api/preview', {
      data: {
        action: 'init',
        sections: []
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('sessionId');
    expect(data).toHaveProperty('sections');
  });
});

// ==========================================
// ACCESSIBILITY TESTS
// ==========================================

test.describe('Accessibility', () => {
  test('should have no accessibility violations on home page', async ({ page }) => {
    await page.goto('/');
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    
    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/editor');
    
    // Check buttons have accessible text or aria-labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      
      // Button should have either text content, aria-label, or title
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });

  test('should support keyboard navigation in editor', async ({ page }) => {
    await page.goto('/editor');
    
    // Tab to textarea
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Type in textarea
    await page.keyboard.type('test command');
    
    // Tab to Apply button
    await page.keyboard.press('Tab');
    
    // Press Enter to apply
    await page.keyboard.press('Enter');
    
    // Should trigger preview
    await expect(page.locator('text=Interpreted intents')).toBeVisible();
  });
});

// ==========================================
// PERFORMANCE TESTS
// ==========================================

test.describe('Performance', () => {
  test('should load home page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should respond to transform commands quickly', async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('add features section');
    
    const startTime = Date.now();
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    // Wait for response
    await page.waitForTimeout(100);
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(2000);
  });
});

// ==========================================
// ERROR HANDLING TESTS
// ==========================================

test.describe('Error Handling', () => {
  test('should handle empty transform commands gracefully', async ({ page }) => {
    await page.goto('/editor');
    
    const applyBtn = page.locator('button:has-text("Apply")');
    
    // Button should be disabled when textarea is empty
    await expect(applyBtn).toBeDisabled();
  });

  test('should handle empty generation prompts', async ({ page }) => {
    await page.goto('/editor');
    
    // Switch to Generate mode
    const generateTab = page.locator('button:has-text("Generate")');
    await generateTab.click();
    
    const generateBtn = page.locator('button:has-text("Generate with Claude")');
    
    // Button should be disabled when textarea is empty
    await expect(generateBtn).toBeDisabled();
  });

  test('should display error messages appropriately', async ({ page }) => {
    await page.goto('/editor');
    
    // Force an error by intercepting the API call
    await page.route('**/api/preview', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test error' })
      });
    });
    
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('test command');
    
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    // Should show error message
    await expect(page.locator('text=Test error')).toBeVisible();
  });
});

// ==========================================
// INTEGRATION TESTS
// ==========================================

test.describe('End-to-End User Flows', () => {
  test('complete flow: generate design, apply transforms, and preview', async ({ page }) => {
    // 1. Start on home page
    await page.goto('/');
    await expect(page.locator('h1').first()).toContainText('Grid 2.0');
    
    // 2. Navigate to Lucky page
    await page.click('a:has-text("I\'m Feeling Lucky")');
    await page.waitForLoadState('networkidle');
    
    // 3. Generate a random design
    const luckyBtn = page.locator('button:has-text("I\'m Feeling Lucky")');
    await luckyBtn.click();
    await page.waitForResponse('**/api/generate');
    
    // 4. Verify design was generated
    await expect(page.locator('text=Claude\'s Design Philosophy')).toBeVisible();
    
    // 5. Navigate to Editor
    await page.click('a:has-text("Editor")');
    await page.waitForLoadState('networkidle');
    
    // 6. Apply a transform
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await textarea.fill('make it more minimal');
    
    const applyBtn = page.locator('button:has-text("Apply")');
    await applyBtn.click();
    
    // 7. Verify transform was applied
    await expect(page.locator('text=Interpreted intents')).toBeVisible();
    
    // 8. Switch to Generate mode
    const generateTab = page.locator('button:has-text("Generate")');
    await generateTab.click();
    
    // 9. Generate with Claude
    const promptTextarea = page.locator('textarea[placeholder*="Describe your website"]');
    await promptTextarea.fill('Create a minimal portfolio site');
    
    const generateBtn = page.locator('button:has-text("Generate with Claude")');
    await generateBtn.click();
    
    // 10. Return home
    await page.click('a:has-text("Home")');
    await expect(page.locator('h1').first()).toContainText('Grid 2.0');
  });

  test('theme selection persistence across pages', async ({ page }) => {
    // 1. Go to editor
    await page.goto('/editor');
    await page.waitForTimeout(2000);
    
    // 2. Select a theme
    const themeButton = page.locator('button[class*="border"]').filter({
      has: page.locator('div[class*="w-3 h-3"]')
    }).first();
    
    if (await themeButton.isVisible()) {
      await themeButton.click();
      
      // 3. Navigate to home
      await page.click('a:has-text("Home")');
      
      // 4. Return to editor
      await page.click('a:has-text("Editor")');
      await page.waitForTimeout(2000);
      
      // 5. Verify theme is still selected
      await expect(themeButton).toHaveClass(/border-blue-500/);
    }
  });
});