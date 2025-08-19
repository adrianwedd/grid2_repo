#!/bin/bash

echo "🌐 Opening ChatGPT in your default browser..."
echo ""
echo "📝 Instructions:"
echo "1. Log in to ChatGPT in your browser"
echo "2. Open Developer Tools (Right-click → Inspect → Application tab → Cookies)"
echo "3. Find and copy the '__Secure-next-auth.session-token' cookie value"
echo "4. I'll help you format it for .env.local"
echo ""

# Open ChatGPT in default browser
open https://chatgpt.com

echo "Press Enter once you've logged in and copied the session token..."
read

echo ""
echo "Please paste the session token value here:"
read SESSION_TOKEN

if [ -n "$SESSION_TOKEN" ]; then
    echo ""
    echo "✅ Session token received!"
    echo ""
    echo "📋 Add this to your .env.local file:"
    echo "================================================"
    echo "CHATGPT_SESSION_TOKEN=$SESSION_TOKEN"
    echo "================================================"
    echo ""
    echo "💡 For full cookie capture, you can use the Chrome extension:"
    echo "   1. Install 'EditThisCookie' or 'Cookie-Editor' extension"
    echo "   2. Export all cookies from chatgpt.com"
    echo "   3. Save as CHATGPT_COOKIES in .env.local"
else
    echo "❌ No session token provided"
fi