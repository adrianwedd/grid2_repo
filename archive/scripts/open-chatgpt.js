#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';

console.log('🌐 Opening ChatGPT for manual login\n');

async function openChatGPT() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: null
  });
  
  const page = await context.newPage();
  
  console.log('📍 Navigating to ChatGPT...');
  await page.goto('https://chatgpt.com');
  
  console.log('\n📝 Instructions:');
  console.log('1. Log in to ChatGPT manually');
  console.log('2. Once logged in, press Enter in this terminal');
  console.log('3. I will capture the cookies\n');
  
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
    
    // Format for .env.local
    const envContent = `# ChatGPT Authentication - ${new Date().toISOString()}
CHATGPT_SESSION_TOKEN=${sessionCookie.value}

CHATGPT_COOKIES=${JSON.stringify(chatgptCookies, null, 2)}
`;
    
    // Save to file
    fs.writeFileSync('chatgpt-new-cookies.env', envContent);
    console.log('💾 Saved to: chatgpt-new-cookies.env');
    console.log('📋 Update your .env.local with these values');
    
    // Also show the cookies in terminal
    console.log('\n🔐 Session Token:');
    console.log(sessionCookie.value.substring(0, 50) + '...');
    console.log(`\n📅 Expires: ${new Date(sessionCookie.expires * 1000).toLocaleDateString()}`);
  } else {
    console.log('⚠️ No session token found - make sure you are logged in');
  }
  
  await browser.close();
  console.log('\n✅ Done!');
}

openChatGPT().catch(console.error);