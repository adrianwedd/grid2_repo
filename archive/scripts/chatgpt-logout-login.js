#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';

console.log('🔄 ChatGPT Logout and Login Process\n');

async function logoutAndLogin() {
  const browser = await chromium.launch({
    headless: false
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('🌐 Going to ChatGPT...');
    await page.goto('https://chatgpt.com', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if logged in
    const profileButton = await page.$('[data-testid="profile-button"], button[aria-label*="User"]');
    
    if (profileButton) {
      console.log('✅ Currently logged in');
      console.log('🚪 Logging out...');
      
      // Click profile button
      await profileButton.click();
      await page.waitForTimeout(1000);
      
      // Look for logout option
      const logoutButton = await page.$('text/Log out, text/Sign out, [data-testid="logout"]');
      if (logoutButton) {
        await logoutButton.click();
        console.log('✅ Logged out successfully');
        await page.waitForTimeout(3000);
      }
    }
    
    console.log('\n📝 Now please:');
    console.log('1. Click "Log in" button');
    console.log('2. Enter your credentials');
    console.log('3. Complete any 2FA if required');
    console.log('4. Once logged in, I will capture the new cookies');
    console.log('\n⏳ Waiting for you to log in...');
    
    // Wait for successful login (profile button appears)
    await page.waitForSelector('[data-testid="profile-button"], button[aria-label*="User"]', {
      timeout: 300000 // 5 minutes to log in
    });
    
    console.log('\n✅ Login detected! Capturing cookies...');
    await page.waitForTimeout(2000);
    
    // Get all cookies
    const cookies = await page.cookies();
    
    // Filter ChatGPT related cookies
    const chatgptCookies = cookies.filter(c => 
      c.domain.includes('chatgpt.com') || 
      c.domain.includes('openai.com')
    );
    
    console.log(`\n📦 Captured ${chatgptCookies.length} cookies`);
    
    // Find session token
    const sessionCookie = chatgptCookies.find(c => 
      c.name === '__Secure-next-auth.session-token'
    );
    
    if (sessionCookie) {
      console.log('\n✅ Session token captured!');
      console.log('\n🔐 New Environment Variables:\n');
      console.log('CHATGPT_SESSION_TOKEN=' + sessionCookie.value);
      console.log('\nCHATGPT_COOKIES=' + JSON.stringify(chatgptCookies));
      
      // Save to file for easy copying
      const envContent = `# Updated ChatGPT Authentication - ${new Date().toISOString()}
CHATGPT_SESSION_TOKEN=${sessionCookie.value}

CHATGPT_COOKIES=${JSON.stringify(chatgptCookies)}
`;
      
      fs.writeFileSync('chatgpt-new-cookies.env', envContent);
      console.log('\n💾 Saved to chatgpt-new-cookies.env');
      console.log('📋 Copy the contents to your .env.local file');
    } else {
      console.log('⚠️ Session token not found in cookies');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    console.log('\n🔚 Process complete');
    await browser.close();
  }
}

logoutAndLogin().catch(console.error);