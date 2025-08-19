#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const IMAGE_PROMPTS = [
  {
    name: 'retro-features',
    prompt: 'Create a visual aesthetic image: Retro vintage icons in purple magenta, nostalgic design elements, 80s aesthetic vibes. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'playful-features',
    prompt: 'Create a visual aesthetic image: Fun playful icons in bright colors, energetic design elements, vibrant playful composition with bright rainbow colors. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'nature-cta',
    prompt: 'Create a visual aesthetic image: Fresh natural green gradient background, eco-friendly sustainable design aesthetic atmosphere, vibrant green organic environment. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'corporate-features',
    prompt: 'Create a visual aesthetic image: Corporate blue business icons, professional elements, modern business design, trustworthy business aesthetic. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'bold-cta',
    prompt: 'Create a visual aesthetic image: Stark dramatic gradient background in high contrast design, dramatic high-contrast composition with bold aesthetic. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'luxury-hero',
    prompt: 'Create a visual aesthetic image: Premium luxury composition with gold accents, exclusive high-end aesthetic, rich sophisticated environment, expensive materials visual language. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
  {
    name: 'corporate-cta',
    prompt: 'Create a visual aesthetic image: Corporate blue gradient background, professional business aesthetic, modern corporate environment, trustworthy design. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
  },
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

async function generateImages() {
  console.log('🎨 Interactive Image Generation for Missing Files');
  console.log('==============================================\n');
  
  let browser;
  let page;
  
  try {
    // Try connecting to existing Chrome session first
    console.log('📡 Trying to connect to existing Chrome session...');
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const context = browser.contexts()[0];
    const pages = context.pages();
    page = pages.find(p => p.url().includes('chatgpt.com')) || pages[0];
    console.log('✅ Connected to existing browser session\n');
  } catch (error) {
    console.log('⚠️ Could not connect to existing session, launching new browser...\n');
    
    const cookies = JSON.parse(process.env.CHATGPT_COOKIES || '[]');
    browser = await chromium.launch({ 
      headless: false,
      args: ['--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
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
    
    page = await context.newPage();
  }
  
  // Navigate to ChatGPT if not already there
  if (!page.url().includes('chatgpt.com')) {
    await page.goto('https://chatgpt.com');
    await page.waitForTimeout(3000);
  }
  
  console.log('📍 Starting generation process...\n');
  console.log('ℹ️  After each image generates, you\'ll need to:');
  console.log('   1. Right-click the generated image');
  console.log('   2. Save it to public/generated-images/');
  console.log('   3. Press Enter to continue to the next image\n');
  
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const askToContinue = () => new Promise(resolve => {
    rl.question('Press Enter to continue to next image...', resolve);
  });
  
  for (const [index, imageData] of IMAGE_PROMPTS.entries()) {
    console.log(`\n🎨 [${index + 1}/${IMAGE_PROMPTS.length}] Generating ${imageData.name}...`);
    
    try {
      // Navigate to new chat for clean generation
      await page.goto('https://chatgpt.com');
      await page.waitForTimeout(2000);
      
      // Find and fill the composer
      const composer = page.locator('#prompt-textarea, [data-id="composer"], .ProseMirror').first();
      await composer.waitFor({ timeout: 5000 });
      await composer.click();
      
      // Clear any existing text
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      
      // Type the prompt
      await composer.fill(imageData.prompt);
      
      // Send the message
      try {
        const sendButton = page.locator('[data-testid="send-button"]');
        await sendButton.click();
      } catch {
        // Fallback to Enter key
        await page.keyboard.press('Enter');
      }
      
      console.log('  📤 Prompt sent, waiting for generation...');
      
      // Wait for image to appear
      const imageSelector = 'img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]';
      await page.waitForSelector(imageSelector, { timeout: 120000 });
      
      console.log('  ✅ Image generated!');
      console.log(`  💾 Save as: public/generated-images/${imageData.name}.png`);
      console.log('  📝 Right-click the image in the browser and save it now.');
      
      // Wait for user to save the image
      await askToContinue();
      
    } catch (error) {
      console.log(`  ❌ Failed to generate ${imageData.name}: ${error.message}`);
      console.log('  ⏭️  Skipping to next image...');
    }
  }
  
  console.log('\n🎉 Generation complete!');
  console.log('📁 Make sure all images are saved to public/generated-images/');
  
  rl.close();
  
  // Keep browser open for final checks
  console.log('\nBrowser will remain open. Press Ctrl+C to close when done.');
  await new Promise(() => {});
}

generateImages().catch(console.error);