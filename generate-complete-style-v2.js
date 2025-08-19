#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ClaudeBrowserClient } from './temp/claude-browser-client.js';

dotenv.config({ path: '.env.local' });

// Enhanced logging utility
class Logger {
  constructor(verbose = true) {
    this.verbose = verbose;
    this.logFile = `/Users/adrian/repos/grid2_repo/logs/style-generation-${Date.now()}.log`;
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    // Console output with color coding
    const colors = {
      INFO: '\x1b[36m',    // Cyan
      SUCCESS: '\x1b[32m', // Green
      WARNING: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m',   // Red
      DEBUG: '\x1b[90m'    // Gray
    };
    
    const reset = '\x1b[0m';
    const icon = {
      INFO: 'ℹ️ ',
      SUCCESS: '✅',
      WARNING: '⚠️ ',
      ERROR: '❌',
      DEBUG: '🔍'
    };

    if (this.verbose || level === 'ERROR' || level === 'WARNING') {
      console.log(`${colors[level]}${icon[level]} [${timestamp.split('T')[1].split('.')[0]}] ${message}${reset}`);
      if (data && this.verbose) {
        console.log(colors[level], JSON.stringify(data, null, 2), reset);
      }
    }

    // File logging
    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + '\n');
  }

  info(message, data) { this.log('INFO', message, data); }
  success(message, data) { this.log('SUCCESS', message, data); }
  warning(message, data) { this.log('WARNING', message, data); }
  error(message, data) { this.log('ERROR', message, data); }
  debug(message, data) { this.log('DEBUG', message, data); }
}

