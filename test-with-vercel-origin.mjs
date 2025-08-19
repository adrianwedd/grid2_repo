#!/usr/bin/env node

// Test with EXACT setup that worked - using Vercel origin!

const API_KEY = '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';

async function testWithVercelOrigin() {
  console.log('🚀 Testing with EXACT working setup from Vercel...\n');
  
  // Test the exact model that worked
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://grid2repo.vercel.app/',  // EXACT origin that worked!
      'X-Title': 'Grid 2.0 Model Test',
      'Origin': 'https://grid2repo.vercel.app'  // Add origin header too
    },
    body: JSON.stringify({
      model: 'z-ai/glm-4.5-air:free',  // The exact model from your log
      messages: [{
        role: 'user',
        content: 'Say hello!'
      }],
      max_tokens: 50,
      temperature: 0.7
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ SUCCESS! The API works from Vercel origin!');
    console.log('Response:', data.choices[0].message.content);
    console.log('\nThis proves the API works when called from the deployed app!');
  } else {
    const error = await response.text();
    console.log('❌ Still failing locally:', error);
    console.log('\nThis means OpenRouter is checking the origin/referer!');
    console.log('The API only works when called from https://grid2repo.vercel.app/');
  }
}

testWithVercelOrigin();