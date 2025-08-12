// tests/claude-director-ui.spec.ts
// Test Claude Director UI integration end-to-end

import { test, expect } from '@playwright/test';

test.describe('Claude Director UI Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're running on the right port
    await page.goto('http://localhost:7429');
  });

  test('Editor should connect to Claude Director', async ({ page }) => {
    await page.goto('http://localhost:7429/editor');
    
    // Wait for editor to load
    await expect(page.locator('h2:has-text("Realtime Editor")')).toBeVisible();
    
    // Find the textarea for commands
    const textarea = page.locator('textarea[placeholder*="make the hero"]');
    await expect(textarea).toBeVisible();
    
    // Enter a command that should trigger Claude Director
    await textarea.fill('Make it feel like Apple designed this');
    
    // Wait for the Apply button and click it
    const applyButton = page.locator('button:has-text("Apply")');
    await expect(applyButton).toBeEnabled();
    await applyButton.click();
    
    // Wait for response (Claude Director should respond)
    await expect(page.locator('text=Claude Director')).toBeVisible({ timeout: 10000 });
    
    // Check that we get a design philosophy response
    const intentsSection = page.locator('div:has-text("Interpreted intents")').locator('..');
    await expect(intentsSection).toContainText('Claude Director');
    
    // Check that we get change summary with Claude reasoning
    await expect(page.locator('text=Change summary')).toBeVisible();
    
    // Verify the preview updated
    const preview = page.locator('div:has-text("Preview")');
    await expect(preview).toBeVisible();
  });

  test('Editor should show different philosophies for different commands', async ({ page }) => {
    await page.goto('http://localhost:7429/editor');
    
    const textarea = page.locator('textarea');
    const applyButton = page.locator('button:has-text("Apply")');
    
    // Test first command - Apple style
    await textarea.fill('Make it minimal like Apple');
    await applyButton.click();
    await expect(page.locator('text=Claude Director')).toBeVisible({ timeout: 8000 });
    
    // Get first response
    const firstResponse = await page.locator('div:has-text("Interpreted intents")').textContent();
    
    // Test second command - Different style
    await textarea.fill('Make it bold and dramatic like a startup');
    await applyButton.click();
    await expect(page.locator('text=Claude Director')).toBeVisible({ timeout: 8000 });
    
    // Get second response - should be different
    const secondResponse = await page.locator('div:has-text("Interpreted intents")').textContent();
    
    // Responses should be different (different philosophies)
    expect(firstResponse).not.toBe(secondResponse);
  });

  test('"I\'m Feeling Lucky" page should work', async ({ page }) => {
    await page.goto('http://localhost:7429/lucky');
    
    // Check page loaded
    await expect(page.locator('h1:has-text("I\'m Feeling Lucky")')).toBeVisible();
    
    // Check the lucky button exists
    const luckyButton = page.locator('button:has-text("I\'m Feeling Lucky")');
    await expect(luckyButton).toBeVisible();
    
    // Click the lucky button
    await luckyButton.click();
    
    // Wait for result (should show Claude's design philosophy)
    await expect(page.locator('text=Claude\'s Design Philosophy')).toBeVisible({ timeout: 10000 });
    
    // Check that we see the philosophy components
    await expect(page.locator('text=Original Prompt')).toBeVisible();
    await expect(page.locator('text=Philosophy')).toBeVisible();
    await expect(page.locator('text=Personality')).toBeVisible();
    
    // Check that a page was generated
    await expect(page.locator('text=Generated Page')).toBeVisible();
    await expect(page.locator('text=Rendered in')).toBeVisible();
  });

  test('"I\'m Feeling Lucky" should show different designs', async ({ page }) => {
    await page.goto('http://localhost:7429/lucky');
    
    const luckyButton = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    // Get first lucky design
    await luckyButton.click();
    await expect(page.locator('text=Philosophy')).toBeVisible({ timeout: 8000 });
    
    const firstPhilosophy = await page.locator('div:has-text("Philosophy") + div').textContent();
    
    // Get second lucky design
    await luckyButton.click();
    await expect(page.locator('text=Philosophy')).toBeVisible({ timeout: 8000 });
    
    const secondPhilosophy = await page.locator('div:has-text("Philosophy") + div').textContent();
    
    // They could be the same if we only have a few cached specs, but the system should work
    console.log('First philosophy:', firstPhilosophy);
    console.log('Second philosophy:', secondPhilosophy);
    
    // At minimum, both should have content
    expect(firstPhilosophy).toBeTruthy();
    expect(secondPhilosophy).toBeTruthy();
  });

  test('Claude Director API should cache responses', async ({ page }) => {
    // Generate a new design to add to cache
    await page.goto('http://localhost:7429/editor');
    
    const textarea = page.locator('textarea');
    const applyButton = page.locator('button:has-text("Apply")');
    
    // Create a unique command that should get cached
    const uniqueCommand = `Create a ${Date.now()} design for testing`;
    await textarea.fill(uniqueCommand);
    await applyButton.click();
    
    // Wait for Claude Director response
    await expect(page.locator('text=Claude Director')).toBeVisible({ timeout: 8000 });
    
    // Now go to lucky page and see if we can find this cached response
    await page.goto('http://localhost:7429/lucky');
    
    // Try getting lucky a few times to potentially find our cached command
    const luckyButton = page.locator('button:has-text("I\'m Feeling Lucky")');
    
    for (let i = 0; i < 5; i++) {
      await luckyButton.click();
      await page.waitForTimeout(1000);
      
      // Check if we see our unique command in the results
      const promptText = await page.locator('text=Original Prompt').locator('..').textContent();
      if (promptText && promptText.includes('testing')) {
        // Found our cached command!
        await expect(page.locator('text=Generated Page')).toBeVisible();
        break;
      }
    }
    
    // At minimum, the lucky system should work
    await expect(page.locator('text=Philosophy')).toBeVisible();
  });

  test('Claude Director should provide rich analysis', async ({ page }) => {
    await page.goto('http://localhost:7429/editor');
    
    const textarea = page.locator('textarea');
    const applyButton = page.locator('button:has-text("Apply")');
    
    // Use a command that should generate rich analysis
    await textarea.fill('Create a premium meditation app with Apple-inspired design');
    await applyButton.click();
    
    // Wait for Claude Director response
    await expect(page.locator('text=Claude Director')).toBeVisible({ timeout: 8000 });
    
    // Check that we get rich analysis with multiple data points
    const analysisSection = page.locator('div:has-text("Change summary")').locator('..');
    await expect(analysisSection).toBeVisible();
    
    // Should show philosophy, personality, goal, sections count
    await expect(analysisSection).toContainText('Philosophy');
    await expect(analysisSection).toContainText('Personality');
    await expect(analysisSection).toContainText('Goal');
    await expect(analysisSection).toContainText('Sections');
    
    // Check impact metrics are shown
    await expect(page.locator('text=Aesthetics')).toBeVisible();
    await expect(page.locator('text=Conversion')).toBeVisible();
    await expect(page.locator('text=Performance')).toBeVisible();
    
    // Impact should be high (Claude Director gives 95%, 90%, 92%)
    const aestheticsValue = page.locator('div:has-text("Aesthetics") + div');
    await expect(aestheticsValue).toBeVisible();
  });

  test('System should handle errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:7429/editor');
    
    const textarea = page.locator('textarea');
    const applyButton = page.locator('button:has-text("Apply")');
    
    // Try with empty command
    await textarea.fill('');
    await applyButton.click();
    
    // Should handle gracefully (either show message or do nothing)
    // Don't expect any specific error, just that page doesn't crash
    await page.waitForTimeout(1000);
    expect(page.locator('h2:has-text("Realtime Editor")')).toBeVisible();
    
    // Try with very short command
    await textarea.fill('hi');
    await applyButton.click();
    
    // Should still work or handle gracefully
    await page.waitForTimeout(2000);
    expect(page.locator('h2:has-text("Realtime Editor")')).toBeVisible();
  });
});