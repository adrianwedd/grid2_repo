#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';

console.log('🔌 Connecting to your existing Chrome browser session...\n');

async function useExistingChrome() {
  try {
    // Find Chrome user data directory based on OS
    let userDataDir;
    const platform = os.platform();
    
    if (platform === 'darwin') {
      // macOS
      userDataDir = path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome');
    } else if (platform === 'win32') {
      // Windows
      userDataDir = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
    } else {
      // Linux
      userDataDir = path.join(os.homedir(), '.config', 'google-chrome');
    }
    
    console.log('📁 Chrome profile directory:', userDataDir);
    
    // Launch Chrome with existing user data
    const browser = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      channel: 'chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ],
      ignoreDefaultArgs: ['--enable-automation']
    });
    
    console.log('✅ Connected to existing Chrome session!\n');
    
    // Open new tab for ChatGPT
    console.log('📍 Opening ChatGPT tab...');
    const chatgptPage = await browser.newPage();
    await chatgptPage.goto('https://chatgpt.com');
    await chatgptPage.waitForTimeout(3000);
    
    // Check if logged in to ChatGPT
    const chatgptLoggedIn = await chatgptPage.evaluate(() => {
      return document.querySelector('[data-testid="profile-button"]') !== null ||
             document.querySelector('button[aria-label*="User"]') !== null ||
             document.querySelector('button[aria-label*="Send"]') !== null;
    });
    
    if (chatgptLoggedIn) {
      console.log('✅ Already logged in to ChatGPT!');
    } else {
      console.log('⚠️ Not logged in to ChatGPT');
    }
    
    // Open new tab for Claude
    console.log('\n📍 Opening Claude tab...');
    const claudePage = await browser.newPage();
    await claudePage.goto('https://claude.ai');
    await claudePage.waitForTimeout(3000);
    
    // Check if logged in to Claude
    const claudeLoggedIn = await claudePage.evaluate(() => {
      return document.querySelector('[data-testid="composer-input"]') !== null ||
             document.querySelector('.ProseMirror') !== null ||
             document.querySelector('[contenteditable="true"]') !== null;
    });
    
    if (claudeLoggedIn) {
      console.log('✅ Already logged in to Claude!');
    } else {
      console.log('⚠️ Not logged in to Claude');
    }
    
    console.log('\n📝 Capturing cookies from your logged-in sessions...\n');
    
    // Get all cookies
    const allCookies = await browser.cookies();
    
    // Filter ChatGPT cookies
    const chatgptCookies = allCookies.filter(c => 
      c.domain.includes('chatgpt.com') || 
      c.domain.includes('openai.com')
    );
    
    // Filter Claude cookies  
    const claudeCookies = allCookies.filter(c =>
      c.domain.includes('claude.ai') ||
      c.domain.includes('anthropic.com')
    );
    
    console.log(`📦 Found ${chatgptCookies.length} ChatGPT cookies`);
    console.log(`📦 Found ${claudeCookies.length} Claude cookies`);
    
    // Find session tokens
    const chatgptSession = chatgptCookies.find(c => 
      c.name === '__Secure-next-auth.session-token'
    );
    
    const claudeSession = claudeCookies.find(c =>
      c.name === 'sessionKey' || 
      c.name.includes('session') ||
      c.name === 'activitySessionId'
    );
    
    // Convert to Chrome extension format
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
    
    // Create env content
    let envContent = `# Captured from existing Chrome session - ${new Date().toISOString()}\n\n`;
    
    if (chatgptSession) {
      console.log('\n✅ ChatGPT session token found!');
      envContent += `# ChatGPT Authentication\n`;
      envContent += `CHATGPT_SESSION_TOKEN=${chatgptSession.value}\n\n`;
      envContent += `CHATGPT_COOKIES=${JSON.stringify(formatCookies(chatgptCookies))}\n\n`;
    } else {
      console.log('\n⚠️ No ChatGPT session token found');
    }
    
    if (claudeSession) {
      console.log('✅ Claude session found!');
      envContent += `# Claude Authentication\n`;
      envContent += `CLAUDE_SESSION_KEY=${claudeSession.value}\n\n`;
      
      // Add other Claude cookies as separate env vars
      const cfBm = claudeCookies.find(c => c.name === '__cf_bm');
      const activitySession = claudeCookies.find(c => c.name === 'activitySessionId');
      
      if (cfBm) {
        envContent += `CLAUDE_CF_BM=${cfBm.value}\n`;
      }
      if (activitySession) {
        envContent += `CLAUDE_ACTIVITY_SESSION=${activitySession.value}\n`;
      }
    } else {
      console.log('⚠️ No Claude session found');
    }
    
    // Save to file
    fs.writeFileSync('chrome-session-cookies.env', envContent);
    console.log('\n💾 Saved to: chrome-session-cookies.env');
    console.log('📋 Copy the contents to your .env.local file\n');
    
    // Show summary
    console.log('🍪 Cookie Summary:');
    console.log('=================');
    console.log(`ChatGPT: ${chatgptSession ? '✅ Logged in' : '❌ Not logged in'} (${chatgptCookies.length} cookies)`);
    console.log(`Claude:  ${claudeSession ? '✅ Logged in' : '❌ Not logged in'} (${claudeCookies.length} cookies)`);
    
    console.log('\n✅ Done! You can close the browser tabs.');
    
    // Keep browser open for inspection
    console.log('\nPress Ctrl+C to close the browser...');
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tip: Make sure Chrome is not running before running this script');
    console.log('   Or try closing Chrome and running this script immediately');
  }
}

useExistingChrome().catch(console.error);