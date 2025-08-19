import { test, expect } from '@playwright/test';

test.describe('Warm Button Debug', () => {
  test('investigate warm button issue', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('=== DEBUGGING WARM BUTTON ISSUE ===');
    
    // Check if we can see Normal Human category
    const normalHumanButton = page.getByRole('button', { name: 'Normal Human' });
    console.log('Normal Human button visible:', await normalHumanButton.isVisible());
    
    // Click it
    await normalHumanButton.click();
    await page.waitForTimeout(1000);
    
    // Check all buttons visible now
    const allButtons = await page.locator('button').all();
    console.log('Total buttons on page:', allButtons.length);
    
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Button ${i}: "${text}" - Visible: ${isVisible}`);
    }
    
    // Specifically look for Warm
    const warmButtons = page.getByRole('button', { name: 'Warm' });
    const warmCount = await warmButtons.count();
    console.log('Warm button count:', warmCount);
    
    if (warmCount > 0) {
      const warmButton = warmButtons.first();
      console.log('Warm button visible:', await warmButton.isVisible());
      console.log('Warm button classes:', await warmButton.getAttribute('class'));
    }
    
    // Screenshot for debugging
    await page.screenshot({ path: 'debug-warm-button.png' });
  });
});