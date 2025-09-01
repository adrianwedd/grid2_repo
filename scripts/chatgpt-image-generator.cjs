#!/usr/bin/env node

/**
 * Generate images using ChatGPT for failed Pollinations.ai images
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// ChatGPT cookies from .env.local
const CHATGPT_SESSION_TOKEN = process.env.CHATGPT_SESSION_TOKEN;
const CHATGPT_CF_BM = process.env.CHATGPT_CF_BM;
const CHATGPT_CFLB = process.env.CHATGPT_CFLB;

// All 32 styles with their prompts (same as before)
const ALL_STYLES = [
  // Original 12 styles
  { 
    id: 'minimal-swiss', 
    name: 'Minimal Swiss', 
    tone: 'minimal',
    prompts: {
      hero: 'Clean minimalist office space with white walls, geometric furniture, natural light, Swiss design principles, ultra-clean, professional',
      feature1: 'Minimalist product design, clean lines, white background, geometric shapes, Swiss typography influence',
      feature2: 'Simple workspace with laptop, clean desk, minimal decor, natural lighting, focus on functionality',
      feature3: 'Modern minimalist interior, white and grey color scheme, geometric patterns, natural light',
      cta: 'Clean call-to-action design with geometric elements, minimal color palette, professional feel'
    }
  },
  { 
    id: 'retro-vintage', 
    name: 'Retro Vintage', 
    tone: 'retro',
    prompts: {
      hero: 'Vintage 1950s diner, retro aesthetic, nostalgic atmosphere, classic Americana',
      feature1: 'Classic vintage car, retro automobile design, nostalgic transportation, 50s style',
      feature2: 'Retro kitchen appliances, vintage design, mid-century modern, nostalgic home',
      feature3: 'Vintage record player, retro music setup, nostalgic entertainment, classic design',
      cta: 'Retro-style call-to-action with vintage design elements, nostalgic color palette'
    }
  },
  { 
    id: 'nature-eco', 
    name: 'Nature Eco', 
    tone: 'nature',
    prompts: {
      hero: 'Lush green forest, sustainable living, eco-friendly environment, natural harmony',
      feature1: 'Solar panels and wind turbines, renewable energy, sustainable technology, green future',
      feature2: 'Organic farming, sustainable agriculture, green growing, environmental stewardship',
      feature3: 'Eco-friendly home design, sustainable architecture, green building, natural materials',
      cta: 'Nature-inspired call-to-action with green elements, sustainable design, eco-friendly feel'
    }
  },
  { 
    id: 'quantum-nebula', 
    name: 'Quantum Nebula', 
    tone: 'playful',
    prompts: {
      hero: 'Cosmic nebula with quantum particles dancing, purple and cyan colors, space-time distortion, cosmic dance',
      feature1: 'Quantum computing visualization, particle physics, cosmic energy, nebula formations',
      feature2: 'Interstellar portal, quantum tunneling effect, cosmic gateway, purple and cyan lights',
      feature3: 'Cosmic laboratory, quantum experiments, particle accelerator, nebula background',
      cta: 'Quantum-inspired interface with particle effects, cosmic background, futuristic design'
    }
  }
];

// Get missing images by checking the filesystem
function getMissingImages() {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'ai-generated');
  const missing = [];

  for (const style of ALL_STYLES) {
    const styleDir = path.join(outputDir, style.id);
    
    if (!fs.existsSync(styleDir)) {
      // Entire style is missing
      ['hero', 'feature1', 'feature2', 'feature3', 'cta'].forEach(type => {
        missing.push({ style: style.id, type, prompt: style.prompts[type] });
      });
      continue;
    }

    // Check individual images
    ['hero', 'feature1', 'feature2', 'feature3', 'cta'].forEach(type => {
      const expectedFile = path.join(styleDir, `${style.id}-${type}.jpg`);
      if (!fs.existsSync(expectedFile)) {
        missing.push({ style: style.id, type, prompt: style.prompts[type] });
      }
    });
  }

  return missing;
}

// Generate image using ChatGPT
async function generateImageWithChatGPT(prompt) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      action: 'next',
      messages: [
        {
          id: 'user-' + Date.now(),
          author: { role: 'user' },
          content: {
            content_type: 'text',
            parts: [`Generate an image: ${prompt}`]
          }
        }
      ],
      parent_message_id: 'system',
      model: 'gpt-4',
      timezone_offset_min: -480,
      suggestions: [],
      history_and_training_disabled: false,
      conversation_mode: { kind: 'primary_assistant' },
      force_paragen: false,
      force_rate_limit: false
    });

    const options = {
      hostname: 'chatgpt.com',
      path: '/backend-api/conversation',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'Cookie': [
          `__Secure-next-auth.session-token=${CHATGPT_SESSION_TOKEN}`,
          `__cf_bm=${CHATGPT_CF_BM}`,
          `__cflb=${CHATGPT_CFLB}`
        ].join('; '),
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/event-stream',
        'Accept-Language': 'en-US,en;q=0.9',
        'Authorization': `Bearer ${CHATGPT_SESSION_TOKEN}`,
        'Referer': 'https://chatgpt.com/',
        'Origin': 'https://chatgpt.com'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Parse the response to extract image URL
          const lines = data.split('\n').filter(line => line.trim().startsWith('data:'));
          
          for (const line of lines) {
            try {
              const jsonData = JSON.parse(line.substring(5)); // Remove 'data: ' prefix
              
              if (jsonData.message?.content?.parts) {
                for (const part of jsonData.message.content.parts) {
                  // Look for image URLs in the response
                  const imageMatch = part.match(/https:\/\/[^\s\)]+\.(?:jpg|jpeg|png|webp)/gi);
                  if (imageMatch && imageMatch[0]) {
                    resolve(imageMatch[0]);
                    return;
                  }
                }
              }
            } catch (e) {
              // Continue parsing other lines
            }
          }
          
          reject(new Error('No image URL found in ChatGPT response'));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}

// Download image from URL
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Main function to generate missing images
async function generateMissingImages() {
  if (!CHATGPT_SESSION_TOKEN) {
    console.log('❌ ChatGPT session token not found in .env.local');
    process.exit(1);
  }

  console.log('🔍 Checking for missing images...');
  const missing = getMissingImages();
  
  if (missing.length === 0) {
    console.log('✅ No missing images found!');
    return;
  }

  console.log(`🎨 Found ${missing.length} missing images. Generating with ChatGPT...\n`);

  const outputDir = path.join(process.cwd(), 'public', 'images', 'ai-generated');
  let generated = 0;

  for (let i = 0; i < missing.length; i++) {
    const { style, type, prompt } = missing[i];
    
    console.log(`📸 [${i + 1}/${missing.length}] Generating ${style}-${type}...`);
    
    try {
      // Ensure style directory exists
      const styleDir = path.join(outputDir, style);
      if (!fs.existsSync(styleDir)) {
        fs.mkdirSync(styleDir, { recursive: true });
      }

      // Generate image with ChatGPT
      console.log(`  ⏳ Requesting from ChatGPT...`);
      const imageUrl = await generateImageWithChatGPT(prompt);
      
      // Download the image
      console.log(`  ⬇️ Downloading image...`);
      const filename = `${style}-${type}.jpg`;
      const filePath = path.join(styleDir, filename);
      
      await downloadImage(imageUrl, filePath);
      
      console.log(`  ✅ Saved ${filename}`);
      generated++;
      
      // Be respectful - wait between requests
      if (i < missing.length - 1) {
        console.log(`  ⏳ Waiting 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
    }
  }

  console.log(`\n🎉 ChatGPT generation complete!`);
  console.log(`✅ Successfully generated ${generated}/${missing.length} missing images`);
  
  // Final status check
  const finalMissing = getMissingImages();
  if (finalMissing.length === 0) {
    console.log('🚀 All images are now available!');
  } else {
    console.log(`⚠️ Still missing ${finalMissing.length} images`);
  }
}

// Run the generator
generateMissingImages().catch(console.error);