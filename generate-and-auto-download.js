#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Check which images are actually missing (only have placeholders)
function getMissingImages() {
  const outputDir = '/Users/adrian/repos/grid2_repo/public/generated-images';
  const files = fs.readdirSync(outputDir);
  
  const missing = [];
  const required = [
    { name: 'creative-hero', type: 'hero' },
    { name: 'luxury-cta', type: 'cta' },
    { name: 'modern-features', type: 'features' },
    { name: 'playful-cta', type: 'cta' }
  ];
  
  for (const item of required) {
    // Check if PNG exists (either plain or with ai-patient prefix)
    const hasImage = files.some(f => 
      f.startsWith(item.name) && f.endsWith('.png')
    );
    
    if (!hasImage) {
      missing.push(item);
    }
  }
  
  return missing;
}

const PROMPTS = {
  'creative-hero': 'Create a visual aesthetic image: Artistic creative composition with paint splashes, creative expression aesthetic, vibrant artistic environment with paint effects and creative energy. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.',
  
  'luxury-cta': 'Create a visual aesthetic image: Premium luxury gradient background with gold accents, exclusive aesthetic, sophisticated golden shimmer and expensive materials visual language. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.',
  
  'modern-features': 'Create a visual aesthetic image: Futuristic tech icons with cyan colors, modern geometric shapes, electric cyan digital elements, tech-forward aesthetic with holographic effects. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.',
  
  'playful-cta': 'Create a visual aesthetic image: Vibrant colorful gradient background, playful energetic aesthetic, bright rainbow colors with fun dynamic energy. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography in the image.'
};

async function generateAndDownload() {
  console.log('🎨 Generate & Auto-Download Missing Images');
  console.log('==========================================\n');
  
  // Check what's actually missing
  const missingImages = getMissingImages();
  
  if (missingImages.length === 0) {
    console.log('✅ All images already exist!');
    return;
  }
  
  console.log(`📋 Found ${missingImages.length} missing images:`);
  missingImages.forEach(img => console.log(`  - ${img.name}`));
  console.log('');
  
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
  
  console.log('📍 Navigating to ChatGPT...');
  await page.goto('https://chatgpt.com');
  await page.waitForTimeout(5000);
  
  console.log('✅ ChatGPT loaded\n');
  
  const outputDir = '/Users/adrian/repos/grid2_repo/public/generated-images';
  let successCount = 0;
  
  for (const [index, imageData] of missingImages.entries()) {
    console.log(`🎨 [${index + 1}/${missingImages.length}] Generating ${imageData.name}...`);
    
    try {
      // Navigate to new chat
      await page.goto('https://chatgpt.com');
      await page.waitForTimeout(3000);
      
      // Find composer
      const composer = page.locator('#prompt-textarea, [data-id="composer"], .ProseMirror').first();
      await composer.waitFor({ timeout: 10000 });
      
      // Clear and type prompt
      await composer.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      
      const prompt = PROMPTS[imageData.name];
      await composer.fill(prompt);
      
      // Send message
      try {
        await page.locator('[data-testid="send-button"]').click();
      } catch {
        await page.keyboard.press('Enter');
      }
      
      console.log('  📤 Prompt sent, waiting for generation...');
      
      // Wait for image to generate
      await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]', {
        timeout: 120000
      });
      
      console.log('  ✅ Image generated!');
      
      // Download the image immediately
      await page.waitForTimeout(2000); // Let image fully load
      
      const imageElement = page.locator('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]').first();
      const imageSrc = await imageElement.getAttribute('src');
      
      if (imageSrc) {
        const timestamp = Date.now();
        const filename = `${imageData.name}-ai-generated-${timestamp}.png`;
        const filepath = path.join(outputDir, filename);
        
        console.log('  📥 Downloading image...');
        
        try {
          // Download using Playwright's request API
          const response = await page.request.get(imageSrc);
          const buffer = await response.body();
          await fs.promises.writeFile(filepath, buffer);
          
          console.log(`  💾 Saved: ${filename}`);
          successCount++;
        } catch (downloadError) {
          console.log(`  ⚠️ Download failed: ${downloadError.message}`);
          console.log(`  📋 Image URL: ${imageSrc}`);
        }
      }
      
      console.log('');
      
      // Pause between generations
      await page.waitForTimeout(5000);
      
    } catch (error) {
      console.log(`  ❌ Generation failed: ${error.message}\n`);
    }
  }
  
  console.log('🎉 Generation Complete!');
  console.log(`✅ Successfully generated and downloaded: ${successCount}/${missingImages.length} images`);
  
  // List all images in the directory
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
  console.log(`\n📁 Total PNG images in folder: ${files.length}`);
  
  // Check if any are still missing
  const stillMissing = getMissingImages();
  if (stillMissing.length > 0) {
    console.log('\n⚠️ Still missing:');
    stillMissing.forEach(img => console.log(`  - ${img.name}`));
  } else {
    console.log('\n✅ All required images are now present!');
  }
  
  console.log('\nBrowser remains open. Press Ctrl+C to close.');
  await new Promise(() => {});
}

generateAndDownload().catch(console.error);