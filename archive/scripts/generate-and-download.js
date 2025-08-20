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

async function generateAndDownload() {
  console.log('🎨 Auto-Download Image Generation');
  console.log('==================================\n');
  
  let browser;
  let page;
  
  try {
    // Try connecting to existing Chrome session
    console.log('📡 Connecting to existing browser...');
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const context = browser.contexts()[0];
    const pages = context.pages();
    page = pages.find(p => p.url().includes('chatgpt.com')) || pages[0];
    console.log('✅ Connected!\n');
  } catch {
    console.log('Starting new browser...\n');
    const cookies = JSON.parse(process.env.CHATGPT_COOKIES || '[]');
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    
    for (const cookie of cookies) {
      await context.addCookies([{
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path || '/',
        secure: cookie.secure || false,
        httpOnly: cookie.httpOnly || false,
        sameSite: cookie.sameSite === 'no_restriction' ? 'None' : 
                  cookie.sameSite === 'lax' ? 'Lax' : 'Strict'
      }]);
    }
    
    page = await context.newPage();
    await page.goto('https://chatgpt.com');
  }
  
  // Start from where we left off (image 6 - luxury-hero is currently generating)
  const startIndex = 5; // Start from index 5 (luxury-hero) since it's already generating
  
  // Wait for current luxury-hero to finish
  console.log('⏳ Waiting for current luxury-hero image to complete...');
  try {
    await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]', { 
      timeout: 60000 
    });
    
    // Download luxury-hero
    const luxuryImage = await page.locator('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]').first();
    const luxuryUrl = await luxuryImage.getAttribute('src');
    
    if (luxuryUrl) {
      const response = await page.request.get(luxuryUrl);
      const buffer = await response.body();
      const filepath = path.join('./public/generated-images', 'luxury-hero.png');
      await fs.promises.writeFile(filepath, buffer);
      console.log('✅ Downloaded: luxury-hero.png\n');
    }
  } catch (e) {
    console.log('⚠️ Could not download luxury-hero, continuing...\n');
  }
  
  // Continue with remaining images
  for (let i = startIndex + 1; i < IMAGE_PROMPTS.length; i++) {
    const imageData = IMAGE_PROMPTS[i];
    console.log(`🎨 [${i + 1}/${IMAGE_PROMPTS.length}] Generating ${imageData.name}...`);
    
    try {
      // New chat for each image
      await page.goto('https://chatgpt.com');
      await page.waitForTimeout(2000);
      
      // Send prompt
      const composer = page.locator('#prompt-textarea, [data-id="composer"], .ProseMirror').first();
      await composer.waitFor({ timeout: 5000 });
      await composer.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await composer.fill(imageData.prompt);
      
      try {
        await page.locator('[data-testid="send-button"]').click();
      } catch {
        await page.keyboard.press('Enter');
      }
      
      console.log('  📤 Sent, waiting for generation...');
      
      // Wait for image
      await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]', {
        timeout: 120000
      });
      
      // Download the image
      const imageElement = await page.locator('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]').first();
      const imageUrl = await imageElement.getAttribute('src');
      
      if (imageUrl) {
        const response = await page.request.get(imageUrl);
        const buffer = await response.body();
        const filepath = path.join('./public/generated-images', `${imageData.name}.png`);
        await fs.promises.writeFile(filepath, buffer);
        console.log(`  ✅ Downloaded: ${imageData.name}.png\n`);
      }
      
      // Brief pause between generations
      await page.waitForTimeout(3000);
      
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}\n`);
    }
  }
  
  console.log('🎉 All images generated and downloaded!');
  console.log('📁 Check public/generated-images/ folder');
  
  // Keep browser open for verification
  console.log('\nBrowser remains open. Press Ctrl+C to close.');
  await new Promise(() => {});
}

generateAndDownload().catch(console.error);