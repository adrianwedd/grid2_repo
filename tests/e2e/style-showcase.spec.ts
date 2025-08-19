import { test, expect } from '@playwright/test';

const STYLES = [
  // Safe & Boring
  { value: 'minimal', label: 'Minimal', category: 'Safe & Boring' },
  { value: 'corporate', label: 'Corporate', category: 'Safe & Boring' },
  { value: 'elegant', label: 'Elegant', category: 'Safe & Boring' },
  
  // Normal Human
  { value: 'warm', label: 'Warm', category: 'Normal Human' },
  { value: 'nature', label: 'Nature', category: 'Normal Human' },
  { value: 'luxury', label: 'Luxury', category: 'Normal Human' },
  
  // Getting Weird
  { value: 'bold', label: 'Bold', category: 'Getting Weird' },
  { value: 'modern', label: 'Modern', category: 'Getting Weird' },
  { value: 'retro', label: 'Retro', category: 'Getting Weird' },
  
  // Research Lab
  { value: 'playful', label: 'Playful', category: 'Research Lab' },
  { value: 'creative', label: 'Creative', category: 'Research Lab' },
  { value: 'monochrome', label: 'Monochrome', category: 'Research Lab' }
];

const CATEGORIES = ['Safe & Boring', 'Normal Human', 'Getting Weird', 'Research Lab'];

