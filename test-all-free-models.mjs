#!/usr/bin/env node

// Test ALL free OpenRouter models with a comprehensive style specification
import fs from 'fs/promises';

const API_KEY = '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';
const BASE_URL = 'https://openrouter.ai/api/v1';

// Get all free models
async function getFreeModels() {
  const response = await fetch(`${BASE_URL}/models`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  
  const data = await response.json();
  return data.data
    .filter(model => model.id.includes(':free'))
    .map(model => ({
      id: model.id,
      name: model.name,
      context_length: model.context_length,
      per_request_limits: model.per_request_limits
    }));
}

// Comprehensive style spec prompt
const STYLE_SPEC_PROMPT = `You are creating content for a modern, playful website builder. Generate the following:

HERO SECTION:
- Headline: Make it punchy, memorable, and slightly ridiculous (5-8 words)
- Subheadline: Supportive but unexpected (15-20 words)
- 3 Bullet points: Each should be a benefit but written in a fun way

FEATURE DESCRIPTIONS (3 features):
- "Speed Optimizer": Write a hilarious 1-sentence description
- "AI Assistant": Make it sound magical but slightly absurd
- "One-Click Deploy": Make deployment sound epic

CTA SECTION:
- Headline: Urgent but playful
- Description: Build desire with humor
- Button text: Action-oriented but unexpected

TONE: Playful, slightly absurd, professional enough to be credible but fun enough to be memorable. Think "serious business with a wink."

FORMAT: Return as valid JSON with keys: hero, features, cta`;

// Test a single model
async function testModel(modelId) {
  console.log(`\n🧪 Testing: ${modelId}`);
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app',
        'X-Title': 'Grid 2.0 Model Test'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: 'You are a creative copywriter who specializes in fun, engaging web content. Always return valid JSON.'
          },
          {
            role: 'user',
            content: STYLE_SPEC_PROMPT
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      const error = await response.text();
      return {
        model: modelId,
        success: false,
        error: error.substring(0, 200),
        responseTime
      };
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Try to parse as JSON
    let parsedContent;
    try {
      // Extract JSON from response if wrapped in markdown
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      parsedContent = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : content);
    } catch (e) {
      parsedContent = { raw: content.substring(0, 500) };
    }
    
    return {
      model: modelId,
      success: true,
      responseTime,
      tokens: data.usage,
      content: parsedContent
    };
    
  } catch (error) {
    return {
      model: modelId,
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Grid 2.0 - Testing ALL Free OpenRouter Models\n');
  console.log('=' .repeat(60));
  
  // Get all free models
  console.log('📋 Fetching available free models...');
  const models = await getFreeModels();
  console.log(`Found ${models.length} free models\n`);
  
  // Test each model
  const results = [];
  for (const model of models) {
    const result = await testModel(model.id);
    results.push(result);
    
    // Show quick summary
    if (result.success) {
      console.log(`✅ Success in ${result.responseTime}ms`);
      if (result.content.hero) {
        console.log(`   Headline: "${result.content.hero.headline || 'N/A'}"`);
      }
    } else {
      console.log(`❌ Failed: ${result.error?.substring(0, 100)}`);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Generate report
  console.log('\n' + '=' .repeat(60));
  console.log('📊 FINAL REPORT\n');
  
  // Success rate
  const successful = results.filter(r => r.success);
  console.log(`Success Rate: ${successful.length}/${results.length} (${Math.round(successful.length/results.length*100)}%)\n`);
  
  // Speed ranking
  console.log('⚡ SPEED RANKING (fastest first):');
  successful
    .sort((a, b) => a.responseTime - b.responseTime)
    .slice(0, 10)
    .forEach((r, i) => {
      console.log(`${i+1}. ${r.model.padEnd(50)} ${r.responseTime}ms`);
    });
  
  // Quality samples
  console.log('\n✨ QUALITY SAMPLES:\n');
  
  // Show best responses
  const bestModels = ['deepseek/deepseek-r1:free', 'deepseek/deepseek-chat-v3-0324:free', 'mistralai/mistral-small-3.2-24b-instruct:free'];
  
  for (const modelId of bestModels) {
    const result = results.find(r => r.model === modelId);
    if (result?.success && result.content.hero) {
      console.log(`📝 ${modelId}:`);
      console.log(`   Hero: "${result.content.hero.headline || 'N/A'}"`);
      console.log(`   Sub: "${result.content.hero.subheadline || 'N/A'}"`);
      if (result.content.features) {
        console.log(`   Features: ${JSON.stringify(result.content.features).substring(0, 100)}...`);
      }
      console.log();
    }
  }
  
  // Save full results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `model-test-results-${timestamp}.json`;
  await fs.writeFile(filename, JSON.stringify(results, null, 2));
  console.log(`\n💾 Full results saved to: ${filename}`);
  
  // Show failures
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log(`\n⚠️ Failed models (${failures.length}):`);
    failures.forEach(f => {
      console.log(`   - ${f.model}: ${f.error?.substring(0, 50)}`);
    });
  }
  
  console.log('\n✅ Test complete!');
}

// Run the tests
runTests().catch(console.error);