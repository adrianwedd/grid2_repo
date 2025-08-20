#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';

console.log('🥷 Opening ChatGPT with stealth mode\n');

async function openChatGPTStealth() {
  // Launch with stealth settings
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
      '--start-maximized',
      '--window-size=1920,1080',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'America/New_York',
    permissions: ['geolocation', 'notifications'],
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    }
  });
  
  // Add stealth scripts to avoid detection
  await context.addInitScript(() => {
    // Override navigator.webdriver
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });
    
    // Override navigator.plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        {
          0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format"},
          description: "Portable Document Format", 
          filename: "internal-pdf-viewer", 
          length: 1, 
          name: "Chrome PDF Plugin"
        }
      ]
    });
    
    // Override navigator.languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en']
    });
    
    // Override Permissions API
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
    
    // Override chrome runtime
    window.chrome = {
      runtime: {},
      loadTimes: function() {},
      csi: function() {}
    };
    
    // Remove automation indicators
    delete window.__playwright;
    delete window.__pw_manual;
    delete window.Buffer;
  });
  
  const page = await context.newPage();
  
  // Random delay to seem more human
  await page.waitForTimeout(Math.random() * 2000 + 1000);
  
  console.log('📍 Navigating to ChatGPT (stealth mode)...');
  
  // Navigate slowly like a human
  await page.goto('https://chatgpt.com', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  
  // Wait for Cloudflare check
  console.log('⏳ Waiting for Cloudflare check...');
  await page.waitForTimeout(5000);
  
  // Check if we passed Cloudflare
  const title = await page.title();
  console.log('📄 Page title:', title);
  
  if (title.includes('Just a moment') || title.includes('Cloudflare')) {
    console.log('🛡️ Cloudflare detected, waiting...');
    await page.waitForTimeout(10000);
  }
  
  console.log('\n📝 Instructions:');
  console.log('1. If you see Cloudflare, complete the challenge');
  console.log('2. Log in to ChatGPT manually');
  console.log('3. Once fully logged in, press Enter here');
  console.log('4. I will capture the cookies\n');
  
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
    
    // Convert to Chrome extension format
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
CHATGPT_SESSION_TOKEN=${sessionCookie.value}

CHATGPT_COOKIES=${JSON.stringify(chromeFormatCookies)}
`;
    
    // Save to file
    fs.writeFileSync('chatgpt-new-cookies.env', envContent);
    console.log('💾 Saved to: chatgpt-new-cookies.env');
    console.log('📋 Update your .env.local with these values');
    
    // Show summary
    console.log('\n🔐 Session Token:');
    console.log(sessionCookie.value.substring(0, 50) + '...');
    
    const expiryDate = sessionCookie.expires === -1 ? 
      'Session cookie' : 
      new Date(sessionCookie.expires * 1000).toLocaleDateString();
    console.log(`📅 Expires: ${expiryDate}`);
    
    // Count important cookies
    const cfBm = chatgptCookies.find(c => c.name === '__cf_bm');
    const cfuvid = chatgptCookies.find(c => c.name === '_cfuvid');
    
    console.log('\n🍪 Cookie Summary:');
    console.log(`  Session: ${sessionCookie ? '✓' : '✗'}`);
    console.log(`  Cloudflare BM: ${cfBm ? '✓' : '✗'}`);
    console.log(`  Cloudflare UVID: ${cfuvid ? '✓' : '✗'}`);
    console.log(`  Total: ${chatgptCookies.length} cookies`);
    
  } else {
    console.log('⚠️ No session token found - make sure you are logged in');
    console.log('Found cookies:', chatgptCookies.map(c => c.name).join(', '));
  }
  
  await browser.close();
  console.log('\n✅ Done!');
}

openChatGPTStealth().catch(console.error);