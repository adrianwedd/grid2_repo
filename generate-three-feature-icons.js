// Generate three specific feature icons using the working ChatGPT approach
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { ChatGPTImageGenerator } from './lib/chatgpt-image-generator.ts';
import fs from 'fs';
import path from 'path';

// Load session config
const CHATGPT_SESSION = {
  sessionToken: process.env.CHATGPT_SESSION_TOKEN || '',
  cookies: process.env.CHATGPT_COOKIES ? JSON.parse(process.env.CHATGPT_COOKIES) : []
};

// Three specific feature icon prompts
const THREE_FEATURE_ICONS = {
  'clean-interface': {
    prompt: 'Create a minimalist icon for Clean Interface feature. Simple geometric shapes on white background, soft blue accent (#3b82f6), professional tech design showing abstract UI elements, clean lines, subtle shadows. Square format 1024x1024, high quality render.',
    description: 'Clean interface feature icon'
  },
  'fast-performance': {
    prompt: 'Create a minimalist icon for Fast Performance feature. Abstract lightning or speed lines on white background, soft green accent (#10b981), professional tech design showing motion and efficiency, clean geometric style. Square format 1024x1024, high quality render.',
    description: 'Fast performance feature icon'
  },
  'simple-workflow': {
    prompt: 'Create a minimalist icon for Simple Workflow feature. Connected nodes or flow diagram on white background, soft purple accent (#8b5cf6), professional tech design showing streamlined process, clean geometric connections. Square format 1024x1024, high quality render.',
    description: 'Simple workflow feature icon'
  }
};

async function generateThreeFeatureIcons() {
  console.log('🎯 Generating Three Specific Feature Icons');
  console.log('==========================================');
  
  // Check credentials
  if (!CHATGPT_SESSION.sessionToken && (!CHATGPT_SESSION.cookies || CHATGPT_SESSION.cookies.length === 0)) {
    console.error('❌ No ChatGPT credentials found!');
    console.log('Please configure CHATGPT_SESSION_TOKEN or CHATGPT_COOKIES in .env.local');
    return;
  }
  
  console.log('✅ Credentials loaded');
  console.log(`📋 Session token: ${CHATGPT_SESSION.sessionToken ? CHATGPT_SESSION.sessionToken.substring(0, 50) + '...' : 'Not set'}`);
  console.log(`📋 Cookies: ${CHATGPT_SESSION.cookies.length} cookies loaded`);
  
  // Create output directory
  const outputDir = './public/generated-images/feature-icons';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const generator = new ChatGPTImageGenerator();
  const results = {};
  
  try {
    console.log('\n🚀 Initializing ChatGPT browser...');
    console.log('⏳ This will open a browser window. Please log in to ChatGPT if needed.');
    await generator.initialize(CHATGPT_SESSION.cookies);
    
    console.log('✅ Browser initialized. Starting generation...\n');
    
    // Generate each feature icon
    for (const [iconName, config] of Object.entries(THREE_FEATURE_ICONS)) {
      try {
        console.log(`📸 Generating ${iconName} icon...`);
        console.log(`   Prompt: "${config.prompt.substring(0, 80)}..."`);
        
        const image = await generator.generateImage({
          prompt: config.prompt,
          style: 'vivid',
          size: '1024x1024'
        });
        
        // Download and save image
        const filename = `ai-${iconName}-${Date.now()}.png`;
        const filepath = path.join(outputDir, filename);
        
        console.log(`💾 Downloading to ${filename}...`);
        await generator.downloadImage(image.url, filepath);
        
        results[iconName] = {
          filename,
          filepath,
          url: image.url,
          prompt: config.prompt,
          description: config.description,
          timestamp: image.timestamp,
          type: 'ai-generated'
        };
        
        console.log(`✅ ${iconName} completed!\n`);
        
        // Wait between generations
        if (Object.keys(results).length < Object.keys(THREE_FEATURE_ICONS).length) {
          console.log('⏳ Waiting 5 seconds before next generation...\n');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
      } catch (error) {
        console.error(`❌ Failed to generate ${iconName}:`, error.message);
        results[iconName] = { error: error.message };
      }
    }
    
    // Save manifest
    const manifestPath = path.join(outputDir, 'three-icons-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
    console.log(`📄 Manifest saved to ${manifestPath}`);
    
    // Display summary
    console.log('\n📊 GENERATION SUMMARY');
    console.log('====================');
    for (const [icon, result] of Object.entries(results)) {
      if (result.error) {
        console.log(`❌ ${icon}: Failed - ${result.error}`);
      } else {
        console.log(`✅ ${icon}: ${result.filename}`);
      }
    }
    
    console.log('\n✨ All three feature icons generated successfully!');
    
  } catch (error) {
    console.error('\n❌ Generation failed:', error);
    console.log('\nIf the browser opened but got stuck:');
    console.log('1. Make sure you are logged in to ChatGPT');
    console.log('2. Try running the script again');
  } finally {
    console.log('\n🔚 Closing browser...');
    await generator.close();
  }
}

// Run the generation
generateThreeFeatureIcons().catch(console.error);