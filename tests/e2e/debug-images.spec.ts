import { test, expect } from '@playwright/test';

test('debug image loading', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('Browser:', msg.text()));
  
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForTimeout(5000);
  
  // Check for any images
  const imageCount = await page.locator('img').count();
  console.log(`Found ${imageCount} images`);
  
  // Check for style cards
  const styleCards = await page.locator('.group').count();
  console.log(`Found ${styleCards} style cards`);
  
  // Check page content
  const pageContent = await page.content();
  
  // Look for specific elements
  const hasMinimal = pageContent.includes('Minimal');
  const hasBold = pageContent.includes('Bold');
  const hasImages = pageContent.includes('<img');
  
  console.log('Has Minimal:', hasMinimal);
  console.log('Has Bold:', hasBold);  
  console.log('Has img tags:', hasImages);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-home.png', fullPage: true });
  
  // Check what's actually being rendered
  const visibleText = await page.locator('body').textContent();
  console.log('Page text preview:', visibleText?.substring(0, 500));
});