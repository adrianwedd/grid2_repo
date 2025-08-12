// lib/claude-playwright.ts
// Playwright-based Claude browser automation (following ADHDo working pattern)

import { chromium, Browser, Page, BrowserContext } from 'playwright';

interface ClaudeSession {
  sessionKey: string;
  orgId?: string;
  userId?: string;
  cfBm?: string;
  activitySession?: string;
  deviceId?: string;
}

export class ClaudeBrowserClient {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private initialized = false;

  constructor(private session: ClaudeSession, private headless = true) {}

  async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Launching browser for Claude...');
      
      // Detect platform and use appropriate browser
      const platform = process.platform;
      const isLinux = platform === 'linux';
      const isMac = platform === 'darwin';
      const isWindows = platform === 'win32';
      
      // Check for Raspberry Pi or ARM Linux
      const isRaspberryPi = isLinux && (process.arch === 'arm' || process.arch === 'arm64');
      
      let browserOptions: any = {
        headless: this.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--disable-blink-features=AutomationControlled',
        ]
      };
      
      // CRITICAL for Raspberry Pi - use system Chromium
      if (isRaspberryPi) {
        console.log('🥧 Detected Raspberry Pi - using system Chromium');
        browserOptions.executablePath = '/usr/bin/chromium-browser';
        this.browser = await chromium.launch(browserOptions);
      } else if (isLinux) {
        // Try system Chromium first on Linux
        try {
          const fs = await import('fs');
          if (fs.existsSync('/usr/bin/chromium-browser')) {
            console.log('🐧 Using system Chromium on Linux');
            browserOptions.executablePath = '/usr/bin/chromium-browser';
            this.browser = await chromium.launch(browserOptions);
          } else {
            this.browser = await chromium.launch(browserOptions);
          }
        } catch {
          this.browser = await chromium.launch(browserOptions);
        }
      } else {
        // Use default Chromium on Mac/Windows
        this.browser = await chromium.launch(browserOptions);
      }

      // Create context with cookies
      this.context = await this.browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0',
        locale: 'en-US',
        timezoneId: 'America/New_York',
      });

      // Add all necessary Claude cookies
      const cookies = [
        {
          name: 'sessionKey',
          value: this.session.sessionKey,
          domain: '.claude.ai',
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'Lax' as const
        },
        {
          name: '__cf_bm',
          value: this.session.cfBm || 'dummy_cloudflare_token',
          domain: '.claude.ai',
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'None' as const
        }
      ];

      if (this.session.orgId) {
        cookies.push({
          name: 'lastActiveOrg',
          value: this.session.orgId,
          domain: '.claude.ai',
          path: '/',
          secure: true,
          sameSite: 'Lax' as const,
          httpOnly: false
        });
      }
      
      if (this.session.activitySession) {
        cookies.push({
          name: 'activitySessionId',
          value: this.session.activitySession,
          domain: 'claude.ai',
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'Lax' as const
        });
      }
      
      if (this.session.deviceId) {
        cookies.push({
          name: 'anthropic-device-id',
          value: this.session.deviceId,
          domain: 'claude.ai',
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'Lax' as const
        });
      }

      await this.context.addCookies(cookies);

      // Create page and navigate to Claude
      this.page = await this.context.newPage();
      
      // Enhanced anti-detection scripts
      await this.page.addInitScript(`
        // Remove webdriver flag
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined
        });
        
        // Mock chrome object properly
        window.chrome = {
          runtime: {},
          loadTimes: function() {},
          csi: function() {},
          app: {}
        };
        
        // Remove automation indicators
        delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
        delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
        delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
        
        // Mock permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
        );
        
        // Fix navigator.plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5]
        });
        
        // Fix navigator.languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en']
        });
      `);
      
      // First navigate to main page to establish cookies
      console.log('📍 Navigating to Claude.ai...');
      await this.page.goto('https://claude.ai', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Wait a bit for cookies to settle
      await this.page.waitForTimeout(2000);
      
      // Now navigate to chat
      await this.page.goto('https://claude.ai/new', {
        waitUntil: 'domcontentloaded', 
        timeout: 30000
      });

      // Check if we're authenticated
      const isAuthenticated = await this.checkAuthentication();
      if (!isAuthenticated) {
        throw new Error('Authentication failed - session may be expired');
      }

      this.initialized = true;
      console.log('✅ Claude browser client initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Claude browser:', error);
      await this.close();
      return false;
    }
  }

  private async checkAuthentication(): Promise<boolean> {
    if (!this.page) return false;
    
    try {
      // Wait a bit for page to load
      await this.page.waitForTimeout(3000);
      
      // Multiple strategies to check authentication (from ADHDo)
      const authIndicators = [
        '[contenteditable="true"]', // ProseMirror editor
        '.ProseMirror',
        'button[aria-label*="Send"]',
        'textarea[placeholder*="Message"]',
        '[data-testid="chat-input"]'
      ];
      
      for (const selector of authIndicators) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            console.log(`✅ Found auth indicator: ${selector}`);
            return true;
          }
        } catch {
          continue;
        }
      }
      
      // Check if we're redirected to login
      const url = this.page.url();
      if (url.includes('/login') || url.includes('/auth')) {
        console.log('❌ Redirected to login page');
        return false;
      }
      
      // Check for user greeting (most reliable from ADHDo experience)
      const pageText = await this.page.evaluate(() => document.body.innerText);
      if (pageText.includes('How was your day') || pageText.includes('How can I help')) {
        console.log('✅ Claude greeted us - authenticated!');
        return true;
      }
      
      console.log('⚠️ Could not verify authentication');
      // Take screenshot for debugging
      await this.takeScreenshot('auth-check-debug.png');
      
      // Be optimistic - try to continue anyway
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.initialized || !this.page) {
      throw new Error('Client not initialized');
    }

    try {
      console.log('💬 Sending message to Claude...');
      
      // Find the ProseMirror editor or contenteditable div
      const inputSelectors = [
        '[contenteditable="true"]',
        '[data-testid="chat-input"]',
        '.ProseMirror',
        'div.ProseMirror[contenteditable="true"]'
      ];
      
      let inputElement = null;
      for (const selector of inputSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          inputElement = await this.page.$(selector);
          if (inputElement) break;
        } catch {
          continue;
        }
      }
      
      if (!inputElement) {
        throw new Error('Could not find chat input');
      }

      // THE CRITICAL FIX FROM ADHDo - ProseMirror handling
      await inputElement.click();
      
      // MUST clear field properly for ProseMirror
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      
      // Type the message with delay (proven to work)
      await inputElement.type(message, { delay: 50 });
      
      // CRITICAL: Wait for send button to enable
      await this.page.waitForTimeout(1000);
      
      // Multiple strategies for finding send button
      const sendSelectors = [
        'button[aria-label*="Send"]',
        'button[aria-label*="send"]',
        '[data-testid="send-button"]',
        'button.text-text-500',
        'button svg circle',
        'button:has(svg)'
      ];
      
      let sent = false;
      for (const selector of sendSelectors) {
        try {
          const button = await this.page.$(selector);
          if (button) {
            const isVisible = await button.isVisible();
            const isDisabled = await button.isDisabled();
            if (isVisible && !isDisabled) {
              await button.click();
              sent = true;
              console.log('✅ Message sent via button click');
              break;
            }
          }
        } catch {
          continue;
        }
      }
      
      if (!sent) {
        // Fallback: try Enter or Ctrl+Enter
        console.log('⚠️ No send button found, trying keyboard shortcuts');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
        // If that didn't work, try Ctrl+Enter
        await this.page.keyboard.press('Control+Enter');
      }

      console.log('⏳ Waiting for Claude response...');
      
      // Wait for response to appear
      await this.page.waitForTimeout(3000); // Initial wait
      
      // Wait for Claude's response to complete (look for stop generating button to disappear)
      try {
        await this.page.waitForSelector('button[aria-label*="Stop"]', { 
          state: 'hidden',
          timeout: 30000 
        });
      } catch {
        // If no stop button found, just wait a bit more
        await this.page.waitForTimeout(5000);
      }

      // Extract the response
      const response = await this.extractResponse();
      console.log('✅ Got response from Claude');
      
      return response;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // Take screenshot for debugging if not headless
      if (!this.headless && this.page) {
        await this.page.screenshot({ path: 'claude-error.png' });
        console.log('📸 Screenshot saved to claude-error.png');
      }
      
      throw error;
    }
  }

  private async extractResponse(): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');

    // Multi-strategy extraction based on ADHDo working implementation
    const response = await this.page.evaluate(() => {
      // Strategy 1: Look for assistant message content (most reliable)
      const allMessages = document.querySelectorAll('.whitespace-normal.break-words, .whitespace-pre-wrap.break-words');
      
      if (allMessages.length > 0) {
        // Start from the end to find Claude's latest response
        for (let i = allMessages.length - 1; i >= 0; i--) {
          const msg = allMessages[i] as HTMLElement;
          const text = msg.innerText?.trim();
          
          // Skip if it's a user message, UI element, or too short
          if (text && 
              !text.includes('You are an AI Director') && // Skip our prompts
              !text.includes('Convert this request') &&
              !text.includes('IMPORTANT: Respond with ONLY') &&
              text.length > 10 &&
              !text.includes('Claude can make mistakes') &&
              !text.includes('Edit') &&
              !text.includes('Copy') &&
              !text.includes('Retry')) {
            return text;
          }
        }
      }
      
      // Strategy 2: Parse line by line after user message (fallback)
      const allText = document.body.innerText;
      const lines = allText.split('\n');
      
      let foundUserMessage = false;
      let responseLines: string[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Find where our message ends
        if (line.includes('User request:') || line.includes('Assistant:')) {
          foundUserMessage = true;
          responseLines = [];
          continue;
        }
        
        if (foundUserMessage && line.length > 10) {
          // Stop at UI elements that mark end of response
          if (line.includes('Claude can make mistakes') ||
              line.includes('Edit') ||
              line.includes('Copy') ||
              line.includes('Retry') ||
              line.includes('Send a message')) {
            break;
          }
          
          responseLines.push(line);
        }
      }
      
      if (responseLines.length > 0) {
        return responseLines.join(' ');
      }
      
      // Strategy 3: Look for JSON if expecting structured response
      const jsonMatch = allText.match(/\{[\s\S]*?"philosophy"[\s\S]*?\}/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
      
      // Strategy 4: Get any recent text that looks like a response
      const recentDivs = document.querySelectorAll('div');
      for (let i = recentDivs.length - 1; i >= Math.max(0, recentDivs.length - 20); i--) {
        const text = recentDivs[i].innerText?.trim();
        if (text && text.length > 50 && !text.includes('Send a message')) {
          return text;
        }
      }
      
      return 'Unable to extract response - check screenshot';
    });

    if (!response || response === 'Unable to extract response - check screenshot') {
      // Take a debug screenshot
      await this.takeScreenshot('claude-response-debug.png');
      throw new Error('Could not extract Claude response - screenshot saved');
    }

    return response;
  }

  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.initialized = false;
  }

  async takeScreenshot(path = 'claude-debug.png'): Promise<void> {
    if (this.page) {
      await this.page.screenshot({ path, fullPage: true });
      console.log(`📸 Screenshot saved to ${path}`);
    }
  }
}

