# How to Get Cookies from Your Logged-In Chrome Session

Since you're already logged in to both ChatGPT and Claude in Chrome, here's the easiest way to get the cookies:

## Method 1: Chrome DevTools (Recommended)

1. **Open ChatGPT in Chrome** (you're already logged in)
2. **Open DevTools**: Right-click → Inspect (or press `Cmd+Option+I`)
3. **Go to Application tab** → Storage → Cookies → https://chatgpt.com
4. **Find the cookie**: `__Secure-next-auth.session-token`
5. **Copy the Value** (triple-click to select all)

6. **Repeat for Claude**: 
   - Go to https://claude.ai
   - Look for cookies like `sessionKey` or similar
   - Copy the value

## Method 2: Chrome Extension

1. **Install Cookie Editor** extension from Chrome Web Store
2. **Go to ChatGPT** (while logged in)
3. **Click the extension** → Export → JSON
4. **Save the cookies**

## Method 3: Use Chrome Remote Debugging

```bash
# 1. Close Chrome completely
# 2. Start Chrome with remote debugging
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# 3. In another terminal, run our script
node capture-chrome-cookies.js
```

## Update .env.local

Once you have the cookies, update your `.env.local`:

```env
CHATGPT_SESSION_TOKEN=<paste the __Secure-next-auth.session-token value here>

CLAUDE_SESSION_KEY=<paste the claude session key here>
```

The cookies from your logged-in Chrome session will work perfectly with the app!