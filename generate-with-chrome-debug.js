#!/usr/bin/env node

import { chromium } from 'playwright';

const LAST_IMAGES = [
  {
    name: 'corporate-hero',
    prompt: 'Create a visual aesthetic image: Professional blue business composition, modern corporate environment, trustworthy business aesthetic, professional institutional design. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'creative-cta',
    prompt: 'Create a visual aesthetic image: Artistic creative gradient with paint effects, expressive aesthetic, creative composition with paint splashes and artistic expression. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'playful-hero',
    prompt: 'Create a visual aesthetic image: Vibrant playful composition with bright rainbow colors, fun energetic aesthetic, colorful and lively design atmosphere. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  }
];

async function generateWithChromeDebug() {
  console.log('🎨 Generating Last 3 Images via Chrome Debug Port');
  console.log('=================================================\n');
  
  // Wait a moment for Chrome to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    console.log('📡 Connecting to Chrome on port 9222...');
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const context = browser.contexts()[0];
    const pages = context.pages();
    
    console.log(`✅ Connected! Found ${pages.length} page(s)\n`);
    
    // Get existing page or create new one
    let page = pages[0];
    
    // Navigate to ChatGPT
    console.log('📍 Navigating to ChatGPT...');
    await page.goto('https://chatgpt.com');
    await page.waitForTimeout(3000);
    
    // Check if we need to log in
    const title = await page.title();
    console.log(`Page title: ${title}\n`);
    
    if (title.includes('Log in')) {
      console.log('⚠️  Please log in to ChatGPT in the browser window');
      console.log('Press Enter when logged in...');
      
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      await new Promise(resolve => {
        rl.question('', () => {
          rl.close();
          resolve();
        });
      });
    }
    
    console.log('✅ Ready to generate images!\n');
    
    for (const [index, imageData] of LAST_IMAGES.entries()) {
      console.log(`🎨 [${index + 1}/3] Generating ${imageData.name}...`);
      
      try {
        // Navigate to new chat
        await page.goto('https://chatgpt.com');
        await page.waitForTimeout(2000);
        
        // Find composer - try multiple selectors
        let composer = null;
        const selectors = [
          '#prompt-textarea',
          '[data-id="composer"]',
          '.ProseMirror',
          'textarea',
          '[contenteditable="true"]'
        ];
        
        for (const selector of selectors) {
          try {
            const element = page.locator(selector).first();
            if (await element.count() > 0) {
              composer = element;
              console.log(`  Found input: ${selector}`);
              break;
            }
          } catch {}
        }
        
        if (!composer) {
          console.log('  ❌ Could not find input field');
          continue;
        }
        
        // Clear and type
        await composer.click();
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await composer.fill(imageData.prompt);
        
        // Send - try multiple methods
        let sent = false;
        
        // Try send button first
        try {
          const sendButton = page.locator('[data-testid="send-button"], button[aria-label*="Send"]').first();
          if (await sendButton.count() > 0) {
            await sendButton.click();
            sent = true;
            console.log('  📤 Sent via button');
          }
        } catch {}
        
        // Try Enter key if button didn't work
        if (!sent) {
          await page.keyboard.press('Enter');
          console.log('  📤 Sent via Enter key');
        }
        
        console.log('  ⏳ Waiting for generation...');
        
        // Wait for image with longer timeout
        await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]', {
          timeout: 120000
        });
        
        console.log(`  ✅ ${imageData.name} generated!`);
        console.log(`  💾 Right-click to save as: public/generated-images/${imageData.name}.png\n`);
        
        // Pause between generations
        await page.waitForTimeout(5000);
        
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message}\n`);
      }
    }
    
    console.log('🎉 All 3 images generated!');
    console.log('📁 Right-click each to save to public/generated-images/');
    console.log('\nBrowser remains open. Press Ctrl+C when done.');
    
    // Keep alive
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Could not connect:', error.message);
    console.log('\nMake sure Chrome is running with:');
    console.log('open -a "Google Chrome" --args --remote-debugging-port=9222');
  }
}

generateWithChromeDebug().catch(console.error);