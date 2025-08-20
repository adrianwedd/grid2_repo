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

// Enhanced Claude interaction with JSON validation and retry
async function getStyleFromClaude(styleName, styleDescription, claudeClient, logger, maxRetries = 3) {
  logger.info('Requesting style definition from Claude');
  
  // Initial prompt - clear and specific
  const initialPrompt = `Create a complete style definition JSON for "${styleName}" (${styleDescription}). Return ONLY a valid JSON object with this exact structure: {"tokens": {"colors": {"primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "surface": "#hex", "text": "#hex", "textMuted": "#hex"}, "fonts": {"heading": "font-family", "body": "font-family"}, "radius": {"small": "4px", "medium": "8px", "large": "16px"}, "shadows": {"small": "shadow", "medium": "shadow", "large": "shadow"}}, "content": {"hero": {"headline": "text", "subheadline": "text", "cta": "button text"}, "features": [{"title": "text", "description": "text"}, {"title": "text", "description": "text"}, {"title": "text", "description": "text"}], "cta": {"headline": "text", "button": "text"}, "about": {"headline": "text", "description": "text"}}, "images": {"hero": "vivid photorealistic description for hero image, 16:9, no text", "features": "vivid photorealistic description for features image, 16:9, no text", "cta": "vivid photorealistic description for cta background, 16:9, no text"}, "personality": ["trait1", "trait2", "trait3", "trait4"]}. Make all values match the ${styleName} aesthetic with ${styleDescription}. Respond with ONLY the JSON, no markdown or explanations.`;
  
  let attempts = 0;
  let lastResponse = null;
  let validJson = null;
  
  while (attempts < maxRetries && !validJson) {
    attempts++;
    logger.debug(`Claude attempt ${attempts}/${maxRetries}`);
    
    try {
      let prompt;
      
      if (attempts === 1) {
        // First attempt - use initial prompt
        prompt = initialPrompt;
      } else {
        // Retry attempts - ask Claude to fix the JSON
        logger.info('Asking Claude to correct the JSON response');
        prompt = `Your previous response was not valid JSON. Here's what you sent: "${lastResponse}". Please respond with ONLY a valid JSON object for the ${styleName} style. No markdown code blocks, no explanations, just the raw JSON object starting with { and ending with }. The structure must match exactly what was requested.`;
      }
      
      const response = await claudeClient.sendMessage(prompt);
      
      if (!response || !response.content || !response.content[0]) {
        throw new Error('Invalid Claude response structure');
      }
      
      lastResponse = response.content[0].text;
      logger.debug(`Claude response (attempt ${attempts}):`, { 
        length: lastResponse.length,
        preview: lastResponse.substring(0, 100) 
      });
      
      // Try to parse the response
      validJson = parseClaudeJSON(lastResponse, logger);
      
      if (validJson) {
        // Validate the structure
        const validation = validateStyleJSON(validJson, logger);
        if (validation.isValid) {
          logger.success('Received valid JSON from Claude');
          return validJson;
        } else {
          logger.warning(`JSON structure invalid: ${validation.errors.join(', ')}`);
          validJson = null; // Reset to trigger retry
        }
      }
      
    } catch (error) {
      logger.warning(`Attempt ${attempts} failed: ${error.message}`);
    }
    
    // Wait before retry
    if (attempts < maxRetries && !validJson) {
      logger.info('Waiting before retry...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // If all attempts failed, generate fallback
  if (!validJson) {
    logger.warning('All Claude attempts failed, using intelligent fallback');
    return generateIntelligentFallback(styleName, styleDescription, lastResponse, logger);
  }
  
  return validJson;
}

// Enhanced JSON parser with multiple strategies
function parseClaudeJSON(responseText, logger) {
  if (!responseText || responseText.length < 10) {
    logger.debug('Response too short to be valid JSON');
    return null;
  }
  
  const strategies = [
    // Strategy 1: Direct parse
    {
      name: 'Direct JSON parse',
      parse: () => JSON.parse(responseText)
    },
    
    // Strategy 2: Extract from markdown code block
    {
      name: 'Extract from code block',
      parse: () => {
        const matches = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (matches && matches[1]) {
          return JSON.parse(matches[1]);
        }
        throw new Error('No code block found');
      }
    },
    
    // Strategy 3: Find JSON object boundaries
    {
      name: 'Find JSON boundaries',
      parse: () => {
        const start = responseText.indexOf('{');
        const end = responseText.lastIndexOf('}');
        if (start >= 0 && end > start) {
          return JSON.parse(responseText.substring(start, end + 1));
        }
        throw new Error('No JSON object boundaries found');
      }
    },
    
    // Strategy 4: Clean and parse
    {
      name: 'Clean and parse',
      parse: () => {
        // Remove common prefixes/suffixes
        let cleaned = responseText
          .replace(/^[^{]*/, '')     // Remove everything before first {
          .replace(/[^}]*$/, '')     // Remove everything after last }
          .replace(/\n+/g, ' ')      // Replace multiple newlines
          .replace(/\s+/g, ' ')      // Normalize whitespace
          .trim();
        
        return JSON.parse(cleaned);
      }
    },
    
    // Strategy 5: Extract JSON from conversational response
    {
      name: 'Extract from conversation',
      parse: () => {
        // Claude might say something like "Here's the JSON:" followed by the actual JSON
        const patterns = [
          /(?:here'?s?|this is|below is)[^{]*({[\s\S]*})/i,
          /json[^{]*({[\s\S]*})/i,
          /({[\s\S]*})/
        ];
        
        for (const pattern of patterns) {
          const match = responseText.match(pattern);
          if (match && match[1]) {
            return JSON.parse(match[1]);
          }
        }
        throw new Error('No JSON found in conversational response');
      }
    }
  ];
  
  for (const strategy of strategies) {
    try {
      const result = strategy.parse();
      logger.debug(`Successfully parsed with strategy: ${strategy.name}`);
      return result;
    } catch (error) {
      logger.debug(`Strategy "${strategy.name}" failed: ${error.message}`);
    }
  }
  
  logger.debug('All parsing strategies failed');
  return null;
}

// Validate the structure of the parsed JSON
function validateStyleJSON(json, logger) {
  const errors = [];
  
  // Check required top-level keys
  const requiredKeys = ['tokens', 'content', 'images', 'personality'];
  for (const key of requiredKeys) {
    if (!json[key]) {
      errors.push(`Missing required key: ${key}`);
    }
  }
  
  // Check tokens structure
  if (json.tokens) {
    if (!json.tokens.colors || !json.tokens.colors.primary) {
      errors.push('Missing tokens.colors.primary');
    }
    if (!json.tokens.fonts || !json.tokens.fonts.heading) {
      errors.push('Missing tokens.fonts.heading');
    }
  }
  
  // Check content structure
  if (json.content) {
    if (!json.content.hero || !json.content.hero.headline) {
      errors.push('Missing content.hero.headline');
    }
    if (!json.content.features || !Array.isArray(json.content.features)) {
      errors.push('content.features must be an array');
    }
  }
  
  // Check images structure
  if (json.images) {
    if (!json.images.hero || typeof json.images.hero !== 'string') {
      errors.push('Missing or invalid images.hero');
    }
  }
  
  // Check personality
  if (!Array.isArray(json.personality)) {
    errors.push('personality must be an array');
  }
  
  const isValid = errors.length === 0;
  
  if (!isValid) {
    logger.debug('Validation errors:', errors);
  }
  
  return { isValid, errors };
}

// Generate intelligent fallback based on style name and description
function generateIntelligentFallback(styleName, styleDescription, lastResponse, logger) {
  logger.info(`Generating intelligent fallback for ${styleName}`);
  
  // Extract any useful information from the last response
  const keywords = extractKeywords(styleDescription + ' ' + (lastResponse || ''));
  const colors = extractColors(lastResponse || '');
  
  // Generate style-specific content based on name and description
  const styleTemplates = {
    zen: {
      colors: { primary: '#6B7280', secondary: '#D4D4D8', accent: '#86EFAC', background: '#FAFAFA' },
      personality: ['minimal', 'calm', 'balanced', 'serene'],
      hero: { headline: 'Find Your Inner Peace', subheadline: 'Embrace simplicity and tranquility' }
    },
    techno: {
      colors: { primary: '#00FFFF', secondary: '#FF00FF', accent: '#FFFF00', background: '#000000' },
      personality: ['futuristic', 'digital', 'innovative', 'cutting-edge'],
      hero: { headline: 'Enter the Digital Future', subheadline: 'Where technology meets imagination' }
    },
    minimal: {
      colors: { primary: '#000000', secondary: '#666666', accent: '#0066CC', background: '#FFFFFF' },
      personality: ['clean', 'simple', 'focused', 'elegant'],
      hero: { headline: 'Less is More', subheadline: 'Beauty in simplicity' }
    }
  };
  
  // Find matching template or use default
  const template = styleTemplates[styleName] || {
    colors: { primary: colors[0] || '#007AFF', secondary: colors[1] || '#5856D6', accent: colors[2] || '#FF3B30', background: '#FFFFFF' },
    personality: keywords.slice(0, 4).length > 0 ? keywords.slice(0, 4) : ['modern', 'professional', 'innovative', 'accessible'],
    hero: { headline: 'Transform Your Vision', subheadline: 'Create something amazing' }
  };
  
  return {
    tokens: {
      colors: {
        ...template.colors,
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
        ...template.hero,
        cta: 'Get Started'
      },
      features: [
        { title: 'Innovative Design', description: `Experience the ${styleName} aesthetic` },
        { title: 'Perfect Balance', description: 'Harmonious blend of form and function' },
        { title: 'User Focused', description: 'Built with your needs in mind' }
      ],
      cta: {
        headline: 'Ready to Begin?',
        button: 'Start Now'
      },
      about: {
        headline: `The ${styleName} Philosophy`,
        description: styleDescription
      }
    },
    images: {
      hero: `${styleDescription} hero image with ${styleName} aesthetic. Vivid photorealistic style, 16:9 landscape, no text.`,
      features: `Icons and elements representing ${styleName} style. Vivid photorealistic style, 16:9 landscape, no text.`,
      cta: `Background gradient with ${styleName} atmosphere. Vivid photorealistic style, 16:9 landscape, no text.`
    },
    personality: template.personality
  };
}

function extractKeywords(text) {
  const commonWords = ['the', 'and', 'with', 'for', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did'];
  const words = text.toLowerCase().split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 10);
  return [...new Set(words)];
}

function extractColors(text) {
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = text.match(hexPattern) || [];
  return matches;
}

// Enhanced image generation with better error handling
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
      
      let success = false;
      let retries = 0;
      const maxRetries = 2;
      
      while (!success && retries < maxRetries) {
        try {
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
          
          generatedImages.push({
            type: imageData.type,
            filename: filename,
            path: `/generated-images/${filename}`,
            url: imageSrc,
            size: buffer.length
          });
          
          success = true;
          
        } catch (error) {
          retries++;
          logger.warning(`Image generation attempt ${retries} failed: ${error.message}`);
          if (retries < maxRetries) {
            await page.waitForTimeout(5000);
          }
        }
      }
      
      if (!success) {
        logger.error(`Failed to generate ${imageData.type} image after ${maxRetries} attempts`);
        failedImages.push({ type: imageData.type, error: 'Max retries exceeded' });
      }
      
      // Rate limiting
      await page.waitForTimeout(5000);
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

// Main generation function
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
    // Step 1: Generate style content with Claude (with retries and validation)
    logger.info('STEP 1: Generating style content with Claude');
    
    claudeClient = new ClaudeBrowserClient({ headless: false });
    await claudeClient.initialize();
    
    // Get style from Claude with enhanced retry logic
    styleData = await getStyleFromClaude(styleName, styleDescription, claudeClient, logger);
    
    logger.success('Style content generated and validated');
    
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
      version: '3.0'
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

// Update style registry
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
  tokens: any;
  content: any;
  images: any[];
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
`;
      
      fs.writeFileSync(registryPath, registryContent);
      logger.success('Created new style registry');
      
    } else {
      logger.info('Style registry already exists - manual update may be required');
    }
  } catch (error) {
    logger.error('Failed to update registry', { error: error.message });
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
🎨 STYLE GENERATOR v3.0
======================

Usage: node generate-complete-style-v3.js <style-name> <description> [options]

Examples:
  node generate-complete-style-v3.js "zen" "Minimalist Japanese aesthetic"
  node generate-complete-style-v3.js "cyber" "Neon cyberpunk with holographic effects" --verbose

Options:
  --verbose    Show detailed logging
  --help       Show this help message

Features v3:
  ✅ Claude retry with JSON correction
  ✅ Enhanced JSON parsing (5 strategies)
  ✅ JSON structure validation
  ✅ Intelligent style-aware fallbacks
  ✅ Better error recovery
  ✅ Image generation retries
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