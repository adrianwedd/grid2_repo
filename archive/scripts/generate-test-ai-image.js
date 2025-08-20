// Quick test to generate one AI image using existing ChatGPT session
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function generateTestImage() {
  console.log('🤖 Testing AI image generation with existing Chrome session');
  
  let browser = null;
  let page = null;
  
  try {
    console.log('🚀 Connecting to existing Chrome session...');
    
    // Connect to existing Chrome instance on debugging port
    browser = await chromium.connectOverCDP('http://localhost:9222');
    const context = browser.contexts()[0]; // Use existing context
    const pages = context.pages();
    
    // Find ChatGPT tab or use first available page
    let chatGPTPage = pages.find(p => p.url().includes('chatgpt.com'));
    
    if (!chatGPTPage) {
      console.log('🔄 Using first available page...');
      chatGPTPage = pages[0]; // Use any available page
      console.log('📍 Current page URL:', await chatGPTPage.url());
      await chatGPTPage.goto('https://chatgpt.com');
      await chatGPTPage.waitForTimeout(5000);
    }
    
    page = chatGPTPage;
    console.log('✅ Connected to ChatGPT session');
    
    // Debug: Get page title and URL
    console.log('📍 Page title:', await page.title());
    console.log('📍 Page URL:', await page.url());
    
    // Test with a simple prompt for minimal style - avoiding "website" 
    const testPrompt = "Ultra-clean minimal aesthetic design, pure white background with subtle gray geometric shapes, maximum safety corporate visual language, government-approved visual blandness, professional liability-free design pattern";
    
    console.log('🎨 Generating test image...');
    
    // Wait a bit for page to be fully ready
    await page.waitForTimeout(3000);
    
    // Wait for ChatGPT to load and find the input area
    await page.waitForLoadState('domcontentloaded');
    
    // Try different selectors for the composer
    let composer = null;
    const selectors = [
      '[data-testid="composer-root"] .ProseMirror',
      'textarea[data-id="root"]',
      '#prompt-textarea',
      '[data-testid="composer-text-area"]',
      'div[contenteditable="true"]'
    ];
    
    for (const selector of selectors) {
      try {
        composer = page.locator(selector);
        await composer.waitFor({ timeout: 5000 });
        console.log(`✅ Found composer with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`❌ Selector failed: ${selector}`);
        continue;
      }
    }
    
    if (!composer) {
      throw new Error('Could not find ChatGPT composer input');
    }
    
    // Type the image generation prompt
    await composer.click();
    await composer.fill(`Generate an image: ${testPrompt}\n\nStyle: vivid\nSize: 1792x1024`);
    
    // Send the message - try different send button selectors
    const sendSelectors = [
      '[data-testid="send-button"]',
      'button[aria-label="Send message"]',
      'button[type="submit"]'
    ];
    
    let sendButton = null;
    for (const selector of sendSelectors) {
      try {
        sendButton = page.locator(selector);
        await sendButton.waitFor({ timeout: 2000 });
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (sendButton) {
      await sendButton.click();
    } else {
      // Fallback to Enter key
      await composer.press('Enter');
    }
    
    // Wait for image generation
    console.log('⏳ Waiting for image generation...');
    
    // Try multiple selectors for the generated image
    const imageSelectors = [
      'img[alt="Generated image"]',
      'img[src*="oaidalleapiprodscus"]',
      'img[src*="sdmntprwestus2"]',
      'img[src*="oaiusercontent.com"]',
      'div[data-testid*="image"] img',
      'img[class*="generated"]'
    ];
    
    let imageLocator = null;
    for (const selector of imageSelectors) {
      try {
        imageLocator = page.locator(selector).first();
        await imageLocator.waitFor({ timeout: 15000 });
        console.log(`✅ Found image with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`❌ Image selector failed: ${selector}`);
        continue;
      }
    }
    
    if (!imageLocator) {
      // Fallback - wait longer and try again
      console.log('⏳ No image found yet, waiting longer...');
      await page.waitForTimeout(30000);
      
      for (const selector of imageSelectors) {
        try {
          imageLocator = page.locator(selector).first();
          await imageLocator.waitFor({ timeout: 5000 });
          console.log(`✅ Found image with selector (retry): ${selector}`);
          break;
        } catch (e) {
          continue;
        }
      }
    }
    
    if (!imageLocator) {
      throw new Error('Could not find generated image after waiting');
    }
    
    // Get the image URL
    const imageUrl = await imageLocator.getAttribute('src');
    
    if (!imageUrl) {
      throw new Error('Failed to get image URL');
    }
    
    console.log('✅ Image generated:', imageUrl);
    
    // Download and save the image
    const filename = `minimal-hero-ai-test-${Date.now()}.png`;
    const filepath = path.join('./public/generated-images', filename);
    
    console.log('💾 Downloading image...');
    const response = await page.context().request.get(imageUrl);
    const buffer = await response.body();
    await fs.promises.writeFile(filepath, buffer);
    
    console.log('🎉 Test completed successfully!');
    console.log(`📁 Image saved to: ${filepath}`);
    
    return {
      success: true,
      filepath,
      url: imageUrl,
      prompt: testPrompt
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      browser.close();
    }
  }
}

// Run the test
generateTestImage().then(result => {
  if (result.success) {
    console.log('✅ AI image generation test successful!');
  } else {
    console.log('❌ AI image generation test failed:', result.error);
  }
  process.exit(0);
}).catch(error => {
  console.error('❌ Script error:', error);
  process.exit(1);
});