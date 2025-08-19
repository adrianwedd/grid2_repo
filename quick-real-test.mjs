#!/usr/bin/env node

// Quick test to show REAL models working!

const API_KEY = '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';

async function quickTest() {
  console.log('🏆 REAL MODEL RESPONSES - NOT SIMULATIONS!\n');
  
  const models = [
    'mistralai/mistral-small-3.2-24b-instruct:free',
    'deepseek/deepseek-chat-v3-0324:free',
    'qwen/qwen3-coder:free'
  ];
  
  for (const model of models) {
    console.log(`\n🤖 Testing ${model.split('/')[1].split(':')[0]}...`);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://grid2repo.vercel.app',
          'X-Title': 'Grid 2.0'
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: 'user',
            content: 'Create a wild website style name and tagline. Be creative! Max 20 words total.'
          }],
          max_tokens: 100,
          temperature: 0.8
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ REAL RESPONSE:');
        console.log(`   "${data.choices[0].message.content}"`);
      } else {
        console.log('❌ Error');
      }
    } catch (e) {
      console.log('❌ Failed:', e.message);
    }
  }
  
  console.log('\n🎉 These are REAL AI responses, not simulations!');
}

quickTest();