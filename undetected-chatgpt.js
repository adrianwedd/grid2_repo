#!/usr/bin/env node

import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

// Use stealth plugin (works with playwright-extra too)
chromium.use(StealthPlugin());

console.log('🥷 Launching undetected browser for ChatGPT\n');

async function openUndetected() {
  // Launch with all stealth settings
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=site-per-process',
      '--disable-infobars',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--no-sandbox',
      '--no-zygote',
      '--window-size=1920,1080',
      '--start-maximized'
    ],
    ignoreDefaultArgs: ['--enable-automation'],
    executablePath: process.platform === 'darwin' 
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : undefined
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    screen: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'America/New_York',
    geolocation: { longitude: -73.935242, latitude: 40.730610 },
    permissions: ['geolocation'],
    colorScheme: 'light',
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false
  });

  // Additional stealth measures
  await context.addInitScript(() => {
    // More comprehensive webdriver hiding
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });

    // Mock plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        {
          0: {
            type: 'application/x-google-chrome-pdf',
            suffixes: 'pdf',
            description: 'Portable Document Format',
            enabledPlugin: Plugin
          },
          description: 'Portable Document Format',
          filename: 'internal-pdf-viewer',
          length: 1,
          name: 'Chrome PDF Plugin'
        },
        {
          0: {
            type: 'application/x-nacl',
            suffixes: '',
            description: 'Native Client Executable',
            enabledPlugin: Plugin
          },
          1: {
            type: 'application/x-pnacl',
            suffixes: '',
            description: 'Portable Native Client Executable',
            enabledPlugin: Plugin
          },
          description: '',
          filename: 'internal-nacl-plugin',
          length: 2,
          name: 'Native Client'
        }
      ],
    });

    // Mock chrome object
    window.chrome = {
      runtime: {
        connect: () => {},
        sendMessage: () => {},
        onMessage: { addListener: () => {} }
      },
      loadTimes: function() {
        return {
          commitLoadTime: Date.now() / 1000,
          connectionInfo: 'h2',
          finishDocumentLoadTime: Date.now() / 1000,
          finishLoadTime: Date.now() / 1000,
          firstPaintAfterLoadTime: 0,
          firstPaintTime: Date.now() / 1000,
          navigationType: 'Other',
          npnNegotiatedProtocol: 'h2',
          requestTime: Date.now() / 1000,
          startLoadTime: Date.now() / 1000,
          wasAlternateProtocolAvailable: false,
          wasFetchedViaSpdy: true,
          wasNpnNegotiated: true
        };
      },
      csi: function() {
        return {
          onloadT: Date.now(),
          pageT: Date.now() - Date.now(),
          startE: Date.now(),
          tran: 15
        };
      },
      app: {
        isInstalled: false,
        getDetails: () => null,
        getIsInstalled: () => false,
        installState: () => 'not_installed',
        runningState: () => 'not_running'
      }
    };

    // Mock permissions
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);

    // Mock languages properly
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });

    // Mock hardware concurrency
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      get: () => 8,
    });

    // Mock device memory
    Object.defineProperty(navigator, 'deviceMemory', {
      get: () => 8,
    });

    // Remove Playwright/Puppeteer traces
    delete window.__playwright;
    delete window.__puppeteer_utility_script__;
    delete window.__PW_inspect;
    delete window.Buffer;
  });

  const page = await context.newPage();
  
  // Human-like behavior: random initial wait
  await page.waitForTimeout(Math.random() * 3000 + 2000);
  
  console.log('📍 Navigating to ChatGPT...');
  await page.goto('https://chatgpt.com', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Wait for potential Cloudflare challenge
  console.log('⏳ Waiting for page to fully load...');
  await page.waitForTimeout(5000);

  const title = await page.title();
  console.log('📄 Page title:', title);

  if (title.includes('Just a moment') || title.includes('Cloudflare')) {
    console.log('🛡️ Cloudflare challenge detected');
    console.log('⏳ Waiting for automatic resolution...');
    
    // Wait for Cloudflare to resolve
    await page.waitForFunction(
      () => !document.title.includes('Just a moment'),
      { timeout: 30000 }
    ).catch(() => {
      console.log('⚠️ Cloudflare challenge taking longer than expected');
    });
  }

  console.log('\n✅ Browser ready!');
  console.log('\n📝 Instructions:');
  console.log('1. Log in to ChatGPT manually');
  console.log('2. Once fully logged in, press Enter here');
  console.log('3. I will capture the fresh cookies\n');

  // Wait for user input
  await new Promise((resolve) => {
    process.stdin.once('data', resolve);
  });

  console.log('\n✅ Capturing cookies...');
  
  // Get all cookies
  const cookies = await context.cookies();
  
  // Filter ChatGPT cookies
  const chatgptCookies = cookies.filter(c => 
    c.domain.includes('chatgpt.com') || 
    c.domain.includes('openai.com')
  );
  
  console.log(`📦 Captured ${chatgptCookies.length} cookies`);
  
  // Find session token
  const sessionCookie = chatgptCookies.find(c => 
    c.name === '__Secure-next-auth.session-token'
  );
  
  if (sessionCookie) {
    console.log('✅ Session token found!\n');
    
    // Convert to Chrome extension format for compatibility
    const chromeFormatCookies = chatgptCookies.map(cookie => ({
      domain: cookie.domain,
      expirationDate: cookie.expires === -1 ? undefined : cookie.expires,
      hostOnly: !cookie.domain.startsWith('.'),
      httpOnly: cookie.httpOnly,
      name: cookie.name,
      path: cookie.path,
      sameSite: cookie.sameSite === 'None' ? 'no_restriction' : 
                cookie.sameSite === 'Lax' ? 'lax' : 
                cookie.sameSite === 'Strict' ? 'strict' : 'lax',
      secure: cookie.secure,
      session: cookie.expires === -1,
      storeId: "0",
      value: cookie.value,
      id: chatgptCookies.indexOf(cookie) + 1
    }));
    
    // Format for .env.local
    const envContent = `# ChatGPT Authentication - ${new Date().toISOString()}
# Captured with undetected browser
CHATGPT_SESSION_TOKEN=${sessionCookie.value}

CHATGPT_COOKIES=${JSON.stringify(chromeFormatCookies)}
`;
    
    // Save to file
    fs.writeFileSync('chatgpt-new-cookies.env', envContent);
    console.log('💾 Saved to: chatgpt-new-cookies.env');
    console.log('\n📋 To update your .env.local:');
    console.log('1. Copy the contents of chatgpt-new-cookies.env');
    console.log('2. Replace the existing CHATGPT_* variables in .env.local');
    
    // Show summary
    const cfBm = chatgptCookies.find(c => c.name === '__cf_bm');
    const cfuvid = chatgptCookies.find(c => c.name === '_cfuvid');
    
    console.log('\n🍪 Cookie Summary:');
    console.log(`  Session Token: ✓`);
    console.log(`  Cloudflare BM: ${cfBm ? '✓' : '✗'}`);
    console.log(`  Cloudflare UVID: ${cfuvid ? '✓' : '✗'}`);
    console.log(`  Total Cookies: ${chatgptCookies.length}`);
    
    const expiryDate = sessionCookie.expires === -1 ? 
      'Session cookie' : 
      new Date(sessionCookie.expires * 1000).toLocaleDateString();
    console.log(`  Expires: ${expiryDate}`);
    
  } else {
    console.log('⚠️ No session token found');
    console.log('Available cookies:', chatgptCookies.map(c => c.name).join(', '));
  }
  
  await browser.close();
  console.log('\n✅ Done!');
}

openUndetected().catch(console.error);