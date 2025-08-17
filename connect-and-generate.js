import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROMPTS = [
  {
    name: 'clean-interface',
    prompt: 'Create a minimalist icon for Clean Interface feature. Simple geometric shapes on white background, soft blue accent (#3b82f6), professional tech design showing abstract UI elements, clean lines, subtle shadows. Square format 1024x1024, high quality render.'
  },
  {
    name: 'fast-performance', 
    prompt: 'Create a minimalist icon for Fast Performance feature. Abstract lightning or speed lines on white background, soft green accent (#10b981), professional tech design showing motion and efficiency, clean geometric style. Square format 1024x1024, high quality render.'
  },
  {
    name: 'simple-workflow',
    prompt: 'Create a minimalist icon for Simple Workflow feature. Connected nodes or flow diagram on white background, soft purple accent (#8b5cf6), professional tech design showing streamlined process, clean geometric connections. Square format 1024x1024, high quality render.'
  }
];

async function connectAndGenerate() {
  console.log('🔌 Connecting to existing Chrome on port 9222...\n');
  
  try {
    // Connect to existing Chrome instance
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });
    
    console.log('✅ Connected to Chrome');
    
    // Get all pages
    const pages = await browser.pages();
    
    // Find ChatGPT page or create new one
    let page = pages.find(p => p.url().includes('chatgpt.com'));
    
    if (!page) {
      console.log('📄 Opening ChatGPT in new tab...');
      page = await browser.newPage();
      await page.goto('https://chatgpt.com', { waitUntil: 'networkidle2' });
    } else {
      console.log('✅ Found existing ChatGPT tab');
      await page.bringToFront();
    }
    
    // Wait a bit for page to stabilize
    await page.waitForTimeout(2000);
    
    // Check if logged in
    const isLoggedIn = await page.$('[data-testid="composer-root"]') !== null;
    
    if (!isLoggedIn) {
      console.log('❌ Not logged in to ChatGPT');
      console.log('Please log in manually and run the script again.');
      return;
    }
    
    console.log('✅ Logged in to ChatGPT');
    
    const outputDir = path.join(__dirname, 'public', 'generated-images', 'feature-icons');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    for (const item of PROMPTS) {
      console.log(`\n🎨 Generating ${item.name}...`);
      
      try {
        // Try to click new chat button
        const newChatBtn = await page.$('button[aria-label="New chat"]');
        if (newChatBtn) {
          await newChatBtn.click();
          await page.waitForTimeout(1000);
        }
        
        // Find and click the composer
        console.log('  📝 Typing prompt...');
        const composer = await page.waitForSelector('[data-testid="composer-root"] .ProseMirror', { timeout: 5000 });
        await composer.click();
        
        // Clear any existing text and type new prompt
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.type(item.prompt);
        
        // Send the message
        console.log('  📤 Sending to ChatGPT...');
        await page.keyboard.press('Enter');
        
        // Wait for image
        console.log('  ⏳ Waiting for image (30-60 seconds)...');
        
        const imageSelector = 'img[src*="oaidalleapiprodscus.blob.core.windows.net"]';
        await page.waitForSelector(imageSelector, { timeout: 60000 });
        
        // Get all images (in case there are multiple)
        const images = await page.$$eval(imageSelector, imgs => imgs.map(img => img.src));
        
        if (images.length > 0) {
          // Get the last (newest) image
          const imageUrl = images[images.length - 1];
          console.log('  ✅ Image generated!');
          
          // Download the image
          console.log('  💾 Downloading image...');
          const imageResponse = await page.evaluate(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const buffer = await blob.arrayBuffer();
            return Array.from(new Uint8Array(buffer));
          }, imageUrl);
          
          const buffer = Buffer.from(imageResponse);
          const filename = `${item.name}.png`;
          const filepath = path.join(outputDir, filename);
          
          fs.writeFileSync(filepath, buffer);
          console.log(`  ✅ Saved as ${filename}`);
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to generate ${item.name}:`, error.message);
      }
      
      // Wait before next
      if (PROMPTS.indexOf(item) < PROMPTS.length - 1) {
        console.log('  ⏳ Waiting 5 seconds...');
        await page.waitForTimeout(5000);
      }
    }
    
    console.log('\n✨ Generation complete!');
    console.log(`📁 Images saved to: ${outputDir}`);
    
    // Don't close the browser (keep session alive)
    console.log('\n🔌 Keeping Chrome session alive');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure Chrome is running with:');
    console.log('./start-chrome-debug.sh');
  }
}

connectAndGenerate().catch(console.error);