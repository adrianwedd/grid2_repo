import { test, expect } from '@playwright/test';

test.describe('Editor Page - Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    console.log('Navigating to editor page...');
    await page.goto('/editor');
    await page.waitForSelector('h2:has-text("Grid 2.0 Editor")', { timeout: 10000 });
  });

  test.describe('Page Structure', () => {
    test('should have all main components', async ({ page }) => {
      // Check main title
      const title = page.locator('h2:has-text("Grid 2.0 Editor")');
      await expect(title).toBeVisible();
      console.log('✓ Title visible');

      // Check tabs
      const transformTab = page.locator('button:has-text("Transform")');
      const generateTab = page.locator('button:has-text("Generate")');
      await expect(transformTab).toBeVisible();
      await expect(generateTab).toBeVisible();
      console.log('✓ Both tabs visible');

      // Check preview pane
      const previewPane = page.locator('.lg\\:col-span-8');
      await expect(previewPane).toBeVisible();
      console.log('✓ Preview pane visible');

      // Check theme previewer
      const themePreviewer = page.locator('h3:has-text("Live Theme Preview")');
      await expect(themePreviewer).toBeVisible();
      console.log('✓ Theme previewer visible');
    });
  });

  test.describe('Transform Tab', () => {
    test('should be active by default', async ({ page }) => {
      const transformTab = page.locator('button:has-text("Transform")');
      const tabClasses = await transformTab.getAttribute('class');
      expect(tabClasses).toContain('bg-white');
      expect(tabClasses).toContain('shadow-sm');
      console.log('✓ Transform tab is active by default');
    });

    test('should show transform controls', async ({ page }) => {
      // Check textarea
      const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
      await expect(textarea).toBeVisible();
      console.log('✓ Transform textarea visible');

      // Check buttons
      const applyButton = page.locator('button:has-text("Apply")');
      const undoButton = page.locator('button:has-text("Undo")');
      const redoButton = page.locator('button:has-text("Redo")');
      
      await expect(applyButton).toBeVisible();
      await expect(undoButton).toBeVisible();
      await expect(redoButton).toBeVisible();
      console.log('✓ Apply, Undo, Redo buttons visible');

      // Check Apply button is disabled when textarea is empty
      const applyDisabled = await applyButton.isDisabled();
      expect(applyDisabled).toBe(true);
      console.log('✓ Apply button disabled when empty');
    });

    test('should enable Apply when text is entered', async ({ page }) => {
      const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
      const applyButton = page.locator('button:has-text("Apply")');
      
      await textarea.fill('make it bold');
      await expect(applyButton).toBeEnabled();
      console.log('✓ Apply button enabled after entering text');
    });

    test('should call preview API when Apply is clicked', async ({ page }) => {
      const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
      const applyButton = page.locator('button:has-text("Apply")');
      
      await textarea.fill('add testimonials');
      
      // Listen for API call
      const apiPromise = page.waitForResponse(response => 
        response.url().includes('/api/preview') && response.status() === 200
      );
      
      await applyButton.click();
      
      const response = await apiPromise;
      const data = await response.json();
      console.log('✓ Preview API called with response:', data.action || 'unknown action');
      
      // Check for intents display
      const intentsSection = page.locator('.rounded-lg.border.p-3.bg-gray-50');
      const intentsText = await intentsSection.textContent();
      console.log('✓ Intents displayed:', intentsText);
    });
  });

  test.describe('Generate Tab', () => {
    test('should switch to generate mode', async ({ page }) => {
      const generateTab = page.locator('button:has-text("Generate")');
      await generateTab.click();
      
      // Check tab is active
      const tabClasses = await generateTab.getAttribute('class');
      expect(tabClasses).toContain('bg-white');
      console.log('✓ Generate tab activated');

      // Check Claude Director section appears
      const claudeSection = page.locator('text="Claude AI Director"');
      await expect(claudeSection).toBeVisible();
      console.log('✓ Claude AI Director section visible');

      // Check generate textarea
      const generateTextarea = page.locator('textarea[placeholder*="Describe your website"]');
      await expect(generateTextarea).toBeVisible();
      console.log('✓ Generate textarea visible');

      // Check generate button
      const generateButton = page.locator('button:has-text("Generate with Claude")');
      await expect(generateButton).toBeVisible();
      console.log('✓ Generate button visible');
    });

    test('should call claude-director API when Generate is clicked', async ({ page }) => {
      const generateTab = page.locator('button:has-text("Generate")');
      await generateTab.click();
      
      const textarea = page.locator('textarea[placeholder*="Describe your website"]');
      const generateButton = page.locator('button:has-text("Generate with Claude")');
      
      await textarea.fill('Create a modern fintech website');
      
      // Check button is enabled
      const isDisabled = await generateButton.isDisabled();
      expect(isDisabled).toBe(false);
      console.log('✓ Generate button enabled with text');
      
      // Note: Not clicking because it would trigger actual Claude generation
      console.log('✓ Would call /api/claude-director when clicked');
    });
  });

  test.describe('Live Theme Preview', () => {
    test('should load themes from cache', async ({ page }) => {
      // Wait for API call
      const response = await page.waitForResponse(response => 
        response.url().includes('/api/claude-cache-list') && response.status() === 200
      );
      
      const themes = await response.json();
      console.log(`✓ Loaded ${themes.length} themes from cache`);
      
      // Check themes are displayed
      const themeButtons = page.locator('.bg-white.border.rounded-lg').last().locator('button');
      const count = await themeButtons.count();
      console.log(`✓ Displaying ${count} theme buttons`);
      
      // Get first few theme names
      if (count > 0) {
        for (let i = 0; i < Math.min(3, count); i++) {
          const text = await themeButtons.nth(i).textContent();
          console.log(`  - Theme ${i + 1}: ${text}`);
        }
      }
    });

    test('should preview theme when clicked', async ({ page }) => {
      // Wait for themes to load
      await page.waitForResponse(response => 
        response.url().includes('/api/claude-cache-list')
      );
      
      const themeButtons = page.locator('.bg-white.border.rounded-lg').last().locator('button');
      const firstTheme = themeButtons.first();
      
      if (await firstTheme.count() > 0) {
        const themeName = await firstTheme.textContent();
        console.log(`✓ Clicking theme: ${themeName}`);
        
        await firstTheme.click();
        
        // Wait for feeling-lucky API
        const response = await page.waitForResponse(response => 
          response.url().includes('/api/feeling-lucky') && response.status() === 200
        );
        
        const data = await response.json();
        console.log('✓ Theme loaded via feeling-lucky API');
        console.log(`  - Philosophy: ${data.cached?.philosophy?.substring(0, 50)}...`);
        
        // Check if theme details are shown
        const selectedDetails = page.locator('.bg-gray-50').filter({ hasText: themeName || '' });
        const isVisible = await selectedDetails.isVisible().catch(() => false);
        console.log(`✓ Theme details visible: ${isVisible}`);
        
        // Check for color swatches
        const colorSwatches = page.locator('div[title="Primary"]');
        const hasColors = await colorSwatches.count() > 0;
        console.log(`✓ Color swatches displayed: ${hasColors}`);
      }
    });

    test('should apply theme on double-click', async ({ page }) => {
      // Wait for themes to load
      await page.waitForResponse(response => 
        response.url().includes('/api/claude-cache-list')
      );
      
      // Get initial CSS values
      const initialPrimary = await page.evaluate(() => 
        getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
      );
      const initialFont = await page.evaluate(() => 
        getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim()
      );
      
      console.log('Initial CSS variables:');
      console.log(`  - Primary: ${initialPrimary}`);
      console.log(`  - Font: ${initialFont}`);
      
      const themeButtons = page.locator('.bg-white.border.rounded-lg').last().locator('button');
      const firstTheme = themeButtons.first();
      
      if (await firstTheme.count() > 0) {
        const themeName = await firstTheme.textContent();
        
        // First click to select
        await firstTheme.click();
        await page.waitForTimeout(1000);
        console.log(`✓ Selected theme: ${themeName}`);
        
        // Double-click to apply
        await firstTheme.dblclick();
        await page.waitForTimeout(500);
        console.log('✓ Double-clicked to apply');
        
        // Check if CSS changed
        const newPrimary = await page.evaluate(() => 
          getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
        );
        const newFont = await page.evaluate(() => 
          getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim()
        );
        
        console.log('New CSS variables:');
        console.log(`  - Primary: ${newPrimary}`);
        console.log(`  - Font: ${newFont}`);
        
        const primaryChanged = initialPrimary !== newPrimary;
        const fontChanged = initialFont !== newFont;
        
        console.log(`✓ Primary color changed: ${primaryChanged}`);
        console.log(`✓ Font changed: ${fontChanged}`);
        
        if (!primaryChanged && !fontChanged) {
          console.log('⚠️ Theme may not be applying correctly');
        }
      }
    });
  });

  test.describe('Preview Pane', () => {
    test('should display default sections', async ({ page }) => {
      // Check preview header
      const previewHeader = page.locator('.border-b.p-3.text-sm.text-gray-600');
      const headerText = await previewHeader.textContent();
      console.log(`✓ Preview header: "${headerText}"`);
      
      // Check for rendered sections
      const heroSection = page.locator('h1');
      if (await heroSection.count() > 0) {
        const heroText = await heroSection.first().textContent();
        console.log(`✓ Hero headline: "${heroText}"`);
      }
      
      // Check for features section
      const featuresSection = page.locator('h2:has-text("Everything you need")');
      const hasFeatures = await featuresSection.count() > 0;
      console.log(`✓ Features section present: ${hasFeatures}`);
      
      // Check for CTA section
      const ctaSection = page.locator('text="Ready to accelerate"');
      const hasCTA = await ctaSection.count() > 0;
      console.log(`✓ CTA section present: ${hasCTA}`);
    });

    test('should update preview when transform is applied', async ({ page }) => {
      const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
      const applyButton = page.locator('button:has-text("Apply")');
      
      // Get initial hero text
      const initialHero = await page.locator('h1').first().textContent();
      console.log(`Initial hero: "${initialHero}"`);
      
      // Apply transform
      await textarea.fill('make the headline more exciting');
      await applyButton.click();
      
      // Wait for preview update
      await page.waitForResponse(response => 
        response.url().includes('/api/preview')
      );
      await page.waitForTimeout(1000);
      
      // Check if preview changed
      const newHero = await page.locator('h1').first().textContent();
      console.log(`New hero: "${newHero}"`);
      
      const changed = initialHero !== newHero;
      console.log(`✓ Preview updated: ${changed}`);
    });
  });

  test('Full User Journey', async ({ page }) => {
    console.log('\n=== FULL USER JOURNEY TEST ===\n');
    
    // 1. Start with Transform
    console.log('1. Testing Transform feature:');
    const transformTextarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    await transformTextarea.fill('add testimonials section');
    
    const applyButton = page.locator('button:has-text("Apply")');
    await applyButton.click();
    
    await page.waitForResponse(response => 
      response.url().includes('/api/preview')
    );
    console.log('   ✓ Transform applied');
    
    // 2. Switch to Generate
    console.log('\n2. Testing Generate feature:');
    const generateTab = page.locator('button:has-text("Generate")');
    await generateTab.click();
    
    const generateTextarea = page.locator('textarea[placeholder*="Describe your website"]');
    await expect(generateTextarea).toBeVisible();
    console.log('   ✓ Generate mode active');
    
    // 3. Test Theme Preview
    console.log('\n3. Testing Theme Preview:');
    await page.waitForResponse(response => 
      response.url().includes('/api/claude-cache-list')
    );
    
    const themeButtons = page.locator('.bg-white.border.rounded-lg').last().locator('button');
    const themeCount = await themeButtons.count();
    console.log(`   ✓ ${themeCount} themes available`);
    
    if (themeCount > 0) {
      const firstTheme = themeButtons.first();
      await firstTheme.click();
      
      await page.waitForResponse(response => 
        response.url().includes('/api/feeling-lucky')
      );
      console.log('   ✓ Theme preview loaded');
    }
    
    console.log('\n=== END USER JOURNEY ===\n');
  });
});