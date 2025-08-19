#!/usr/bin/env node

// Generate creative styles in smaller batches

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// First batch of models
const BATCH_1 = [
  'deepseek/deepseek-r1:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'qwen/qwen3-coder:free',
  'mistralai/mistral-small-3.2-24b-instruct:free'
];

const API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Open-ended creative prompt
const CREATIVE_PROMPT = `You are designing your DREAM website.

No rules. No limits. Pure creativity.

What would YOUR perfect website be?
- What feeling does it evoke?
- What colors speak to your soul?
- What features would blow minds?
- What philosophy drives it?
- What makes it uniquely YOURS?

Express your vision in JSON format with whatever fields capture your imagination.
Include: name, philosophy, colors, features, interactions, experiences - anything that matters to YOUR perfect design.

Be bold. Be weird. Be YOU.`;

async function callModel(model, prompt, maxTokens = 1000) {
  console.log(`\n🎨 Calling ${model.split('/')[1]}...`);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app/',
        'X-Title': 'Grid 2.0 Creative Style Generator'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.95, // Very high for maximum creativity
        top_p: 0.95
      }),
      timeout: 30000 // 30 second timeout per model
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log(`   ✅ Got response (${data.usage?.total_tokens || '?'} tokens)`);
      return {
        model,
        success: true,
        response: data.choices[0].message.content,
        usage: data.usage,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      model,
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function generateBatch1() {
  console.log('🚀 Generating CREATIVE styles - Batch 1\n');
  console.log('💭 Letting AI express their perfect vision...\n');
  
  const results = [];
  
  for (const model of BATCH_1) {
    const startTime = Date.now();
    const result = await callModel(model, CREATIVE_PROMPT, 1000);
    result.duration = Date.now() - startTime;
    results.push(result);
    
    // Parse and show style
    if (result.success && result.response) {
      try {
        const jsonMatch = result.response.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          const style = JSON.parse(jsonMatch[0]);
          console.log(`   💡 "${style.name || 'Unnamed'}"`);
          if (style.philosophy || style.tagline) {
            console.log(`      → ${style.philosophy || style.tagline}`);
          }
        }
      } catch (e) {
        console.log(`   💡 Response received`);
      }
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Save results
  const timestamp = Date.now();
  const filename = `creative-batch1-${timestamp}.json`;
  
  await fs.writeFile(
    filename,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      batch: 1,
      prompt: CREATIVE_PROMPT,
      models: BATCH_1,
      successful: results.filter(r => r.success).length,
      results
    }, null, 2)
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ BATCH 1 COMPLETE!');
  console.log('='.repeat(60));
  console.log(`   Successful: ${results.filter(r => r.success).length}/${BATCH_1.length}`);
  console.log(`   Saved to: ${filename}`);
  
  return results;
}

generateBatch1().catch(console.error);