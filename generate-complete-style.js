#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ClaudeBrowserClient } from './temp/claude-browser-client.js';

dotenv.config({ path: '.env.local' });

/**
 * Generate a complete new style for the website
 * 1. Use Claude to generate style metadata, content, and image descriptions
 * 2. Use ChatGPT to generate the actual images
 * 3. Add the new style to the site registry
 */

async function generateCompleteStyle(styleName, styleDescription) {
  console.log('🎨 Generating Complete Style:', styleName);
  console.log('=' .repeat(50));
  console.log(`Description: ${styleDescription}\n`);
  
  const outputDir = '/Users/adrian/repos/grid2_repo/public/generated-images';
  
  // Step 1: Use Claude to generate style content
  console.log('🤖 Step 1: Generating style content with Claude...\n');
  
  const claudeClient = new ClaudeBrowserClient({ headless: false });
  
  try {
    await claudeClient.initialize();
    
    const stylePrompt = `
Generate a complete style definition for a website builder with the following style:

Style Name: ${styleName}
Description: ${styleDescription}

Please provide:

1. Brand tokens (colors, fonts, spacing, etc.) in this JSON format:
{
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "textMuted": "#hex"
  },
  "fonts": {
    "heading": "font-family",
    "body": "font-family"
  },
  "radius": {
    "small": "4px",
    "medium": "8px",
    "large": "16px"
  },
  "shadows": {
    "small": "shadow-value",
    "medium": "shadow-value",
    "large": "shadow-value"
  }
}

2. Content for different sections:
- Hero section: headline, subheadline, CTA text
- Features section: 3 features with titles and descriptions
- CTA section: headline and button text
- About section: headline and description

3. Image descriptions for AI generation (vivid, photorealistic style):
- Hero image description
- Features image description  
- CTA background description

4. Style personality traits (3-5 adjectives)

Format everything as JSON for easy parsing.`;

    const claudeResponse = await claudeClient.sendMessage(stylePrompt);
    const styleData = parseClaudeResponse(claudeResponse.content[0].text);
    
    console.log('✅ Style content generated!\n');
    console.log('Style Data:', JSON.stringify(styleData, null, 2).substring(0, 500) + '...\n');
    
    // Step 2: Generate images with ChatGPT
    console.log('🎨 Step 2: Generating images with ChatGPT...\n');
    
    const imagePrompts = [
      { type: 'hero', prompt: styleData.images.hero },
      { type: 'features', prompt: styleData.images.features },
      { type: 'cta', prompt: styleData.images.cta }
    ];
    
    const generatedImages = await generateImagesWithChatGPT(imagePrompts, styleName);
    
    // Step 3: Create style configuration file
    console.log('📝 Step 3: Creating style configuration...\n');
    
    const styleConfig = {
      name: styleName,
      description: styleDescription,
      tokens: styleData.tokens,
      content: styleData.content,
      images: generatedImages,
      personality: styleData.personality,
      generatedAt: new Date().toISOString()
    };
    
    // Save style configuration
    const configPath = path.join('/Users/adrian/repos/grid2_repo/styles', `${styleName}.json`);
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(styleConfig, null, 2));
    
    console.log(`✅ Style configuration saved to: ${configPath}\n`);
    
    // Step 4: Update the style registry
    console.log('📚 Step 4: Adding to style registry...\n');
    
    await updateStyleRegistry(styleName, styleConfig);
    
    console.log('🎉 Complete style generated successfully!');
    console.log(`\nStyle: ${styleName}`);
    console.log('Generated:');
    console.log(`  - ${generatedImages.length} images`);
    console.log(`  - Style configuration`);
    console.log(`  - Content and copy`);
    console.log(`  - Brand tokens`);
    
    await claudeClient.close();
    
    return styleConfig;
    
  } catch (error) {
    console.error('❌ Error generating style:', error.message);
    await claudeClient.close();
    throw error;
  }
}