// Singleton instance management
let clientInstance: ClaudeBrowserClient | null = null;

export async function getClaudeBrowserClient(
  session: ClaudeSession,
  headless = true
): Promise<ClaudeBrowserClient> {
  if (!clientInstance) {
    clientInstance = new ClaudeBrowserClient(session, headless);
    const success = await clientInstance.initialize();
    if (!success) {
      clientInstance = null;
      throw new Error('Failed to initialize Claude browser client');
    }
  }
  return clientInstance;
}

export async function closeClaudeBrowserClient(): Promise<void> {
  if (clientInstance) {
    await clientInstance.close();
    clientInstance = null;
  }
}

// Helper to generate design spec using Claude
export async function generateSpecWithClaudeBrowser(
  prompt: string,
  session: ClaudeSession
): Promise<any> {
  const systemPrompt = `You are an AI Director for a website builder. 
Convert this request into a JSON design specification.

IMPORTANT: Respond with ONLY valid JSON, no explanation or markdown.

The JSON structure should be:
{
  "philosophy": {
    "inspiration": "string describing the design philosophy",
    "principles": ["array", "of", "design", "principles"],
    "antipatterns": ["things", "to", "avoid"]
  },
  "style": {
    "personality": "brand personality description",
    "tone": "minimal" | "bold" | "playful" | "corporate",
    "colorScheme": "monochrome" | "vibrant" | "pastel" | "dark" | "brand-heavy",
    "spacing": { "value": "tight" | "normal" | "generous" },
    "typography": "sans" | "serif" | "mixed",
    "animations": "none" | "subtle" | "playful"
  },
  "experience": {
    "userJourney": "description of user flow",
    "keyInteractions": ["interaction", "patterns"],
    "emotionalGoals": ["emotional", "outcomes"]
  },
  "optimization": {
    "primaryGoal": "conversion" | "engagement" | "information",
    "successMetrics": ["metric1", "metric2"],
    "constraints": ["constraint1", "constraint2"]
  },
  "sections": [
    {
      "kind": "hero" | "features" | "testimonials" | "cta" | "footer",
      "variant": { "reasoning": "why this variant" },
      "priority": "critical" | "important" | "nice-to-have",
      "purpose": "what this section achieves",
      "visual": {
        "imagery": "none" | "product" | "abstract" | "people",
        "layout": "centered" | "asymmetric" | "split",
        "emphasis": "content" | "visual" | "balanced"
      }
    }
  ]
}

User request: "${prompt}"`;

  const client = await getClaudeBrowserClient(session);
  const response = await client.sendMessage(systemPrompt);
  
  // Try to extract JSON from the response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse Claude response as JSON:', e);
      throw new Error('Invalid JSON in Claude response');
    }
  }
  
  throw new Error('No JSON found in Claude response');
}