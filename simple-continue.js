#!/usr/bin/env node

import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const LAST_THREE = [
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

async function continueGeneration() {
  console.log('🎨 Continuing Image Generation (Last 3 Images)');
  console.log('==============================================\n');
  
  const cookies = JSON.parse(process.env.CHATGPT_COOKIES || '[]');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  // Add cookies
  for (const cookie of cookies) {
    await context.addCookies([{
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path || '/',
      secure: cookie.secure || false,
      httpOnly: cookie.httpOnly || false,
      sameSite: cookie.sameSite === 'no_restriction' ? 'None' : 
                cookie.sameSite === 'lax' ? 'Lax' : 
                cookie.sameSite === 'strict' ? 'Strict' : 'Lax'
    }]);
  }
  
  const page = await context.newPage();
  
  console.log('📍 Going to ChatGPT...');
  await page.goto('https://chatgpt.com');
  await page.waitForTimeout(5000);
  
  console.log('✅ ChatGPT loaded\n');
  
  for (const [index, imageData] of LAST_THREE.entries()) {
    console.log(`🎨 [${index + 1}/3] ${imageData.name}`);
    
    try {
      // New chat
      await page.goto('https://chatgpt.com');
      await page.waitForTimeout(3000);
      
      // Find input
      const composer = page.locator('#prompt-textarea, [data-id="composer"], .ProseMirror').first();
      await composer.waitFor({ timeout: 10000 });
      
      // Type prompt
      await composer.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await composer.fill(imageData.prompt);
      
      // Send
      try {
        await page.locator('[data-testid="send-button"]').click();
      } catch {
        await page.keyboard.press('Enter');
      }
      
      console.log('  📤 Sent, waiting...');
      
      // Wait for image
      await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]', {
        timeout: 120000
      });
      
      console.log(`  ✅ Generated!\n`);
      
      // Wait between images
      await page.waitForTimeout(5000);
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('🎉 Done! Save the images from the browser.');
  console.log('Browser stays open. Press Ctrl+C to exit.');
  
  await new Promise(() => {});
}

continueGeneration().catch(console.error);