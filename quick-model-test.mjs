#!/usr/bin/env node

// Quick test of key free models
import fs from 'fs/promises';

const API_KEY = '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';

// Key models to test
const TEST_MODELS = [
  'deepseek/deepseek-r1:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'qwen/qwen3-coder:free',
  'google/gemma-3n-e2b-it:free',
  'openai/gpt-oss-20b:free',
  'moonshotai/kimi-k2:free'
];

const PROMPT = `Create a hero section for a playful AI website builder. Be creative and fun.
Return JSON with: headline (5-8 words), subheadline (15-20 words), bullets (array of 3).
Example: {"headline": "Build Websites That Don't Suck", "subheadline": "AI-powered tools that make web design fun again", "bullets": ["Lightning fast", "Zero coding", "Actually works"]}`;

async function testModel(modelId) {
  console.log(`\nTesting: ${modelId}`);
  const start = Date.now();
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'user', content: PROMPT }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    });
    
    const time = Date.now() - start;
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`❌ Failed (${time}ms): ${error.substring(0, 100)}`);
      return { model: modelId, success: false, time };
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    console.log(`✅ Success (${time}ms)`);
    
    // Try to parse response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/) || [content];
      const parsed = JSON.parse(jsonMatch[0]);
      console.log(`   "${parsed.headline || 'No headline'}"`);
      return { model: modelId, success: true, time, content: parsed };
    } catch (e) {
      console.log(`   Raw: ${content.substring(0, 100)}...`);
      return { model: modelId, success: true, time, raw: content };
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { model: modelId, success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Testing Free OpenRouter Models\n');
  console.log('=' .repeat(50));
  
  const results = [];
  
  for (const model of TEST_MODELS) {
    const result = await testModel(model);
    results.push(result);
    await new Promise(r => setTimeout(r, 1000)); // Rate limit
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 SUMMARY\n');
  
  // Show fastest
  const successful = results.filter(r => r.success && r.time);
  if (successful.length > 0) {
    console.log('⚡ Speed Ranking:');
    successful
      .sort((a, b) => a.time - b.time)
      .forEach((r, i) => {
        console.log(`${i+1}. ${r.model.padEnd(45)} ${r.time}ms`);
      });
  }
  
  // Show best headlines
  console.log('\n✨ Best Headlines:');
  results
    .filter(r => r.content?.headline)
    .forEach(r => {
      console.log(`${r.model}:`);
      console.log(`   "${r.content.headline}"`);
    });
  
  // Save results
  await fs.writeFile('quick-test-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Results saved to quick-test-results.json');
}

main().catch(console.error);