function parseClaudeResponse(responseText) {
  // Try to extract JSON from Claude's response
  try {
    // Look for JSON blocks in the response
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try parsing the whole response as JSON
    return JSON.parse(responseText);
  } catch (error) {
    // Fallback: create structure from text
    console.log('⚠️ Could not parse JSON, using fallback parser...');
    
    return {
      tokens: {
        colors: {
          primary: '#007AFF',
          secondary: '#5856D6',
          accent: '#FF3B30',
          background: '#FFFFFF',
          surface: '#F2F2F7',
          text: '#000000',
          textMuted: '#8E8E93'
        },
        fonts: {
          heading: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          body: 'system-ui, -apple-system, "Segoe UI", sans-serif'
        },
        radius: {
          small: '4px',
          medium: '8px',
          large: '16px'
        },
        shadows: {
          small: '0 1px 3px rgba(0,0,0,0.1)',
          medium: '0 4px 6px rgba(0,0,0,0.1)',
          large: '0 10px 20px rgba(0,0,0,0.15)'
        }
      },
      content: {
        hero: {
          headline: 'Transform Your Vision Into Reality',
          subheadline: 'Build beautiful, responsive websites with our intuitive platform',
          cta: 'Get Started Free'
        },
        features: [
          {
            title: 'Lightning Fast',
            description: 'Optimized performance for the best user experience'
          },
          {
            title: 'Fully Responsive',
            description: 'Looks perfect on every device and screen size'
          },
          {
            title: 'Easy to Use',
            description: 'Intuitive interface that anyone can master'
          }
        ],
        cta: {
          headline: 'Ready to Build Something Amazing?',
          button: 'Start Building Now'
        },
        about: {
          headline: 'Built for Modern Creators',
          description: 'Our platform empowers you to create stunning websites without limits'
        }
      },
      images: {
        hero: extractImageDescription(responseText, 'hero') || 
          'Modern tech workspace with creative energy, vibrant colors, professional aesthetic. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text.',
        features: extractImageDescription(responseText, 'features') ||
          'Clean modern icons representing speed, responsiveness, and ease of use. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text.',
        cta: extractImageDescription(responseText, 'cta') ||
          'Dynamic gradient background with energetic flow and modern aesthetic. Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text.'
      },
      personality: ['modern', 'professional', 'innovative', 'accessible']
    };
  }
}

function extractImageDescription(text, type) {
  const patterns = [
    new RegExp(`${type}.*?image.*?:(.+?)(?:\\n|$)`, 'i'),
    new RegExp(`${type}.*?description.*?:(.+?)(?:\\n|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

async function generateImagesWithChatGPT(imagePrompts, styleName) {
  console.log('🖼️ Generating images with ChatGPT...\n');
  
  const cookies = JSON.parse(process.env.CHATGPT_COOKIES || '[]');
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
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
                cookie.sameSite === 'lax' ? 'Lax' : 'Strict'
    }]);
  }
  
  const page = await context.newPage();
  await page.goto('https://chatgpt.com');
  await page.waitForTimeout(3000);
  
  const generatedImages = [];
  
  for (const [index, imageData] of imagePrompts.entries()) {
    console.log(`  [${index + 1}/${imagePrompts.length}] Generating ${imageData.type} image...`);
    
    try {
      // New chat for each image
      await page.goto('https://chatgpt.com');
      await page.waitForTimeout(2000);
      
      // Send prompt
      const composer = page.locator('#prompt-textarea, [data-id="composer"]').first();
      await composer.waitFor({ timeout: 5000 });
      await composer.click();
      await composer.fill(imageData.prompt);
      
      try {
        await page.locator('[data-testid="send-button"]').click();
      } catch {
        await page.keyboard.press('Enter');
      }
      
      // Wait for image generation
      await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"]', {
        timeout: 120000
      });
      
      // Download the image
      const imageElement = page.locator('img[alt*="Generated"], img[src*="dalle"]').first();
      const imageSrc = await imageElement.getAttribute('src');
      
      if (imageSrc) {
        const timestamp = Date.now();
        const filename = `${styleName}-${imageData.type}-${timestamp}.png`;
        const filepath = path.join('/Users/adrian/repos/grid2_repo/public/generated-images', filename);
        
        const response = await page.request.get(imageSrc);
        const buffer = await response.body();
        await fs.promises.writeFile(filepath, buffer);
        
        generatedImages.push({
          type: imageData.type,
          filename: filename,
          path: `/generated-images/${filename}`,
          url: imageSrc
        });
        
        console.log(`    ✅ Saved: ${filename}`);
      }
      
      await page.waitForTimeout(3000);
      
    } catch (error) {
      console.log(`    ❌ Failed: ${error.message}`);
    }
  }
  
  await browser.close();
  return generatedImages;
}

async function updateStyleRegistry(styleName, styleConfig) {
  // Update the TypeScript registry file
  const registryPath = '/Users/adrian/repos/grid2_repo/lib/style-registry.ts';
  
  if (!fs.existsSync(registryPath)) {
    // Create new registry file
    const registryContent = `
// Style Registry - Auto-generated
export interface StyleConfig {
  name: string;
  description: string;
  tokens: any;
  content: any;
  images: any[];
  personality: string[];
}

export const styles: Record<string, StyleConfig> = {
  "${styleName}": ${JSON.stringify(styleConfig, null, 2)}
};

export function getStyle(name: string): StyleConfig | undefined {
  return styles[name];
}

export function getAllStyles(): string[] {
  return Object.keys(styles);
}
`;
    
    fs.writeFileSync(registryPath, registryContent);
    console.log('✅ Created style registry');
  } else {
    console.log('📝 TODO: Update existing registry (manual step required)');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node generate-complete-style.js <style-name> <description>');
    console.log('Example: node generate-complete-style.js "techno" "Futuristic cyberpunk aesthetic with neon colors"');
    process.exit(1);
  }
  
  const styleName = args[0].toLowerCase().replace(/\s+/g, '-');
  const styleDescription = args.slice(1).join(' ');
  
  try {
    await generateCompleteStyle(styleName, styleDescription);
  } catch (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { generateCompleteStyle };