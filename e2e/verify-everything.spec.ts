import { test, expect } from '@playwright/test';

// Set longer timeout for all tests
test.setTimeout(60000);

test.describe('VERIFY EVERYTHING - Editor Page Reality Check', () => {
  
  test('1. Page Loads and Basic Elements Exist', async ({ page }) => {
    console.log('\n=== TEST 1: PAGE LOAD ===');
    
    const response = await page.goto('/editor');
    console.log('Response status:', response?.status());
    
    // Check if page loads at all
    await expect(page).toHaveURL('/editor');
    console.log('✓ URL correct');
    
    // Check main title
    const title = await page.locator('h2:has-text("Grid 2.0 Editor")').isVisible();
    console.log('✓ Title visible:', title);
    
    // Check tabs exist
    const transformTab = await page.locator('button:has-text("Transform")').isVisible();
    const generateTab = await page.locator('button:has-text("Generate")').isVisible();
    console.log('✓ Transform tab visible:', transformTab);
    console.log('✓ Generate tab visible:', generateTab);
    
    // Check for Theme button
    const themeButton = await page.locator('button:has-text("Themes")').count();
    console.log('✓ Theme button count:', themeButton);
    
    // Take screenshot for manual verification
    await page.screenshot({ path: 'test-results/1-page-load.png', fullPage: true });
  });

  test('2. Transform Tab - Check ALL Functionality', async ({ page }) => {
    console.log('\n=== TEST 2: TRANSFORM TAB ===');
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    // Check if Transform tab is active by default
    const transformTab = page.locator('button:has-text("Transform")');
    const classes = await transformTab.getAttribute('class');
    console.log('Transform tab classes:', classes);
    console.log('Is active?', classes?.includes('bg-white'));
    
    // Check for explanatory text
    const editModeText = await page.locator('text="Edit Mode"').isVisible();
    console.log('✓ Edit Mode label visible:', editModeText);
    
    // Check textarea
    const textarea = page.locator('textarea[placeholder*="make the hero more dramatic"]');
    const textareaVisible = await textarea.isVisible();
    console.log('✓ Textarea visible:', textareaVisible);
    
    // Check buttons
    const applyBtn = await page.locator('button:has-text("Apply")').isVisible();
    const undoBtn = await page.locator('button:has-text("Undo")').isVisible();
    const redoBtn = await page.locator('button:has-text("Redo")').isVisible();
    console.log('✓ Apply button visible:', applyBtn);
    console.log('✓ Undo button visible:', undoBtn);
    console.log('✓ Redo button visible:', redoBtn);
    
    // TEST APPLY FUNCTIONALITY
    console.log('\nTesting Apply functionality...');
    
    // Check if Apply is disabled initially
    const applyDisabled = await page.locator('button:has-text("Apply")').isDisabled();
    console.log('Apply disabled when empty:', applyDisabled);
    
    // Type something
    await textarea.fill('make it bold');
    
    // Check if Apply is enabled now
    const applyEnabledAfterText = await page.locator('button:has-text("Apply")').isEnabled();
    console.log('Apply enabled after text:', applyEnabledAfterText);
    
    // Try to click Apply and monitor network
    console.log('Clicking Apply button...');
    
    const apiPromise = page.waitForResponse(
      response => response.url().includes('/api/preview'),
      { timeout: 10000 }
    ).catch(err => {
      console.log('ERROR: No API call detected:', err.message);
      return null;
    });
    
    await page.locator('button:has-text("Apply")').click();
    
    const apiResponse = await apiPromise;
    if (apiResponse) {
      const status = apiResponse.status();
      const body = await apiResponse.json();
      console.log('API Response Status:', status);
      console.log('API Response:', JSON.stringify(body, null, 2).substring(0, 200));
      
      // Check if intents show up
      await page.waitForTimeout(1000);
      const intentsSection = page.locator('.rounded-lg.border.p-3.bg-gray-50');
      const intentsText = await intentsSection.textContent();
      console.log('Intents displayed:', intentsText);
    } else {
      console.log('❌ NO API RESPONSE - Transform is NOT connected to backend!');
    }
    
    await page.screenshot({ path: 'test-results/2-transform-tab.png', fullPage: true });
  });

  test('3. Generate Tab - Check Claude Director Connection', async ({ page }) => {
    console.log('\n=== TEST 3: GENERATE TAB ===');
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    // Click Generate tab
    await page.click('button:has-text("Generate")');
    await page.waitForTimeout(500);
    
    // Check if Generate Mode warning appears
    const generateWarning = await page.locator('text="Generate Mode"').isVisible();
    console.log('✓ Generate Mode label visible:', generateWarning);
    
    const warningText = await page.locator('text="Warning"').isVisible();
    console.log('✓ Warning text visible:', warningText);
    
    // Check Claude Director badge
    const claudeBadge = await page.locator('text="Claude AI Director"').isVisible();
    console.log('✓ Claude badge visible:', claudeBadge);
    
    // Check textarea
    const generateTextarea = page.locator('textarea[placeholder*="Describe your website"]');
    const textareaVisible = await generateTextarea.isVisible();
    console.log('✓ Generate textarea visible:', textareaVisible);
    
    // Check Generate button
    const generateBtn = page.locator('button:has-text("Generate with Claude")');
    const btnVisible = await generateBtn.isVisible();
    const btnDisabled = await generateBtn.isDisabled();
    console.log('✓ Generate button visible:', btnVisible);
    console.log('✓ Generate button disabled initially:', btnDisabled);
    
    // Type something and check if button enables
    await generateTextarea.fill('Test website');
    const btnEnabledAfterText = await generateBtn.isEnabled();
    console.log('✓ Generate button enabled after text:', btnEnabledAfterText);
    
    // TEST API CONNECTION (without actually calling Claude)
    console.log('\nChecking Claude Director API...');
    
    // Make a test call to check if endpoint exists
    const testResponse = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/claude-director', {
          method: 'GET',
        });
        return { status: res.status, ok: res.ok };
      } catch (err) {
        return { error: (err as Error).message };
      }
    });
    
    console.log('Claude Director API test:', testResponse);
    
    await page.screenshot({ path: 'test-results/3-generate-tab.png', fullPage: true });
  });

  test('4. Theme Modal - Complete Functionality Test', async ({ page }) => {
    console.log('\n=== TEST 4: THEME MODAL ===');
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    // Look for Theme button
    const themeBtn = page.locator('button:has-text("Themes")').first();
    const themeBtnExists = await themeBtn.count() > 0;
    console.log('✓ Theme button exists:', themeBtnExists);
    
    if (!themeBtnExists) {
      console.log('❌ NO THEME BUTTON FOUND - Feature might not be implemented!');
      return;
    }
    
    // Click theme button
    await themeBtn.click();
    await page.waitForTimeout(1000);
    
    // Check if modal opened
    const modalTitle = await page.locator('h2:has-text("Theme Gallery")').isVisible();
    console.log('✓ Theme modal opened:', modalTitle);
    
    if (!modalTitle) {
      console.log('❌ MODAL DID NOT OPEN - Modal might be broken!');
      await page.screenshot({ path: 'test-results/4-theme-modal-failed.png', fullPage: true });
      return;
    }
    
    // Check for theme loading
    const loadingText = await page.locator('text="Loading themes..."').isVisible();
    console.log('Loading text visible:', loadingText);
    
    // Wait for API call
    const cacheApiPromise = page.waitForResponse(
      response => response.url().includes('/api/claude-cache-list'),
      { timeout: 5000 }
    ).catch(() => null);
    
    const cacheResponse = await cacheApiPromise;
    if (cacheResponse) {
      const themes = await cacheResponse.json();
      console.log('✓ Themes loaded:', themes.length);
    } else {
      console.log('❌ NO CACHE API CALL - Themes not loading!');
    }
    
    // Check for theme items in modal
    await page.waitForTimeout(1000);
    const themeItems = page.locator('.grid > div').filter({ has: page.locator('.font-semibold') });
    const themeCount = await themeItems.count();
    console.log('✓ Theme items in modal:', themeCount);
    
    if (themeCount > 0) {
      // Click first theme
      const firstTheme = themeItems.first();
      const themeName = await firstTheme.locator('.font-semibold').textContent();
      console.log('Clicking theme:', themeName);
      
      await firstTheme.click();
      
      // Check for feeling-lucky API call
      const feelingLuckyPromise = page.waitForResponse(
        response => response.url().includes('/api/feeling-lucky'),
        { timeout: 5000 }
      ).catch(() => null);
      
      const feelingLuckyResponse = await feelingLuckyPromise;
      if (feelingLuckyResponse) {
        console.log('✓ Theme preview loaded via feeling-lucky');
      } else {
        console.log('❌ NO FEELING-LUCKY API CALL - Theme preview not working!');
      }
      
      // Check for Apply button
      const applyThemeBtn = await page.locator('button:has-text("Apply Theme")').isVisible();
      console.log('✓ Apply Theme button visible:', applyThemeBtn);
    }
    
    await page.screenshot({ path: 'test-results/4-theme-modal.png', fullPage: true });
    
    // Close modal
    const closeBtn = page.locator('svg').filter({ hasText: '' }).first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
    }
  });

  test('5. Preview Pane - Check Content Rendering', async ({ page }) => {
    console.log('\n=== TEST 5: PREVIEW PANE ===');
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    // Check preview pane exists
    const previewPane = page.locator('.lg\\:col-span-8');
    const paneVisible = await previewPane.isVisible();
    console.log('✓ Preview pane visible:', paneVisible);
    
    // Check preview header
    const previewHeader = page.locator('.border-b.p-3.text-sm.text-gray-600');
    const headerText = await previewHeader.textContent();
    console.log('✓ Preview header text:', headerText);
    
    // Check for content
    const h1Elements = await page.locator('h1').count();
    console.log('✓ H1 elements in preview:', h1Elements);
    
    if (h1Elements > 0) {
      const heroText = await page.locator('h1').first().textContent();
      console.log('✓ Hero text:', heroText);
    }
    
    const h2Elements = await page.locator('h2').count();
    console.log('✓ H2 elements in preview:', h2Elements);
    
    // Check if sections exist
    const sections = await page.locator('section').count();
    console.log('✓ Section elements:', sections);
    
    await page.screenshot({ path: 'test-results/5-preview-pane.png', fullPage: true });
  });

  test('6. API Endpoints - Direct Testing', async ({ request }) => {
    console.log('\n=== TEST 6: API ENDPOINTS ===');
    
    // Test /api/preview
    console.log('\nTesting /api/preview...');
    const previewResponse = await request.post('/api/preview', {
      data: { action: 'init', sections: [] }
    });
    console.log('Preview API status:', previewResponse.status());
    if (previewResponse.ok()) {
      const data = await previewResponse.json();
      console.log('Preview API response:', { 
        ok: data.ok, 
        hasSessionId: !!data.sessionId,
        error: data.error 
      });
    }
    
    // Test /api/claude-director
    console.log('\nTesting /api/claude-director...');
    const claudeResponse = await request.get('/api/claude-director');
    console.log('Claude Director API status:', claudeResponse.status());
    
    // Test /api/claude-cache-list
    console.log('\nTesting /api/claude-cache-list...');
    const cacheResponse = await request.get('/api/claude-cache-list');
    console.log('Cache List API status:', cacheResponse.status());
    if (cacheResponse.ok()) {
      const themes = await cacheResponse.json();
      console.log('Number of cached themes:', themes.length);
    }
    
    // Test /api/feeling-lucky
    console.log('\nTesting /api/feeling-lucky...');
    const luckyResponse = await request.get('/api/feeling-lucky?action=random');
    console.log('Feeling Lucky API status:', luckyResponse.status());
  });

  test('SUMMARY: What Actually Works', async ({ page }) => {
    console.log('\n' + '='.repeat(50));
    console.log('FINAL REALITY CHECK SUMMARY');
    console.log('='.repeat(50));
    
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
    
    const results: Record<string, boolean> = {
      'Page Loads': true,
      'Transform Tab Visible': await page.locator('button:has-text("Transform")').isVisible(),
      'Generate Tab Visible': await page.locator('button:has-text("Generate")').isVisible(),
      'Theme Button Exists': await page.locator('button:has-text("Themes")').count() > 0,
      'Transform Textarea Works': await page.locator('textarea[placeholder*="dramatic"]').isVisible(),
      'Apply Button Exists': await page.locator('button:has-text("Apply")').isVisible(),
      'Preview Pane Shows Content': await page.locator('h1').count() > 0,
    };
    
    // Test API connectivity
    await page.fill('textarea[placeholder*="dramatic"]', 'test');
    await page.click('button:has-text("Apply")');
    
    const apiWorks = await page.waitForResponse(
      response => response.url().includes('/api/preview'),
      { timeout: 3000 }
    ).then(() => true).catch(() => false);
    
    results['Transform API Connected'] = apiWorks;
    
    // Test theme modal
    if (results['Theme Button Exists']) {
      await page.click('button:has-text("Themes")');
      await page.waitForTimeout(1000);
      results['Theme Modal Opens'] = await page.locator('h2:has-text("Theme Gallery")').isVisible();
    } else {
      results['Theme Modal Opens'] = false;
    }
    
    console.log('\n✅ WORKING:');
    Object.entries(results).filter(([_, v]) => v).forEach(([k]) => {
      console.log(`  - ${k}`);
    });
    
    console.log('\n❌ NOT WORKING:');
    Object.entries(results).filter(([_, v]) => !v).forEach(([k]) => {
      console.log(`  - ${k}`);
    });
    
    console.log('\n' + '='.repeat(50));
  });
});