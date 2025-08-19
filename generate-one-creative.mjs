#!/usr/bin/env node

// Generate ONE creative style at a time

import fetch from 'node-fetch';
import fs from 'fs/promises';

const API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Pick a creative model
const MODEL = process.argv[2] || 'deepseek/deepseek-r1:free';

// Very open creative prompt  
const PROMPT = `Design YOUR perfect website. No limits, just imagination.

What makes it perfect for YOU? Colors, feelings, features, philosophy - express your unique vision.

Return JSON with your creative vision. Be bold, be weird, be yourself.`;

async function generateOne() {
  console.log(`🎨 Generating with ${MODEL.split('/')[1]}...`);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://grid2repo.vercel.app/',
      'X-Title': 'Grid 2.0'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: PROMPT }],
      max_tokens: 1000,
      temperature: 0.9
    })
  });

  const data = await response.json();
  
  if (data.choices?.[0]?.message?.content) {
    const content = data.choices[0].message.content;
    console.log('\n📝 Response:\n', content);
    
    // Save to file
    const filename = `style-${MODEL.split('/')[1].replace(':', '-')}-${Date.now()}.json`;
    await fs.writeFile(filename, JSON.stringify({
      model: MODEL,
      response: content,
      usage: data.usage,
      timestamp: new Date().toISOString()
    }, null, 2));
    
    console.log(`\n✅ Saved to ${filename}`);
  } else {
    console.error('❌ No response received');
  }
}

generateOne().catch(console.error);