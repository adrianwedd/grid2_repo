#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';

console.log('🔌 Connecting to Chrome debug port...\n');

async function captureCookies() {
  try {
    // Connect to the running Chrome instance (use 127.0.0.1 to avoid IPv6 issues)
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    console.log('✅ Connected to Chrome!\n');
    
    // Get all browser contexts
    const contexts = browser.contexts();
    const context = contexts[0];
    
    if (!context) {
      console.log('❌ No browser context found');
      return;
    }
    
    // Get all pages
    const pages = context.pages();
    console.log(`📄 Found ${pages.length} open tabs\n`);
    
    // Open ChatGPT if not already open
    let chatgptPage = pages.find(p => p.url().includes('chatgpt.com'));
    if (!chatgptPage) {
      console.log('📍 Opening ChatGPT...');
      chatgptPage = await context.newPage();
      await chatgptPage.goto('https://chatgpt.com');
      await chatgptPage.waitForTimeout(3000);
    } else {
      console.log('✅ ChatGPT tab found');
    }
    
    // Open Claude if not already open
    let claudePage = pages.find(p => p.url().includes('claude.ai'));
    if (!claudePage) {
      console.log('📍 Opening Claude...');
      claudePage = await context.newPage();
      await claudePage.goto('https://claude.ai');
      await claudePage.waitForTimeout(3000);
    } else {
      console.log('✅ Claude tab found');
    }
    
    console.log('\n🍪 Capturing cookies...\n');
    
    // Get cookies from both domains
    const allCookies = await context.cookies();
    
    // Filter cookies
    const chatgptCookies = allCookies.filter(c => 
      c.domain.includes('chatgpt.com') || c.domain.includes('openai.com')
    );
    
    const claudeCookies = allCookies.filter(c => 
      c.domain.includes('claude.ai') || c.domain.includes('anthropic.com')
    );
    
    console.log(`📦 Found ${chatgptCookies.length} ChatGPT cookies`);
    console.log(`📦 Found ${claudeCookies.length} Claude cookies\n`);
    
    // Find session tokens
    const chatgptSession = chatgptCookies.find(c => 
      c.name === '__Secure-next-auth.session-token'
    );
    
    const claudeSessionKey = claudeCookies.find(c => 
      c.name === 'sessionKey' || c.name.includes('session')
    );
    
    // Format cookies for Chrome extension compatibility
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
    
    // Build .env content
    let envContent = `# Captured from Chrome (debug port) - ${new Date().toISOString()}\n`;
    envContent += `# ✅ These are from your logged-in Chrome session\n\n`;
    
    if (chatgptSession) {
      console.log('✅ ChatGPT session token captured!');
      console.log(`   Token: ${chatgptSession.value.substring(0, 50)}...`);
      envContent += `# ChatGPT Authentication\n`;
      envContent += `CHATGPT_SESSION_TOKEN=${chatgptSession.value}\n\n`;
      envContent += `CHATGPT_COOKIES=${JSON.stringify(formatCookies(chatgptCookies))}\n\n`;
    } else {
      console.log('⚠️ No ChatGPT session token found');
      console.log('   Available cookies:', chatgptCookies.slice(0, 5).map(c => c.name).join(', '));
    }
    
    if (claudeSessionKey) {
      console.log('✅ Claude session captured!');
      console.log(`   Session: ${claudeSessionKey.value.substring(0, 50)}...`);
      envContent += `# Claude Authentication\n`;
      envContent += `CLAUDE_SESSION_KEY=${claudeSessionKey.value}\n\n`;
      
      // Add other important Claude cookies
      const cfBm = claudeCookies.find(c => c.name === '__cf_bm');
      const activitySession = claudeCookies.find(c => c.name === 'activitySessionId');
      
      if (cfBm) {
        envContent += `CLAUDE_CF_BM=${cfBm.value}\n`;
      }
      if (activitySession) {
        envContent += `CLAUDE_ACTIVITY_SESSION=${activitySession.value}\n`;
      }
    } else {
      console.log('⚠️ No Claude session key found');
      console.log('   Available cookies:', claudeCookies.slice(0, 5).map(c => c.name).join(', '));
    }
    
    // Save to file
    const filename = 'chrome-cookies-captured.env';
    fs.writeFileSync(filename, envContent);
    
    console.log(`\n💾 Saved to: ${filename}`);
    console.log('📋 Copy these values to your .env.local file\n');
    
    // Summary
    console.log('🎯 Summary:');
    console.log('===========');
    console.log(`ChatGPT: ${chatgptSession ? '✅ Ready' : '❌ Not logged in'}`);
    console.log(`Claude:  ${claudeSessionKey ? '✅ Ready' : '❌ Not logged in'}`);
    
    if (!chatgptSession || !claudeSessionKey) {
      console.log('\n💡 Tip: Make sure you are logged in to both services in Chrome');
    }
    
    // Don't close - keep connection alive
    console.log('\n✅ Done! You can close this with Ctrl+C');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('connect ECONNREFUSED')) {
      console.log('\n💡 Make sure Chrome is running with:');
      console.log('   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
    }
  }
}

captureCookies().catch(console.error);