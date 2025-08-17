import { chromium, Browser, Page } from 'playwright';

interface ImageGenerationOptions {
  prompt: string;
  style?: 'vivid' | 'natural';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export class ChatGPTImageGenerator {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isInitialized = false;

  async initialize(cookies?: any[]) {
    if (this.isInitialized) return;

    console.log('Initializing ChatGPT browser...');
    this.browser = await chromium.launch({
      headless: false, // Set to true in production
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await this.browser.newContext();
    
    // Add cookies if provided
    if (cookies && cookies.length > 0) {
      console.log(`Adding ${cookies.length} cookies to browser context...`);
      await context.addCookies(cookies.map(cookie => {
        const playwrightCookie: any = {
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path || '/',
          httpOnly: cookie.httpOnly || false,
          secure: cookie.secure || false,
          sameSite: (() => {
            if (cookie.sameSite === 'no_restriction') return 'None';
            if (cookie.sameSite === 'lax') return 'Lax';
            if (cookie.sameSite === 'strict') return 'Strict';
            return 'Lax';
          })() as 'Strict' | 'Lax' | 'None'
        };
        
        // Add expires if present
        if (cookie.expirationDate && !cookie.session) {
          playwrightCookie.expires = cookie.expirationDate;
        }
        
        return playwrightCookie;
      }));
      console.log('✅ All cookies added to browser context');
    }

    this.page = await context.newPage();
    
    // Navigate to ChatGPT
    await this.page.goto('https://chatgpt.com');
    await this.page.waitForTimeout(3000);

    // Check if logged in
    const isLoggedIn = await this.page.locator('[data-testid="composer-root"]').count() > 0;
    
    if (!isLoggedIn) {
      console.log('Please log in to ChatGPT manually...');
      // Wait for manual login
      await this.page.waitForSelector('[data-testid="composer-root"]', { timeout: 120000 });
    }

    this.isInitialized = true;
    console.log('ChatGPT browser initialized');
  }

  async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    if (!this.page) {
      throw new Error('ChatGPT browser not initialized');
    }

    const { prompt, style = 'vivid', size = '1024x1024' } = options;

    console.log(`Generating image: "${prompt.substring(0, 50)}..."`);

    // Start a new chat
    await this.page.goto('https://chatgpt.com');
    await this.page.waitForTimeout(2000);

    // Type the image generation prompt
    const composer = this.page.locator('[data-testid="composer-root"] .ProseMirror');
    await composer.click();
    await composer.fill(`Generate an image: ${prompt}\n\nStyle: ${style}\nSize: ${size}`);

    // Send the message
    await this.page.locator('[data-testid="send-button"]').click();

    // Wait for image generation (this can take 10-30 seconds)
    console.log('Waiting for image generation...');
    const imageLocator = this.page.locator('img[src*="oaidalleapiprodscus.blob.core.windows.net"]');
    
    try {
      await imageLocator.waitFor({ timeout: 60000 });
      
      // Get the image URL
      const imageUrl = await imageLocator.getAttribute('src');
      
      if (!imageUrl) {
        throw new Error('Failed to get image URL');
      }

      console.log('Image generated successfully');
      
      return {
        url: imageUrl,
        prompt,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Image generation failed:', error);
      throw error;
    }
  }

  async generateBulkImages(prompts: string[]): Promise<GeneratedImage[]> {
    const results: GeneratedImage[] = [];
    
    for (const prompt of prompts) {
      try {
        const image = await this.generateImage({ prompt });
        results.push(image);
        
        // Wait between requests to avoid rate limiting
        await this.page?.waitForTimeout(3000);
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
      }
    }
    
    return results;
  }

  async downloadImage(imageUrl: string, savePath: string): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');

    const response = await this.page.context().request.get(imageUrl);
    const buffer = await response.body();
    
    const fs = await import('fs');
    await fs.promises.writeFile(savePath, buffer);
    
    console.log(`Image saved to ${savePath}`);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isInitialized = false;
    }
  }
}

// Usage example
export async function generateImagesForSections(sections: any[]): Promise<Map<string, string>> {
  const generator = new ChatGPTImageGenerator();
  const imageMap = new Map<string, string>();

  try {
    // Initialize with your ChatGPT cookies
    await generator.initialize();

    for (const section of sections) {
      // Generate contextual prompts based on section type and content
      const prompt = generatePromptForSection(section);
      
      if (prompt) {
        const image = await generator.generateImage({ 
          prompt,
          style: 'vivid',
          size: '1792x1024' // Wide format for hero sections
        });
        
        imageMap.set(section.id, image.url);
      }
    }
  } finally {
    await generator.close();
  }

  return imageMap;
}

function generatePromptForSection(section: any): string | null {
  const { kind, props } = section;
  
  // Generate prompts based on section type
  switch (kind) {
    case 'hero':
      return `Professional hero image for ${props.title || 'modern website'}. ${props.subtitle || ''}. High quality, modern, engaging.`;
    
    case 'features':
      return `Clean, modern illustration showing ${props.features?.length || 3} features or benefits. Professional, minimalist style.`;
    
    case 'about':
      return `Professional team or company photo. Modern office or workspace. Authentic, welcoming atmosphere.`;
    
    case 'testimonials':
      return `Happy customers or clients. Professional headshots or lifestyle photos. Diverse, authentic people.`;
    
    default:
      return null;
  }
}