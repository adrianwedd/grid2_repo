#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';

console.log('🔌 Connecting to existing Chrome via debugging port...\n');

async function connectToChrome() {
  console.log('📝 Instructions:');
  console.log('1. Close Chrome completely');
  console.log('2. Open Terminal and run:');
  console.log('   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
  console.log('3. Once Chrome opens, run this script again in a new terminal\n');
  
  try {
    // Try to connect to existing Chrome
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('✅ Connected to Chrome!');
    
    const contexts = browser.contexts();
    console.log(`Found ${contexts.length} contexts`);
    
    // Get the default context
    const context = contexts[0] || await browser.newContext();
    
    // Get all pages
    const pages = context.pages();
    console.log(`Found ${pages.length} existing tabs\n`);
    
    // Look for ChatGPT or Claude tabs
    let chatgptPage = null;
    let claudePage = null;
    
    for (const page of pages) {
      const url = page.url();
      if (url.includes('chatgpt.com')) {
        chatgptPage = page;
        console.log('✅ Found ChatGPT tab');
      }
      if (url.includes('claude.ai')) {
        claudePage = page;
        console.log('✅ Found Claude tab');
      }
    }
    
    // Open tabs if not found
    if (!chatgptPage) {
      console.log('📍 Opening ChatGPT...');
      chatgptPage = await context.newPage();
      await chatgptPage.goto('https://chatgpt.com');
      await chatgptPage.waitForTimeout(3000);
    }
    
    if (!claudePage) {
      console.log('📍 Opening Claude...');
      claudePage = await context.newPage();
      await claudePage.goto('https://claude.ai');
      await claudePage.waitForTimeout(3000);
    }
    
    console.log('\n📦 Capturing cookies...\n');
    
    // Get cookies from both sites
    const chatgptCookies = await context.cookies('https://chatgpt.com');
    const claudeCookies = await context.cookies('https://claude.ai');
    
    console.log(`Found ${chatgptCookies.length} ChatGPT cookies`);
    console.log(`Found ${claudeCookies.length} Claude cookies`);
    
    // Find session tokens
    const chatgptSession = chatgptCookies.find(c => 
      c.name === '__Secure-next-auth.session-token'
    );
    
    const claudeSession = claudeCookies.find(c =>
      c.name.includes('session') || 
      c.name === 'activitySessionId'
    );
    
    // Format cookies for .env
    const formatCookies = (cookies) => cookies.map((cookie, idx) => ({
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
      id: idx + 1
    }));
    
    let envContent = `# Captured from Chrome debug session - ${new Date().toISOString()}\n\n`;
    
    if (chatgptSession) {
      console.log('\n✅ ChatGPT session found!');
      envContent += `CHATGPT_SESSION_TOKEN=${chatgptSession.value}\n\n`;
      envContent += `CHATGPT_COOKIES=${JSON.stringify(formatCookies(chatgptCookies))}\n\n`;
    } else {
      console.log('\n⚠️ No ChatGPT session - please log in');
    }
    
    if (claudeSession) {
      console.log('✅ Claude session found!');
      envContent += `CLAUDE_SESSION_KEY=${claudeSession.value}\n\n`;
    } else {
      console.log('⚠️ No Claude session - please log in');
    }
    
    // Save cookies
    fs.writeFileSync('chrome-debug-cookies.env', envContent);
    console.log('\n💾 Saved to: chrome-debug-cookies.env');
    console.log('📋 Update your .env.local with these values');
    
    await browser.close();
    
  } catch (error) {
    if (error.message.includes('connect ECONNREFUSED')) {
      console.log('❌ Could not connect to Chrome debugging port');
      console.log('\nPlease follow the instructions above to start Chrome with debugging enabled');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

connectToChrome().catch(console.error);