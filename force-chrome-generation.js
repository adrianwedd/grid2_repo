import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

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

async function forceGenerate() {
  console.log('🚀 Force connecting to Chrome and generating images...\n');
  
  try {
    // Try to connect using the exact endpoint
    const wsEndpoint = 'ws://localhost:9222/devtools/browser/bc870860-28e5-43a7-83aa-020d52889eac';
    console.log(`🔌 Connecting to: ${wsEndpoint}`);
    
    const browser = await chromium.connectOverCDP({
      wsEndpoint: wsEndpoint,
      timeout: 10000
    });
    
    console.log('✅ Connected to Chrome!');
    
    // Get the default context
    const contexts = browser.contexts();
    const context = contexts[0];
    
    if (!context) {
      throw new Error('No browser context found');
    }
    
    // Get all pages
    const pages = context.pages();
    console.log(`Found ${pages.length} open pages`);
    
    // Find or create ChatGPT page
    let page = pages.find(p => p.url().includes('chatgpt.com'));
    
    if (!page) {
      console.log('📄 Opening new ChatGPT tab...');
      page = await context.newPage();
      await page.goto('https://chatgpt.com');
      await page.waitForTimeout(3000);
    } else {
      console.log('✅ Found existing ChatGPT tab');
      await page.bringToFront();
    }
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
    
    // Check if logged in
    const composerExists = await page.locator('[data-testid="composer-root"]').count() > 0;
    
    if (!composerExists) {
      console.log('❌ Not logged in to ChatGPT or page not ready');
      console.log('Please ensure you are logged in to ChatGPT');
      return;
    }
    
    console.log('✅ ChatGPT is ready');
    
    // Create output directory
    const outputDir = './public/generated-images/feature-icons';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate each image
    for (let i = 0; i < PROMPTS.length; i++) {
      const item = PROMPTS[i];
      console.log(`\n🎨 Generating ${i + 1}/3: ${item.name}...`);
      
      try {
        // Click new chat if available
        const newChatBtn = page.locator('button:has-text("New chat")').first();
        if (await newChatBtn.count() > 0) {
          await newChatBtn.click();
          await page.waitForTimeout(1000);
        }
        
        // Find composer and type prompt
        console.log('  📝 Typing prompt...');
        const composer = page.locator('[data-testid="composer-root"] .ProseMirror').first();
        await composer.click();
        await composer.clear();
        await composer.fill(item.prompt);
        
        // Send message
        console.log('  📤 Sending to ChatGPT...');
        const sendBtn = page.locator('[data-testid="send-button"]').first();
        await sendBtn.click();
        
        // Wait for image generation
        console.log('  ⏳ Waiting for DALL-E image generation...');
        
        // Wait for the specific DALL-E image
        const imageLocator = page.locator('img[src*="oaidalleapiprodscus.blob.core.windows.net"]');
        await imageLocator.waitFor({ state: 'visible', timeout: 90000 });
        
        console.log('  ✅ Image generated!');
        
        // Get the image URL
        const imageUrl = await imageLocator.first().getAttribute('src');
        
        if (imageUrl) {
          console.log('  💾 Downloading image...');
          
          // Use page.request to download the image
          const response = await page.request.get(imageUrl);
          const buffer = await response.body();
          
          const filename = `${item.name}.png`;
          const filepath = path.join(outputDir, filename);
          
          fs.writeFileSync(filepath, buffer);
          console.log(`  ✅ Saved as ${filename}`);
        }
        
        // Wait before next generation
        if (i < PROMPTS.length - 1) {
          console.log('  ⏳ Waiting 5 seconds before next generation...');
          await page.waitForTimeout(5000);
        }
        
      } catch (error) {
        console.error(`  ❌ Failed to generate ${item.name}:`, error.message);
      }
    }
    
    console.log('\n✨ Image generation complete!');
    console.log(`📁 Images saved to: ${outputDir}`);
    
    // Don't close the browser - keep the session alive
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    // Try alternative approach - launch new browser
    console.log('\n🔄 Trying alternative approach...');
    
    const browser = await chromium.launch({
      headless: false,
      channel: 'chrome'
    });
    
    const page = await browser.newPage();
    await page.goto('https://chatgpt.com');
    
    console.log('⏳ Please log in to ChatGPT manually...');
    console.log('Waiting 60 seconds for login...');
    
    try {
      await page.waitForSelector('[data-testid="composer-root"]', { timeout: 60000 });
      console.log('✅ Login detected, proceeding with generation...');
      
      // Same generation logic here...
      // (Implementation would continue here)
      
    } catch {
      console.log('❌ Login timeout. Please run the script again after logging in.');
    }
    
    await browser.close();
  }
}

forceGenerate().catch(console.error);