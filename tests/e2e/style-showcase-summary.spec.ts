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

test.describe('StyleShowcase Application - Summary Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Core functionality works', async ({ page }) => {
    // Basic page load
    await expect(page.getByRole('heading', { name: /Grid 2\.0 Style Showcase/i })).toBeVisible();
    
    // All categories are present
    for (const category of CATEGORIES) {
      await expect(page.getByRole('button', { name: category })).toBeVisible();
    }
    
    // Navigation links work
    await expect(page.getByRole('link', { name: /Try Editor/i })).toHaveAttribute('href', '/editor');
    await expect(page.getByRole('link', { name: /Static Demo/i })).toHaveAttribute('href', '/demo');
    
    // Footer is present
    await expect(page.getByText(/Each style generated in ~1ms using deterministic beam search/i)).toBeVisible();
  });

  test('✅ Category switching works', async ({ page }) => {
    for (const category of CATEGORIES) {
      await page.getByRole('button', { name: category }).click();
      
      // Verify category is selected
      await expect(page.getByRole('button', { name: category })).toHaveClass(/bg-gray-900/);
      
      // Check that at least one style for this category is visible
      const stylesInCategory = STYLES.filter(s => s.category === category);
      const firstStyleInCategory = stylesInCategory[0];
      await expect(page.getByRole('button', { name: firstStyleInCategory.label })).toBeVisible();
    }
  });

  test('✅ Style selection and generation works', async ({ page }) => {
    // Test a representative set of styles (not all 12 to avoid timeout)
    const testStyles = [
      { value: 'minimal', category: 'Safe & Boring' },
      { value: 'warm', category: 'Normal Human' },
      { value: 'bold', category: 'Getting Weird' },
      { value: 'playful', category: 'Research Lab' }
    ];

    for (const style of testStyles) {
      console.log(`Testing ${style.value} style`);
      
      // Switch to category
      await page.getByRole('button', { name: style.category }).click();
      
      // Find the style info
      const styleInfo = STYLES.find(s => s.value === style.value);
      if (!styleInfo) continue;
      
      // Click the style button
      await page.getByRole('button', { name: styleInfo.label }).click();
      
      // Wait for any loading to complete (if present)
      await page.waitForTimeout(3000);
      
      // Verify the style is selected by checking its not in default gray state
      const styleButton = page.getByRole('button', { name: styleInfo.label });
      const buttonClass = await styleButton.getAttribute('class');
      expect(buttonClass).not.toContain('bg-gray-100 hover:bg-gray-200 text-gray-700');
      
      // Verify description is updated
      await expect(page.locator('span').filter({ hasText: styleInfo.label })).toBeVisible();
    }
  });

  test('✅ Navigation links function correctly', async ({ page }) => {
    // Test editor link
    const editorLink = page.getByRole('link', { name: /Try Editor/i });
    await editorLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/editor');
    
    // Go back
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test demo link
    const demoLink = page.getByRole('link', { name: /Static Demo/i });
    await demoLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/demo');
  });

  test('✅ Image statistics are displayed', async ({ page }) => {
    const imageStats = page.locator('text=/\\d+ (AI images|placeholders)/');
    await expect(imageStats).toBeVisible();
  });

  test('✅ Mobile responsive design works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that main elements are still visible
    await expect(page.getByRole('heading', { name: /Grid 2\.0 Style Showcase/i })).toBeVisible();
    
    // Category switching still works
    await page.getByRole('button', { name: 'Normal Human' }).click();
    await expect(page.getByRole('button', { name: 'Warm' })).toBeVisible();
  });

  test('✅ No critical console errors during interaction', async ({ page }) => {
    const criticalErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out non-critical errors
        if (!text.includes('Failed to load resource') && 
            !text.includes('404') && 
            !text.includes('ERR_NETWORK') && 
            !text.includes('net::')) {
          criticalErrors.push(text);
        }
      }
    });
    
    // Interact with the app
    await page.getByRole('button', { name: 'Getting Weird' }).click();
    await page.getByRole('button', { name: 'Bold' }).click();
    await page.waitForTimeout(2000);
    
    expect(criticalErrors).toHaveLength(0);
  });
});