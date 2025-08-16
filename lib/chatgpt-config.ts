// ChatGPT session configuration
// To use: Export your cookies from ChatGPT and paste the session token here

export const CHATGPT_SESSION = {
  // Session token from environment variable
  sessionToken: process.env.CHATGPT_SESSION_TOKEN || '',
  
  // Cookies will be loaded from environment
  cookies: process.env.CHATGPT_COOKIES ? JSON.parse(process.env.CHATGPT_COOKIES) : []
};

// Instructions to get your session token:
// 1. Open chatgpt.com in your browser
// 2. Open DevTools (F12)
// 3. Go to Application > Cookies
// 4. Find "__Secure-next-auth.session-token"
// 5. Copy the value and paste above