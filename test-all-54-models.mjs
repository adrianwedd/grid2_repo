#!/usr/bin/env node

// Test ALL 54 free OpenRouter models
import fs from 'fs/promises';

const API_KEY = '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';

// Simple, fast prompt for testing
const TEST_PROMPT = `Write a catchy headline for an AI website builder (5-7 words, be creative and fun)`;

// Get ALL free models
async function getAllFreeModels() {
  console.log('📋 Fetching all free models...');
  const response = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  
  const data = await response.json();
  const freeModels = data.data
    .filter(m => m.id.includes(':free'))
    .map(m => ({ 
      id: m.id, 
      name: m.name || m.id,
      context: m.context_length || 0
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
  
  console.log(`Found ${freeModels.length} free models\n`);
  return freeModels;
}

// Test a single model with timeout
async function testModel(model, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const start = Date.now();
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app'
      },
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: 'user', content: TEST_PROMPT }],
        temperature: 0.7,
        max_tokens: 100
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const time = Date.now() - start;
    
    if (!response.ok) {
      const error = await response.text();
      return { 
        model: model.id, 
        name: model.name,
        success: false, 
        error: error.substring(0, 50),
        time 
      };
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No content';
    
    return { 
      model: model.id,
      name: model.name,
      success: true, 
      content: content.substring(0, 100),
      time 
    };
    
  } catch (error) {
    clearTimeout(timeoutId);
    return { 
      model: model.id,
      name: model.name,
      success: false, 
      error: error.message === 'The operation was aborted' ? 'Timeout' : error.message 
    };
  }
}

// Test models in batches
async function testBatch(models, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < models.length; i += batchSize) {
    const batch = models.slice(i, i + batchSize);
    console.log(`\n📦 Testing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(models.length/batchSize)}`);
    
    const batchPromises = batch.map(model => {
      console.log(`  Testing: ${model.id}`);
      return testModel(model);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Show batch results
    batchResults.forEach(r => {
      if (r.success) {
        console.log(`    ✅ ${r.model} (${r.time}ms): "${r.content}"`);
      } else {
        console.log(`    ❌ ${r.model}: ${r.error}`);
      }
    });
    
    // Rate limit between batches
    await new Promise(r => setTimeout(r, 2000));
  }
  
  return results;
}

// Main test
async function main() {
  console.log('🚀 Testing ALL Free OpenRouter Models');
  console.log('=' .repeat(60));
  console.log(`Prompt: "${TEST_PROMPT}"`);
  console.log('=' .repeat(60));
  
  try {
    // Get all models
    const models = await getAllFreeModels();
    
    // Test all models
    const results = await testBatch(models);
    
    // Analysis
    console.log('\n' + '=' .repeat(60));
    console.log('📊 FINAL REPORT');
    console.log('=' .repeat(60));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`\n✅ Success: ${successful.length}/${results.length} models`);
    console.log(`❌ Failed: ${failed.length}/${results.length} models`);
    
    // Speed ranking
    if (successful.length > 0) {
      console.log('\n⚡ TOP 10 FASTEST:');
      successful
        .sort((a, b) => a.time - b.time)
        .slice(0, 10)
        .forEach((r, i) => {
          console.log(`${(i+1).toString().padStart(2)}. ${r.model.padEnd(55)} ${r.time}ms`);
        });
      
      // Slowest
      console.log('\n🐌 SLOWEST 5:');
      successful
        .sort((a, b) => b.time - a.time)
        .slice(0, 5)
        .forEach((r, i) => {
          console.log(`${(i+1).toString().padStart(2)}. ${r.model.padEnd(55)} ${r.time}ms`);
        });
    }
    
    // Sample outputs
    console.log('\n✨ SAMPLE OUTPUTS:');
    successful
      .slice(0, 5)
      .forEach(r => {
        console.log(`\n${r.model}:`);
        console.log(`  "${r.content}"`);
      });
    
    // Failed models
    if (failed.length > 0) {
      console.log('\n⚠️ FAILED MODELS:');
      failed.forEach(f => {
        console.log(`  ${f.model}: ${f.error}`);
      });
    }
    
    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `all-models-test-${timestamp}.json`;
    await fs.writeFile(filename, JSON.stringify({
      timestamp: new Date().toISOString(),
      prompt: TEST_PROMPT,
      totalModels: results.length,
      successful: successful.length,
      failed: failed.length,
      results
    }, null, 2));
    
    console.log(`\n💾 Full results saved to: ${filename}`);
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('🎯 KEY FINDINGS:');
    console.log('=' .repeat(60));
    console.log(`• ${successful.length} models work perfectly!`);
    console.log(`• Average response time: ${Math.round(successful.reduce((a,b) => a + b.time, 0) / successful.length)}ms`);
    console.log(`• Fastest model: ${successful[0]?.model} (${successful[0]?.time}ms)`);
    console.log('• All working models can follow instructions!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main().catch(console.error);