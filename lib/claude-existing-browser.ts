// lib/claude-existing-browser.ts
// Connect to existing Chrome browser with active Claude session

import { chromium, Browser, Page, BrowserContext } from 'playwright';

export class ClaudeExistingBrowserClient {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private initialized = false;

  constructor(private debugPort: number = 9222) {}

  async initialize(): Promise<boolean> {
    try {
      console.log('🔌 Connecting to existing Chrome browser...');
      
      // Connect to existing Chrome instance
      // User needs to start Chrome with: --remote-debugging-port=9222
      this.browser = await chromium.connectOverCDP(`http://localhost:${this.debugPort}`);
      
      console.log('✅ Connected to existing Chrome');
      
      // Get existing contexts (browser windows/profiles)
      const contexts = this.browser.contexts();
      
      if (contexts.length > 0) {
        // Use the first available context
        this.context = contexts[0];
        console.log(`📱 Using existing context with ${this.context.pages().length} pages`);
      } else {
        // Create a new context if none exist
        this.context = await this.browser.newContext({
          viewport: { width: 1920, height: 1080 },
        });
        console.log('📱 Created new context');
      }

      // Look for existing Claude tab or create new one
      const pages = this.context.pages();
      let claudePage = null;
      
      for (const page of pages) {
        const url = page.url();
        if (url.includes('claude.ai')) {
          claudePage = page;
          console.log('✅ Found existing Claude tab');
          break;
        }
      }
      
      if (claudePage) {
        this.page = claudePage;
        // Make sure we're on the chat page
        if (!this.page.url().includes('/chat') && !this.page.url().includes('/new')) {
          await this.page.goto('https://claude.ai/new', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
          });
        }
      } else {
        // Open new tab with Claude
        this.page = await this.context.newPage();
        console.log('📍 Opening Claude in new tab...');
        await this.page.goto('https://claude.ai/new', {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });
      }
      
      // Wait for page to stabilize
      await this.page.waitForTimeout(2000);
      
      // Check if we're authenticated
      const isAuthenticated = await this.checkAuthentication();
      if (!isAuthenticated) {
        console.log('⚠️ Not authenticated - please log in to Claude in your browser');
        throw new Error('Please log in to Claude in your browser first');
      }

      this.initialized = true;
      console.log('✅ Claude existing browser client initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to existing browser:', error);
      console.log('\n📝 To use existing browser connection:');
      console.log('1. Close all Chrome instances');
      console.log('2. Start Chrome with remote debugging:');
      console.log('   Mac: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
      console.log('   Windows: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222');
      console.log('   Linux: google-chrome --remote-debugging-port=9222');
      console.log('3. Log in to Claude.ai');
      console.log('4. Run this application again\n');
      await this.close();
      return false;
    }
  }

  private async checkAuthentication(): Promise<boolean> {
    if (!this.page) return false;
    
    try {
      // Wait for potential redirects
      await this.page.waitForTimeout(3000);
      
      // Multiple strategies to check authentication
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
      
      // Check URL
      const url = this.page.url();
      if (url.includes('/login') || url.includes('/auth')) {
        console.log('❌ On login page - not authenticated');
        return false;
      }
      
      // Check for Claude greeting
      const pageText = await this.page.evaluate(() => document.body.innerText);
      if (pageText.includes('How can I help') || pageText.includes('What would you like')) {
        console.log('✅ Claude is ready - authenticated!');
        return true;
      }
      
      console.log('⚠️ Could not verify authentication status');
      // Be optimistic if we can't tell
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
      
      // Clear any existing conversation first (optional)
      // await this.clearConversation();
      
      // Find the ProseMirror editor
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

      // CRITICAL: ProseMirror handling from ADHDo
      await inputElement.click();
      
      // Clear field properly
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      
      // Type the message with delay
      await inputElement.type(message, { delay: 50 });
      
      // Wait for send button to enable
      await this.page.waitForTimeout(1000);
      
      // Find and click send button
      const sendSelectors = [
        'button[aria-label*="Send"]',
        'button[aria-label*="send"]',
        '[data-testid="send-button"]',
        'button.text-text-500',
        'button:has(svg circle)'
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
        // Try keyboard shortcut
        console.log('⚠️ No send button found, trying Enter');
        await this.page.keyboard.press('Enter');
      }

      console.log('⏳ Waiting for Claude response...');
      
      // Wait for response
      await this.page.waitForTimeout(3000);
      
      // Wait for response to complete
      try {
        await this.page.waitForSelector('button[aria-label*="Stop"]', { 
          state: 'hidden',
          timeout: 30000 
        });
      } catch {
        await this.page.waitForTimeout(5000);
      }

      // Extract response
      const response = await this.extractResponse();
      console.log('✅ Got response from Claude');
      
      return response;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  private async extractResponse(): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');

    // Multi-strategy extraction from ADHDo
    const response = await this.page.evaluate(() => {
      // Look for assistant messages
      const allMessages = document.querySelectorAll('.whitespace-normal.break-words, .whitespace-pre-wrap.break-words');
      
      if (allMessages.length > 0) {
        for (let i = allMessages.length - 1; i >= 0; i--) {
          const msg = allMessages[i] as HTMLElement;
          const text = msg.innerText?.trim();
          
          // Skip user messages and UI elements
          if (text && 
              !text.includes('You are an AI Director') &&
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
      
      // Look for JSON if expecting structured response
      const allText = document.body.innerText;
      const jsonMatch = allText.match(/\{[\s\S]*?"philosophy"[\s\S]*?\}/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
      
      return 'Unable to extract response';
    });

    if (!response || response === 'Unable to extract response') {
      throw new Error('Could not extract Claude response');
    }

    return response;
  }

  private async clearConversation(): Promise<void> {
    // Optional: Clear existing conversation for fresh start
    try {
      // Look for new chat button
      const newChatSelectors = [
        'button[aria-label*="New chat"]',
        'button[aria-label*="new chat"]',
        'a[href="/new"]'
      ];
      
      for (const selector of newChatSelectors) {
        const button = await this.page?.$(selector);
        if (button) {
          await button.click();
          await this.page?.waitForTimeout(2000);
          console.log('✅ Started new conversation');
          break;
        }
      }
    } catch {
      // Not critical if we can't clear
    }
  }

  async close(): Promise<void> {
    // Don't close the browser since it's the user's session
    // Just clean up references
    this.page = null;
    this.context = null;
    this.browser = null;
    this.initialized = false;
    console.log('🔌 Disconnected from browser (keeping it open)');
  }
}

// Helper to use existing browser
export async function generateSpecWithExistingBrowser(
  prompt: string,
  debugPort = 9222
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

  const client = new ClaudeExistingBrowserClient(debugPort);
  const initialized = await client.initialize();
  
  if (!initialized) {
    throw new Error('Failed to connect to existing browser');
  }
  
  try {
    const response = await client.sendMessage(systemPrompt);
    
    // Extract JSON from response
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
  } finally {
    await client.close();
  }
}