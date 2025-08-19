#!/usr/bin/env node

import { chromium } from 'playwright';
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
  console.log('🎨 Automated Image Generation for Missing Files');
  console.log('==============================================\n');
  
  // Use the existing browser session
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222').catch(() => null);
  
  if (!browser) {
    console.log('❌ Could not connect to Chrome debug port');
    console.log('Starting new browser instance...\n');
    
    const cookies = JSON.parse(process.env.CHATGPT_COOKIES || '[]');
    const newBrowser = await chromium.launch({ headless: false });
    const context = await newBrowser.newContext();
    
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
    await page.goto('https://chatgpt.com');
    return { page, browser: newBrowser };
  }
  
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages.find(p => p.url().includes('chatgpt.com')) || pages[0];
  
  return { page, browser };
}

async function sendPrompt(page, prompt) {
  try {
    // Find the composer/textarea
    const composer = page.locator('textarea[data-id="composer"], #prompt-textarea, .ProseMirror');
    await composer.waitFor({ timeout: 5000 });
    
    // Click to focus
    await composer.click();
    
    // Clear and type
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await composer.fill(prompt);
    
    // Send the message
    await page.keyboard.press('Enter');
    
    console.log('  📤 Prompt sent, waiting for generation...');
    
    // Wait for image to appear
    await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]', { 
      timeout: 120000 
    });
    
    console.log('  ✅ Image generated!');
    return true;
    
  } catch (error) {
    console.log('  ❌ Failed:', error.message);
    return false;
  }
}

async function main() {
  const { page, browser } = await generateImages();
  
  console.log('📍 Starting generation process...\n');
  
  for (const [index, imageData] of IMAGE_PROMPTS.entries()) {
    console.log(`🎨 [${index + 1}/${IMAGE_PROMPTS.length}] Generating ${imageData.name}...`);
    
    // Navigate to new chat for each image
    await page.goto('https://chatgpt.com');
    await page.waitForTimeout(2000);
    
    const success = await sendPrompt(page, imageData.prompt);
    
    if (success) {
      console.log(`  💾 Save as: public/generated-images/${imageData.name}.png\n`);
    } else {
      console.log(`  ⚠️ Skipped ${imageData.name}\n`);
    }
    
    // Wait between generations
    await page.waitForTimeout(3000);
  }
  
  console.log('\n🎉 Generation complete!');
  console.log('📁 Right-click each image to save to public/generated-images/');
  console.log('Press Ctrl+C to close when done saving images.');
  
  // Keep browser open
  await new Promise(() => {});
}

main().catch(console.error);