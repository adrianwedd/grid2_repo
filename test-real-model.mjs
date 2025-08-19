#!/usr/bin/env node

// Test with EXACT same setup that's working for you

const API_KEY = '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';

async function testRealModel() {
  console.log('🚀 Testing with your WORKING setup...\n');
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://grid2repo.vercel.app',
      'X-Title': 'Grid 2.0 Model Test'  // This matches your dashboard!
    },
    body: JSON.stringify({
      model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
      messages: [{
        role: 'user',
        content: 'Create a wild, creative website style name and tagline. Be unhinged!'
      }],
      max_tokens: 200,
      temperature: 0.9
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ IT WORKS!');
    console.log('Response:', data.choices[0].message.content);
  } else {
    const error = await response.text();
    console.log('❌ Error:', error);
  }
}

testRealModel();