// Generate specific feature icons for the minimal tone
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { ChatGPTImageGenerator } from './lib/chatgpt-image-generator.ts';
import fs from 'fs';
import path from 'path';

// Load session config manually
const CHATGPT_SESSION = {
  sessionToken: process.env.CHATGPT_SESSION_TOKEN || '',
  cookies: process.env.CHATGPT_COOKIES ? JSON.parse(process.env.CHATGPT_COOKIES) : []
};

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

async function generateFeatureIcons() {
  console.log('🎨 Generating Minimal Feature Icons');
  console.log('=====================================');
  
  // Check credentials
  if (!CHATGPT_SESSION.sessionToken && (!CHATGPT_SESSION.cookies || CHATGPT_SESSION.cookies.length === 0)) {
    console.error('❌ No ChatGPT credentials found!');
    console.log('\n📝 To set up ChatGPT image generation:');
    console.log('1. Open chatgpt.com in your browser');
    console.log('2. Open DevTools (F12) > Application > Cookies');
    console.log('3. Find "__Secure-next-auth.session-token"');
    console.log('4. Copy the value and add to .env.local as CHATGPT_SESSION_TOKEN');
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
    await generator.initialize(CHATGPT_SESSION.cookies);
    
    // Generate each feature icon
    for (const [featureName, config] of Object.entries(FEATURE_ICON_PROMPTS)) {
      try {
        console.log(`\n📸 Generating ${featureName} icon...`);
        console.log(`   Prompt: ${config.prompt.substring(0, 100)}...`);
        
        const image = await generator.generateImage({
          prompt: config.prompt,
          style: 'vivid',
          size: '1024x1024' // Square format for icons
        });
        
        // Download and save image
        const filename = `minimal-${featureName}-${Date.now()}.png`;
        const filepath = path.join(outputDir, filename);
        
        console.log(`💾 Downloading to ${filename}...`);
        await generator.downloadImage(image.url, filepath);
        
        results[featureName] = {
          filename,
          filepath,
          url: image.url,
          prompt: config.prompt,
          description: config.description,
          timestamp: image.timestamp
        };
        
        console.log(`✅ ${featureName} icon completed`);
        
        // Small delay between generations
        console.log('⏳ Waiting 3 seconds before next generation...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`❌ Failed to generate ${featureName}:`, error.message);
        results[featureName] = { error: error.message };
      }
    }
    
    // Save manifest
    const manifestPath = path.join(outputDir, 'feature-icons-manifest.json');
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
    
  } catch (error) {
    console.error('\n❌ Generation failed:', error);
  } finally {
    console.log('\n🔚 Closing browser...');
    await generator.close();
  }
}

// Run the generation
generateFeatureIcons().catch(console.error);