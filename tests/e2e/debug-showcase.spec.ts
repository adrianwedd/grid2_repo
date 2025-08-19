import { test, expect } from '@playwright/test';

test.describe('Debug StyleShowcase', () => {
  test('should investigate loading issue', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`Browser console: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check current state
    console.log('Page title:', await page.title());
    
    const loadingElement = page.getByText(/Generating .* design\.\.\./);
    const isLoading = await loadingElement.isVisible();
    console.log('Loading state visible:', isLoading);
    
    if (isLoading) {
      const loadingText = await loadingElement.textContent();
      console.log('Loading text:', loadingText);
    }
    
    // Check if StyleShowcase component is mounted
    const showcase = page.locator('[data-testid="style-showcase"]');
    const showcaseExists = await showcase.count();
    console.log('StyleShowcase elements:', showcaseExists);
    
    // Check if buttons are clickable
    const minimalButton = page.getByRole('button', { name: 'Minimal' });
    const buttonExists = await minimalButton.count();
    console.log('Minimal button count:', buttonExists);
    
    if (buttonExists > 0) {
      console.log('Minimal button classes:', await minimalButton.getAttribute('class'));
      
      // Try clicking and see what happens
      console.log('Clicking minimal button...');
      await minimalButton.click();
      
      // Wait a bit and check state
      await page.waitForTimeout(3000);
      
      const stillLoading = await loadingElement.isVisible();
      console.log('Still loading after click:', stillLoading);
    }
    
    // Check for any network requests
    const requests: string[] = [];
    page.on('request', req => {
      if (req.url().includes('/api/')) {
        requests.push(`${req.method()} ${req.url()}`);
      }
    });
    
    await page.waitForTimeout(2000);
    console.log('API requests made:', requests);
    
    // Check if page content is being rendered
    const mainContent = page.locator('main').last();
    const contentHTML = await mainContent.innerHTML();
    console.log('Main content length:', contentHTML.length);
    console.log('Has PageRenderer content:', contentHTML.includes('sections') || contentHTML.includes('hero') || contentHTML.includes('features'));
  });
});