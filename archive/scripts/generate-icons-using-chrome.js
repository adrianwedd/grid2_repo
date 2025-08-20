// Connect to existing Chrome session and generate images
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Specific prompts for the three minimal feature icons
const FEATURE_ICON_PROMPTS = {
  'clean-interface': {
    prompt: 'Modern minimalist icon for "Clean Interface" feature, simple line art, subtle gradient, light background, professional tech design, abstract representation of a clean user interface with geometric shapes, soft blue accent color, high quality vector style',
    description: 'Clean interface icon'
  },
  'fast-performance': {
    prompt: 'Modern minimalist icon for "Fast Performance" feature, simple line art showing speed or lightning bolt concept, subtle gradient, light background, professional tech design, abstract representation of speed and efficiency, soft green accent color, high quality vector style',
    description: 'Fast performance icon'
  },
  'simple-workflow': {
    prompt: 'Modern minimalist icon for "Simple Workflow" feature, simple line art showing connected nodes or flow diagram, subtle gradient, light background, professional tech design, abstract representation of streamlined process, soft purple accent color, high quality vector style',
    description: 'Simple workflow icon'
  }
};

async function connectToExistingChrome() {
  console.log('🎨 Connecting to Existing Chrome Session');
  console.log('=====================================\n');
  
  try {
    // Connect to Chrome DevTools Protocol
    console.log('📡 Connecting to Chrome on port 9222...');
    const browser = await chromium.connectOverCDP('http://localhost:9222', {
      timeout: 60000
    });
    
    console.log('✅ Connected to Chrome!');
    
    // Get the default context
    const context = browser.contexts()[0];
    if (!context) {
      throw new Error('No browser context found. Make sure Chrome is running with --remote-debugging-port=9222');
    }
    
    // Get existing pages or create new one
    const pages = context.pages();
    let page = pages.find(p => p.url().includes('chatgpt.com')) || pages[0];
    
    if (!page || !page.url().includes('chatgpt.com')) {
      console.log('📄 Opening ChatGPT in new tab...');
      page = await context.newPage();
      await page.goto('https://chatgpt.com');
      await page.waitForTimeout(3000);
    } else {
      console.log('✅ Found existing ChatGPT tab');
    }
    
    // Check if logged in
    const isLoggedIn = await page.locator('[data-testid="composer-root"]').count() > 0;
    
    if (!isLoggedIn) {
      console.log('⚠️  Not logged in to ChatGPT');
      console.log('Please log in manually in the Chrome window, then run this script again.');
      return;
    }
    
    console.log('✅ Logged in to ChatGPT');
    
    // Create output directory
    const outputDir = './public/generated-images/feature-icons';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const results = {};
    
    // Generate each feature icon
    for (const [featureName, config] of Object.entries(FEATURE_ICON_PROMPTS)) {
      try {
        console.log(`\n📸 Generating ${featureName} icon...`);
        
        // Click new chat button if available
        const newChatBtn = page.locator('button[aria-label="New chat"]').first();
        if (await newChatBtn.count() > 0) {
          await newChatBtn.click();
          await page.waitForTimeout(1000);
        }
        
        // Type the prompt
        const composer = page.locator('[data-testid="composer-root"] .ProseMirror').first();
        await composer.click();
        await composer.fill(config.prompt);
        
        console.log('   Sending prompt to ChatGPT...');
        await page.locator('[data-testid="send-button"]').click();
        
        console.log('   Waiting for image generation (this may take 10-30 seconds)...');
        
        // Wait for the image to appear
        try {
          await page.waitForSelector('img[src*="oaidalleapiprodscus.blob.core.windows.net"]', { 
            timeout: 60000 
          });
          
          console.log('   ✅ Image generated!');
          
          // Get the image URL
          const imageUrl = await page.locator('img[src*="oaidalleapiprodscus.blob.core.windows.net"]').first().getAttribute('src');
          
          if (imageUrl) {
            // Download the image
            console.log('   💾 Downloading image...');
            const response = await page.context().request.get(imageUrl);
            const buffer = await response.body();
            
            const filename = `chatgpt-${featureName}-${Date.now()}.png`;
            const filepath = path.join(outputDir, filename);
            
            fs.writeFileSync(filepath, buffer);
            console.log(`   ✅ Saved as ${filename}`);
            
            results[featureName] = {
              filename,
              filepath,
              url: imageUrl,
              prompt: config.prompt,
              description: config.description,
              timestamp: new Date().toISOString()
            };
          }
          
        } catch (error) {
          console.error(`   ❌ Failed to generate ${featureName}:`, error.message);
          results[featureName] = { error: error.message };
        }
        
        // Small delay between generations
        console.log('   ⏳ Waiting before next generation...');
        await page.waitForTimeout(5000);
        
      } catch (error) {
        console.error(`❌ Failed to generate ${featureName}:`, error.message);
        results[featureName] = { error: error.message };
      }
    }
    
    // Save manifest
    const manifestPath = path.join(outputDir, 'chatgpt-icons-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Manifest saved to ${manifestPath}`);
    
    // Display summary
    console.log('\n📊 GENERATION SUMMARY');
    console.log('====================');
    for (const [feature, result] of Object.entries(results)) {
      if (result.error) {
        console.log(`❌ ${feature}: Failed - ${result.error}`);
      } else {
        console.log(`✅ ${feature}: ${result.filename}`);
      }
    }
    
    console.log('\n✨ Done! Chrome session remains open.');
    
  } catch (error) {
    console.error('❌ Failed to connect to Chrome:', error);
    console.log('\n📝 To use your existing Chrome session:');
    console.log('1. Run: ./start-chrome-debug.sh');
    console.log('2. Log in to ChatGPT in the Chrome window');
    console.log('3. Run this script again');
  }
}

// Run the generation
connectToExistingChrome().catch(console.error);