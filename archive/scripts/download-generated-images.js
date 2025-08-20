#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function downloadGeneratedImages() {
  console.log('📥 Downloading Generated Images');
  console.log('================================\n');
  
  try {
    // Connect to existing browser
    console.log('📡 Connecting to existing browser...');
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222').catch(() => null);
    
    if (!browser) {
      console.log('Starting new browser to access ChatGPT...');
      const newBrowser = await chromium.launch({ headless: false });
      const page = await newBrowser.newPage();
      await page.goto('https://chatgpt.com');
      console.log('Please navigate to the generated images in ChatGPT');
      console.log('Press Ctrl+C when done');
      await new Promise(() => {});
      return;
    }
    
    const context = browser.contexts()[0];
    const pages = context.pages();
    
    console.log(`Found ${pages.length} page(s)\n`);
    
    // Create output directory if it doesn't exist
    const outputDir = './public/generated-images';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const imageMap = [
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
    
    let downloadCount = 0;
    
    // Go through each page/tab
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const url = page.url();
      
      if (url.includes('chatgpt.com')) {
        console.log(`📄 Checking page ${i + 1}...`);
        
        // Find all generated images on this page
        const images = await page.locator('img[alt*="Generated"], img[src*="oaiusercontent"]').all();
        
        for (let j = 0; j < images.length; j++) {
          try {
            const imgSrc = await images[j].getAttribute('src');
            
            if (imgSrc && imgSrc.includes('oaiusercontent')) {
              const imageName = imageMap[downloadCount] || `image-${downloadCount}`;
              const filepath = path.join(outputDir, `${imageName}.png`);
              
              console.log(`  📥 Downloading ${imageName}...`);
              
              // Download the image
              const response = await page.request.get(imgSrc);
              const buffer = await response.body();
              await fs.promises.writeFile(filepath, buffer);
              
              console.log(`  ✅ Saved: ${imageName}.png`);
              downloadCount++;
            }
          } catch (error) {
            console.log(`  ❌ Failed to download: ${error.message}`);
          }
        }
      }
    }
    
    console.log(`\n🎉 Downloaded ${downloadCount} images!`);
    console.log(`📁 Saved to: ${outputDir}/`);
    
    // List the downloaded files
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
    console.log('\n📋 Downloaded files:');
    files.forEach(file => console.log(`  - ${file}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

downloadGeneratedImages().catch(console.error);