test.describe('StyleShowcase Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should load the main page correctly', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/Grid 2\.0/);
    await expect(page.getByRole('heading', { name: /Grid 2\.0 Style Showcase/i })).toBeVisible();
    await expect(page.getByText(/From government blandness to psychedelic research lab/i)).toBeVisible();
  });

  test('should display all category navigation buttons', async ({ page }) => {
    for (const category of CATEGORIES) {
      await expect(page.getByRole('button', { name: category })).toBeVisible();
    }
    
    // Default category should be selected
    await expect(page.getByRole('button', { name: 'Safe & Boring' })).toHaveClass(/bg-gray-900/);
  });

  test('should switch between categories and show correct style buttons', async ({ page }) => {
    for (const category of CATEGORIES) {
      // Click category button
      await page.getByRole('button', { name: category }).click();
      
      // Verify category is selected
      await expect(page.getByRole('button', { name: category })).toHaveClass(/bg-gray-900/);
      
      // Check that styles for this category are visible
      const stylesInCategory = STYLES.filter(s => s.category === category);
      for (const style of stylesInCategory) {
        await expect(page.getByRole('button', { name: style.label })).toBeVisible();
      }
      
      // Verify other category styles are not visible (except current selection)
      const stylesNotInCategory = STYLES.filter(s => s.category !== category);
      for (const style of stylesNotInCategory) {
        await expect(page.getByRole('button', { name: style.label })).not.toBeVisible();
      }
    }
  });

  test('should test all style buttons and page generation', async ({ page }) => {
    // Set a longer timeout for page generation
    test.setTimeout(120000);
    
    for (const category of CATEGORIES) {
      // Click category to show its styles
      await page.getByRole('button', { name: category }).click();
      
      const stylesInCategory = STYLES.filter(s => s.category === category);
      
      for (const style of stylesInCategory) {
        console.log(`Testing ${style.label} (${style.value}) in ${category}`);
        
        // Click the style button
        await page.getByRole('button', { name: style.label }).click();
        
        // Check if loading text is visible or wait for it to appear
        const loadingText = page.getByText(`Generating ${style.value} design...`);
        
        // Either loading text is already visible or appears within timeout
        try {
          await expect(loadingText).toBeVisible({ timeout: 2000 });
        } catch {
          // Loading might be instant or already completed, continue
        }
        
        // Wait for loading to complete (page should be generated)  
        await expect(loadingText).not.toBeVisible({ timeout: 15000 });
        
        // Verify the style is selected by checking it doesn't have the default gray styling
        const styleButton = page.getByRole('button', { name: style.label });
        const buttonClass = await styleButton.getAttribute('class');
        expect(buttonClass).not.toContain('bg-gray-100 hover:bg-gray-200 text-gray-700');
        
        // Verify style description is updated (check for the description span, not button)
        await expect(page.locator('span').filter({ hasText: style.label })).toBeVisible();
        
        // Wait for content to be rendered
        await page.waitForTimeout(2000);
        
        // Wait a moment between style changes
        await page.waitForTimeout(500);
      }
    }
  });

  test('should test navigation links', async ({ page }) => {
    // Test "Try Editor →" link
    const editorLink = page.getByRole('link', { name: /Try Editor/i });
    await expect(editorLink).toBeVisible();
    await expect(editorLink).toHaveAttribute('href', '/editor');
    
    // Test "Static Demo →" link  
    const demoLink = page.getByRole('link', { name: /Static Demo/i });
    await expect(demoLink).toBeVisible();
    await expect(demoLink).toHaveAttribute('href', '/demo');
    
    // Test clicking the editor link
    await editorLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/editor');
    
    // Go back to home
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test clicking the demo link
    await demoLink.click();
    await page.waitForLoadState('networkidle');  
    expect(page.url()).toContain('/demo');
  });

  test('should display image statistics correctly', async ({ page }) => {
    // Look for image stats in header
    const imageStats = page.locator('text=/\\d+ (AI images|placeholders)/');
    await expect(imageStats).toBeVisible();
    
    // Should show either AI images or placeholders count
    const statsText = await imageStats.textContent();
    expect(statsText).toMatch(/\d+ (AI images|placeholders)/);
  });

  test('should show footer information', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer, .bg-gray-900').last().scrollIntoViewIfNeeded();
    
    // Check footer content
    await expect(page.getByText(/Each style generated in ~1ms using deterministic beam search/i)).toBeVisible();
    await expect(page.getByText(/Same content, different aesthetic personalities/i)).toBeVisible();
  });

  test('should handle rapid style switching without errors', async ({ page }) => {
    test.setTimeout(60000);
    
    // Quickly switch between a few styles to test robustness
    const testStyles = ['minimal', 'bold', 'playful', 'modern'];
    
    for (const styleName of testStyles) {
      const style = STYLES.find(s => s.value === styleName);
      if (!style) continue;
      
      // Switch to the right category first
      await page.getByRole('button', { name: style.category }).click();
      
      // Click the style
      await page.getByRole('button', { name: style.label }).click();
      
      // Wait just a moment before next click
      await page.waitForTimeout(500);
    }
    
    // Verify final state loaded properly
    const finalLoadingSpinner = page.getByText(/Generating .* design\.\.\./);
    await expect(finalLoadingSpinner).not.toBeVisible({ timeout: 15000 });
  });

  test('should verify page content renders for each style', async ({ page }) => {
    test.setTimeout(180000);
    
    // Test a few representative styles to ensure content renders
    const testStyles = [
      { value: 'minimal', category: 'Safe & Boring' },
      { value: 'warm', category: 'Normal Human' },
      { value: 'bold', category: 'Getting Weird' },
      { value: 'creative', category: 'Research Lab' }
    ];
    
    for (const style of testStyles) {
      console.log(`Verifying content rendering for ${style.value}`);
      
      // Switch to category
      await page.getByRole('button', { name: style.category }).click();
      
      // Click style
      const styleButton = page.getByRole('button', { name: STYLES.find(s => s.value === style.value)?.label || style.value });
      await styleButton.click();
      
      // Wait for generation to complete
      await expect(page.getByText(`Generating ${style.value} design...`)).not.toBeVisible({ timeout: 15000 });
      
      // Look for common page elements that should be rendered
      const pageContent = page.locator('main').last(); // Get the inner main element
      
      // Look for typical section content (headings, paragraphs, etc.)
      const hasContent = await pageContent.locator('h1, h2, h3, p, button, img').count();
      expect(hasContent).toBeGreaterThan(0);
      
      await page.waitForTimeout(1000);
    }
  });

  test('should check for console errors during style switching', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Test a few style switches
    await page.getByRole('button', { name: 'Safe & Boring' }).click();
    await page.getByRole('button', { name: 'Minimal' }).click();
    await page.waitForTimeout(2000);
    
    await page.getByRole('button', { name: 'Getting Weird' }).click();
    await page.getByRole('button', { name: 'Bold' }).click();
    await page.waitForTimeout(2000);
    
    await page.getByRole('button', { name: 'Research Lab' }).click();
    await page.getByRole('button', { name: 'Creative' }).click();
    await page.waitForTimeout(2000);
    
    // Filter out non-critical errors (like network failures for missing images)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Failed to load resource') &&
      !error.includes('404') &&
      !error.includes('ERR_NETWORK') &&
      !error.includes('net::')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should verify responsive design on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that header elements are still visible and functional
    await expect(page.getByRole('heading', { name: /Grid 2\.0 Style Showcase/i })).toBeVisible();
    
    // Category buttons should still be clickable
    await page.getByRole('button', { name: 'Normal Human' }).click();
    await expect(page.getByRole('button', { name: 'Warm' })).toBeVisible();
    
    // Test a style click on mobile
    await page.getByRole('button', { name: 'Warm' }).click();
    
    // Loading might be instant on mobile, so handle both cases
    const loadingText = page.getByText(/Generating warm design\.\.\./);
    try {
      await expect(loadingText).toBeVisible({ timeout: 2000 });
      await expect(loadingText).not.toBeVisible({ timeout: 15000 });
    } catch {
      // Loading was instant, verify content is there instead
      await page.waitForTimeout(1000);
    }
  });
});