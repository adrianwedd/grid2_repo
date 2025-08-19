#!/usr/bin/env node

// Save ALL real model responses - be patient!

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = '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';

const MODELS = [
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'deepseek/deepseek-r1:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'qwen/qwen3-coder:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'moonshotai/kimi-k2:free',
  'z-ai/glm-4.5-air:free',
  'google/gemma-2-9b-it:free'
];

async function testModel(model) {
  const startTime = Date.now();
  console.log(`🤖 Calling ${model.split('/')[1].split(':')[0]}...`);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app',
        'X-Title': 'Grid 2.0 Real Test'
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: `Create an absolutely wild and creative website style! Include:
1. A crazy creative name
2. A bold philosophy/tagline
3. Primary color (hex)
4. Three unique features
5. Hero headline

Be EXTREMELY creative and unconventional! Format as JSON.`
        }],
        max_tokens: 400,
        temperature: 0.9
      })
    });
    
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      console.log(`✅ SUCCESS in ${duration}ms!`);
      console.log(`   Preview: ${content.substring(0, 100)}...`);
      
      return {
        model,
        success: true,
        duration,
        response: content,
        usage: data.usage,
        timestamp: new Date().toISOString()
      };
    } else {
      const error = await response.text();
      console.log(`❌ FAILED in ${duration}ms: ${error.substring(0, 50)}`);
      return {
        model,
        success: false,
        duration,
        error,
        timestamp: new Date().toISOString()
      };
    }
  } catch (e) {
    console.log(`❌ ERROR: ${e.message}`);
    return {
      model,
      success: false,
      error: e.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function main() {
  console.log('═'.repeat(80));
  console.log('🏆 REAL MODEL RESPONSES - SAVING EVERYTHING!');
  console.log('═'.repeat(80));
  console.log('\n⏰ This will take a few minutes. Be patient!\n');
  
  const results = [];
  
  // Test each model sequentially to avoid rate limits
  for (const model of MODELS) {
    const result = await testModel(model);
    results.push(result);
    
    // Save after each response to not lose data
    const filename = `real-responses-${Date.now()}.json`;
    await fs.writeFile(
      path.join(__dirname, filename),
      JSON.stringify(results, null, 2)
    );
    console.log(`   💾 Saved to ${filename}\n`);
    
    // Wait between calls
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Final summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 FINAL RESULTS');
  console.log('═'.repeat(80));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  successful.forEach(r => {
    console.log(`   • ${r.model.split('/')[1].split(':')[0]} (${r.duration}ms)`);
  });
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => {
      console.log(`   • ${r.model.split('/')[1].split(':')[0]}`);
    });
  }
  
  // Save final comprehensive results
  const finalFilename = `FINAL-real-model-results-${Date.now()}.json`;
  await fs.writeFile(
    path.join(__dirname, finalFilename),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      totalModels: results.length,
      successful: successful.length,
      failed: failed.length,
      averageResponseTime: successful.length > 0 
        ? Math.round(successful.reduce((a, b) => a + b.duration, 0) / successful.length)
        : 0,
      results
    }, null, 2)
  );
  
  console.log(`\n📁 Final results saved to: ${finalFilename}`);
  console.log('\n🎉 THESE ARE REAL AI RESPONSES, NOT SIMULATIONS!');
}

main().catch(console.error);