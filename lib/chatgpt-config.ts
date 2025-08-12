// ChatGPT session configuration
// To use: Export your cookies from ChatGPT and paste the session token here

export const CHATGPT_SESSION = {
  // Paste your __Secure-next-auth.session-token value here
  sessionToken: '',
  
  // Or use full cookie array (export from browser)
  cookies: [
    // Paste cookies array here if needed
  ]
};

// Instructions to get your session token:
// 1. Open chatgpt.com in your browser
// 2. Open DevTools (F12)
// 3. Go to Application > Cookies
// 4. Find "__Secure-next-auth.session-token"
// 5. Copy the value and paste above