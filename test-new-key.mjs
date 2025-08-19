#!/usr/bin/env node

// Test with your NEW API key!

const NEW_API_KEY = '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';

async function testNewKey() {
  console.log('🔑 Testing with your NEW API key!\n');
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NEW_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://grid2repo.vercel.app',
      'X-Title': 'Grid 2.0 Test'
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1:free',
      messages: [{
        role: 'user',
        content: 'Create a wild website style name in 5 words!'
      }],
      max_tokens: 50,
      temperature: 0.8
    })
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ NEW KEY WORKS!!!');
    console.log('Response:', data.choices[0].message.content);
    console.log('\n🎉 We can now use REAL models!');
  } else {
    const error = await response.text();
    console.log('❌ Error:', error);
  }
}

testNewKey();