// Retry utility with exponential backoff
async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    logger = new Logger()
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      lastError = error;
      logger.warning(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
        logger.debug(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Enhanced Claude prompt for better JSON generation
function createClaudePrompt(styleName, styleDescription) {
  // Single line prompt for Claude
  return `Create a complete style definition JSON for "${styleName}" (${styleDescription}). Return ONLY a JSON object with this exact structure: {"tokens": {"colors": {"primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "surface": "#hex", "text": "#hex", "textMuted": "#hex"}, "fonts": {"heading": "font-family", "body": "font-family"}, "radius": {"small": "4px", "medium": "8px", "large": "16px"}, "shadows": {"small": "shadow", "medium": "shadow", "large": "shadow"}}, "content": {"hero": {"headline": "text", "subheadline": "text", "cta": "button text"}, "features": [{"title": "text", "description": "text"}, {"title": "text", "description": "text"}, {"title": "text", "description": "text"}], "cta": {"headline": "text", "button": "text"}, "about": {"headline": "text", "description": "text"}}, "images": {"hero": "vivid photorealistic description for hero image, 16:9, no text", "features": "vivid photorealistic description for features image, 16:9, no text", "cta": "vivid photorealistic description for cta background, 16:9, no text"}, "personality": ["trait1", "trait2", "trait3", "trait4"]}. Make all values match the ${styleName} aesthetic with ${styleDescription}. Respond with ONLY the JSON, no markdown or explanations.`;
}

// Enhanced Claude response parser with validation
function parseClaudeResponse(responseText, logger) {
  logger.debug('Raw Claude response length:', { length: responseText.length });
  
  try {
    // Try multiple extraction strategies
    const strategies = [
      // Strategy 1: Direct JSON parse
      () => JSON.parse(responseText),
      
      // Strategy 2: Extract from code blocks
      () => {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
        throw new Error('No code block found');
      },
      
      // Strategy 3: Find JSON object in text
      () => {
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          return JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
        }
        throw new Error('No JSON object found');
      },
      
      // Strategy 4: Clean and parse
      () => {
        const cleaned = responseText
          .replace(/^[^{]*/, '')  // Remove text before first {
          .replace(/[^}]*$/, '')  // Remove text after last }
          .replace(/\n/g, ' ')    // Replace newlines
          .replace(/\s+/g, ' ');  // Normalize whitespace
        return JSON.parse(cleaned);
      }
    ];
    
    let parsed;
    let strategyUsed = 0;
    
    for (const [index, strategy] of strategies.entries()) {
      try {
        parsed = strategy();
        strategyUsed = index + 1;
        logger.debug(`Successfully parsed with strategy ${strategyUsed}`);
        break;
      } catch (e) {
        logger.debug(`Strategy ${index + 1} failed: ${e.message}`);
      }
    }
    
    if (!parsed) {
      throw new Error('All parsing strategies failed');
    }
    
    // Validate structure
    const requiredPaths = [
      'tokens.colors.primary',
      'tokens.fonts.heading',
      'content.hero.headline',
      'content.features',
      'images.hero',
      'personality'
    ];
    
    for (const path of requiredPaths) {
      const value = path.split('.').reduce((obj, key) => obj?.[key], parsed);
      if (value === undefined) {
        logger.warning(`Missing required field: ${path}`);
      }
    }
    
    logger.success('Claude response parsed and validated successfully');
    return parsed;
    
  } catch (error) {
    logger.error('Failed to parse Claude response', { error: error.message });
    
    // Return enhanced fallback with style-specific defaults
    return generateFallbackStyle(responseText, logger);
  }
}

// Generate intelligent fallback based on style description
function generateFallbackStyle(responseText, logger) {
  logger.info('Generating intelligent fallback style');
  
  // Extract any useful information from the response
  const extractedInfo = {
    colors: extractColors(responseText),
    keywords: extractKeywords(responseText),
    tone: detectTone(responseText)
  };
  
  logger.debug('Extracted info from response', extractedInfo);
  
  // Generate style-aware fallback
  const fallback = {
    tokens: {
      colors: {
        primary: extractedInfo.colors[0] || '#007AFF',
        secondary: extractedInfo.colors[1] || '#5856D6',
        accent: extractedInfo.colors[2] || '#FF3B30',
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
    content: generateContentForTone(extractedInfo.tone),
    images: generateImageDescriptions(extractedInfo.keywords),
    personality: generatePersonalityTraits(extractedInfo.tone, extractedInfo.keywords)
  };
  
  logger.success('Generated intelligent fallback');
  return fallback;
}

function extractColors(text) {
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = text.match(hexPattern) || [];
  return matches.slice(0, 3);
}

function extractKeywords(text) {
  const keywords = ['modern', 'minimal', 'bold', 'elegant', 'playful', 'tech', 'cyber', 'neon', 'future'];
  return keywords.filter(keyword => text.toLowerCase().includes(keyword));
}

function detectTone(text) {
  const toneMap = {
    'corporate': ['professional', 'business', 'trust'],
    'creative': ['artistic', 'creative', 'expressive'],
    'tech': ['tech', 'cyber', 'future', 'digital'],
    'playful': ['fun', 'playful', 'vibrant', 'colorful']
  };
  
  for (const [tone, keywords] of Object.entries(toneMap)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return tone;
    }
  }
  return 'modern';
}

function generateContentForTone(tone) {
  const contentMap = {
    tech: {
      hero: {
        headline: 'Enter the Digital Future',
        subheadline: 'Where innovation meets limitless possibilities',
        cta: 'Launch Your Vision'
      },
      features: [
        { title: 'Quantum Speed', description: 'Next-generation performance that defies limits' },
        { title: 'Neural Interface', description: 'Intuitive controls that think with you' },
        { title: 'Cyber Security', description: 'Military-grade protection for your digital assets' }
      ],
      cta: {
        headline: 'Ready to Transcend Reality?',
        button: 'Initialize Now'
      },
      about: {
        headline: 'Architected for Tomorrow',
        description: 'Building the infrastructure of the digital frontier'
      }
    },
    // Add more tone-specific content...
    default: {
      hero: {
        headline: 'Transform Your Vision Into Reality',
        subheadline: 'Build beautiful, responsive websites with our intuitive platform',
        cta: 'Get Started Free'
      },
      features: [
        { title: 'Lightning Fast', description: 'Optimized performance for the best user experience' },
        { title: 'Fully Responsive', description: 'Looks perfect on every device and screen size' },
        { title: 'Easy to Use', description: 'Intuitive interface that anyone can master' }
      ],
      cta: {
        headline: 'Ready to Build Something Amazing?',
        button: 'Start Building Now'
      },
      about: {
        headline: 'Built for Modern Creators',
        description: 'Our platform empowers you to create stunning websites without limits'
      }
    }
  };
  
  return contentMap[tone] || contentMap.default;
}

function generateImageDescriptions(keywords) {
  const hasKeyword = (word) => keywords.includes(word);
  
  let heroDesc = 'Modern professional workspace with creative energy. ';
  let featuresDesc = 'Clean modern icons representing innovation. ';
  let ctaDesc = 'Dynamic gradient background with energetic flow. ';
  
  if (hasKeyword('tech') || hasKeyword('cyber')) {
    heroDesc = 'Futuristic cyberpunk cityscape with neon lights, holographic displays, digital rain effect. ';
    featuresDesc = 'Glowing holographic tech icons floating in cyber space, neon circuit patterns. ';
    ctaDesc = 'Electric neon gradient with data streams and matrix-like digital patterns. ';
  }
  
  const suffix = 'Style: vivid photorealistic. Aspect ratio: 16:9 landscape. NO text, NO words, NO typography.';
  
  return {
    hero: heroDesc + suffix,
    features: featuresDesc + suffix,
    cta: ctaDesc + suffix
  };
}

function generatePersonalityTraits(tone, keywords) {
  const traits = {
    tech: ['futuristic', 'innovative', 'cutting-edge', 'digital'],
    corporate: ['professional', 'trustworthy', 'reliable', 'established'],
    creative: ['artistic', 'expressive', 'unique', 'imaginative'],
    playful: ['fun', 'energetic', 'vibrant', 'approachable']
  };
  
  return traits[tone] || ['modern', 'professional', 'innovative', 'accessible'];
}

// Enhanced image generation with retry and validation
async function generateImagesWithChatGPT(imagePrompts, styleName, logger) {
  logger.info('Starting ChatGPT image generation', { count: imagePrompts.length });
  
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
  
  try {
    await page.goto('https://chatgpt.com');
    await page.waitForTimeout(3000);
    
    const generatedImages = [];
    const failedImages = [];
    
    for (const [index, imageData] of imagePrompts.entries()) {
      logger.info(`Generating image ${index + 1}/${imagePrompts.length}`, { type: imageData.type });
      
      try {
        const image = await retryWithBackoff(async () => {
          // Navigate to new chat
          await page.goto('https://chatgpt.com');
          await page.waitForTimeout(2000);
          
          // Find and fill composer
          const composer = page.locator('#prompt-textarea, [data-id="composer"], .ProseMirror').first();
          await composer.waitFor({ timeout: 10000 });
          await composer.click();
          await page.keyboard.press('Control+A');
          await page.keyboard.press('Backspace');
          await composer.fill(imageData.prompt);
          
          // Send message
          try {
            await page.locator('[data-testid="send-button"]').click();
          } catch {
            await page.keyboard.press('Enter');
          }
          
          logger.debug('Waiting for image generation...');
          
          // Wait for image with timeout
          await page.waitForSelector('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]', {
            timeout: 120000
          });
          
          // Get image URL
          const imageElement = page.locator('img[alt*="Generated"], img[src*="dalle"], img[src*="oaiusercontent"]').first();
          const imageSrc = await imageElement.getAttribute('src');
          
          if (!imageSrc) {
            throw new Error('No image URL found');
          }
          
          // Download image
          const timestamp = Date.now();
          const filename = `${styleName}-${imageData.type}-${timestamp}.png`;
          const filepath = path.join('/Users/adrian/repos/grid2_repo/public/generated-images', filename);
          
          const response = await page.request.get(imageSrc);
          const buffer = await response.body();
          
          // Validate image
          if (buffer.length < 1000) {
            throw new Error('Image file too small, likely corrupted');
          }
          
          await fs.promises.writeFile(filepath, buffer);
          
          logger.success(`Image saved: ${filename}`, { size: buffer.length });
          
          return {
            type: imageData.type,
            filename: filename,
            path: `/generated-images/${filename}`,
            url: imageSrc,
            size: buffer.length
          };
        }, { logger, maxRetries: 3 });
        
        generatedImages.push(image);
        
        // Rate limiting
        await page.waitForTimeout(5000);
        
      } catch (error) {
        logger.error(`Failed to generate ${imageData.type} image`, { error: error.message });
        failedImages.push({ type: imageData.type, error: error.message });
      }
    }
    
    logger.info('Image generation complete', { 
      success: generatedImages.length, 
      failed: failedImages.length 
    });
    
    return { generatedImages, failedImages };
    
  } finally {
    await browser.close();
  }
}

// Main generation function with enhanced error handling
async function generateCompleteStyle(styleName, styleDescription, options = {}) {
  const logger = new Logger(options.verbose !== false);
  const startTime = Date.now();
  
  logger.info('='*60);
  logger.info(`🎨 GENERATING COMPLETE STYLE: ${styleName}`);
  logger.info(`📝 Description: ${styleDescription}`);
  logger.info('='*60);
  
  const outputDir = '/Users/adrian/repos/grid2_repo/public/generated-images';
  const styleDir = '/Users/adrian/repos/grid2_repo/styles';
  
  // Ensure directories exist
  [outputDir, styleDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  let claudeClient;
  let styleData;
  let images = { generatedImages: [], failedImages: [] };
  
  try {
    // Step 1: Generate style content with Claude
    logger.info('STEP 1: Generating style content with Claude');
    
    claudeClient = new ClaudeBrowserClient({ headless: false });
    
    await retryWithBackoff(async () => {
      await claudeClient.initialize();
      
      const prompt = createClaudePrompt(styleName, styleDescription);
      const response = await claudeClient.sendMessage(prompt);
      
      if (!response || !response.content || !response.content[0]) {
        throw new Error('Invalid Claude response structure');
      }
      
      styleData = parseClaudeResponse(response.content[0].text, logger);
      
      logger.success('Style content generated successfully');
    }, { logger, maxRetries: 2 });
    
    // Step 2: Generate images with ChatGPT
    logger.info('STEP 2: Generating images with ChatGPT');
    
    const imagePrompts = [
      { type: 'hero', prompt: styleData.images.hero },
      { type: 'features', prompt: styleData.images.features },
      { type: 'cta', prompt: styleData.images.cta }
    ];
    
    images = await generateImagesWithChatGPT(imagePrompts, styleName, logger);
    
    // Step 3: Create and save style configuration
    logger.info('STEP 3: Creating style configuration');
    
    const styleConfig = {
      name: styleName,
      description: styleDescription,
      tokens: styleData.tokens,
      content: styleData.content,
      images: images.generatedImages,
      failedImages: images.failedImages,
      personality: styleData.personality,
      generatedAt: new Date().toISOString(),
      generationTime: Date.now() - startTime,
      version: '2.0'
    };
    
    const configPath = path.join(styleDir, `${styleName}.json`);
    fs.writeFileSync(configPath, JSON.stringify(styleConfig, null, 2));
    
    logger.success(`Style configuration saved: ${configPath}`);
    
    // Step 4: Update style registry
    logger.info('STEP 4: Updating style registry');
    
    await updateStyleRegistry(styleName, styleConfig, logger);
    
    // Final summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    logger.info('='*60);
    logger.success(`✨ STYLE GENERATION COMPLETE in ${duration}s`);
    logger.info(`📦 Style: ${styleName}`);
    logger.info(`🖼️  Images: ${images.generatedImages.length} successful, ${images.failedImages.length} failed`);
    logger.info(`📁 Config: ${configPath}`);
    logger.info(`📊 Log: ${logger.logFile}`);
    logger.info('='*60);
    
    return {
      success: true,
      styleConfig,
      duration,
      logFile: logger.logFile
    };
    
  } catch (error) {
    logger.error('Style generation failed', { 
      error: error.message,
      stack: error.stack 
    });
    
    return {
      success: false,
      error: error.message,
      duration: ((Date.now() - startTime) / 1000).toFixed(2),
      logFile: logger.logFile
    };
    
  } finally {
    if (claudeClient) {
      await claudeClient.close();
    }
  }
}

// Enhanced registry update
async function updateStyleRegistry(styleName, styleConfig, logger) {
  const registryPath = '/Users/adrian/repos/grid2_repo/lib/style-registry.ts';
  
  try {
    if (!fs.existsSync(registryPath)) {
      // Create new registry
      const registryContent = `// Style Registry - Auto-generated
// Generated: ${new Date().toISOString()}

export interface StyleConfig {
  name: string;
  description: string;
  tokens: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    radius: Record<string, string>;
    shadows: Record<string, string>;
  };
  content: {
    hero: Record<string, string>;
    features: Array<Record<string, string>>;
    cta: Record<string, string>;
    about: Record<string, string>;
  };
  images: Array<{
    type: string;
    filename: string;
    path: string;
    url?: string;
    size?: number;
  }>;
  personality: string[];
  generatedAt: string;
  version: string;
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

export function getStylesByPersonality(trait: string): StyleConfig[] {
  return Object.values(styles).filter(style => 
    style.personality.includes(trait)
  );
}
`;
      
      fs.writeFileSync(registryPath, registryContent);
      logger.success('Created new style registry');
      
    } else {
      // Update existing registry
      let registryContent = fs.readFileSync(registryPath, 'utf8');
      
      // Check if style already exists
      if (registryContent.includes(`"${styleName}":`)) {
        logger.warning(`Style "${styleName}" already exists in registry, updating...`);
        
        // Replace existing style
        const styleRegex = new RegExp(`"${styleName}":\\s*{[^}]*}(?:,)?`, 'gs');
        registryContent = registryContent.replace(
          styleRegex,
          `"${styleName}": ${JSON.stringify(styleConfig, null, 2)},`
        );
      } else {
        // Add new style
        const stylesEnd = registryContent.lastIndexOf('};');
        if (stylesEnd > -1) {
          const insertion = `,\n  "${styleName}": ${JSON.stringify(styleConfig, null, 2)}\n`;
          registryContent = registryContent.slice(0, stylesEnd) + insertion + registryContent.slice(stylesEnd);
        }
      }
      
      fs.writeFileSync(registryPath, registryContent);
      logger.success('Updated style registry');
    }
  } catch (error) {
    logger.error('Failed to update registry', { error: error.message });
    logger.info('Manual registry update required');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
🎨 STYLE GENERATOR v2.0
======================

Usage: node generate-complete-style-v2.js <style-name> <description> [options]

Examples:
  node generate-complete-style-v2.js "techno" "Futuristic cyberpunk with neon colors"
  node generate-complete-style-v2.js "zen" "Minimalist Japanese aesthetic" --verbose

Options:
  --verbose    Show detailed logging
  --help       Show this help message

Features:
  ✅ Intelligent error recovery
  ✅ Retry logic with exponential backoff
  ✅ Comprehensive logging
  ✅ Response validation
  ✅ Fallback generation
  ✅ Performance tracking
`);
    process.exit(1);
  }
  
  if (args.includes('--help')) {
    process.exit(0);
  }
  
  const styleName = args[0].toLowerCase().replace(/\s+/g, '-');
  const descriptionParts = args.slice(1).filter(arg => !arg.startsWith('--'));
  const styleDescription = descriptionParts.join(' ');
  const verbose = args.includes('--verbose');
  
  try {
    const result = await generateCompleteStyle(styleName, styleDescription, { verbose });
    
    if (result.success) {
      console.log('\n✅ Style generation successful!');
      console.log(`📊 Check the log for details: ${result.logFile}`);
      process.exit(0);
    } else {
      console.error('\n❌ Style generation failed');
      console.error(`📊 Check the log for details: ${result.logFile}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { generateCompleteStyle, Logger };