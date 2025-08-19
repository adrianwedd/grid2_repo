#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function autoDownloadAll() {
  console.log('📥 Auto-downloading All Generated Images');
  console.log('=========================================\n');
  
  // Connect to the browser that has the images
  const browser = await chromium.launch({ headless: false });
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  
  // Go back through ChatGPT history to find all generated images
  await page.goto('https://chatgpt.com');
  await page.waitForTimeout(2000);
  
  const outputDir = './public/generated-images';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Image names in order of generation
  const imageNames = [
    'retro-features',
    'playful-features', 
    'nature-cta',
    'corporate-features',
    'bold-cta',
    'luxury-hero',
    'corporate-cta',
    'corporate-hero',
    'creative-cta',
    'playful-hero'
  ];
  
  console.log('📋 Looking for generated images in chat history...\n');
  
  // Find all image elements
  const images = await page.locator('img[alt*="Generated"], img[src*="oaiusercontent"]').all();
  
  console.log(`Found ${images.length} generated image(s)\n`);
  
  for (let i = 0; i < Math.min(images.length, imageNames.length); i++) {
    try {
      const imgSrc = await images[i].getAttribute('src');
      
      if (imgSrc && imgSrc.includes('oaiusercontent')) {
        const imageName = imageNames[i];
        const filepath = path.join(outputDir, `${imageName}.png`);
        
        console.log(`📥 Downloading ${imageName}...`);
        
        // Download using Playwright's request API
        const response = await page.request.get(imgSrc);
        const buffer = await response.body();
        await fs.promises.writeFile(filepath, buffer);
        
        console.log(`✅ Saved: ${imageName}.png`);
      }
    } catch (error) {
      console.log(`❌ Failed to download image ${i + 1}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Download complete!');
  console.log(`📁 Images saved to: ${outputDir}/`);
  
  // List all PNG files in the directory
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
  console.log(`\n📋 Total images in folder: ${files.length}`);
  files.forEach(file => console.log(`  - ${file}`));
  
  await browser.close();
}

autoDownloadAll().catch(console.error);