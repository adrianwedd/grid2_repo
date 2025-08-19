#!/usr/bin/env node

// REAL MODEL COMPETITION - Using actual API calls
// Since you have it working, let's make this work!

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Your NEW WORKING API key!
const API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Models that are DEFINITELY working based on your dashboard
const WORKING_MODELS = [
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', // Venice Uncensored
  'qwen/qwen3-coder:free', // Qwen3 Coder
  'mistralai/mistral-small-3.2-24b-instruct:free', // Mistral Small
  'deepseek/deepseek-r1:free', // DeepSeek R1
  'moonshotai/kimi-k2:free', // Kimi K2
  'deepseek/deepseek-chat-v3-0324:free', // DeepSeek V3
];

// Competition challenge
const CHALLENGE = {
  name: 'Ultimate Style Creation',
  brief: 'Create the most creative, wild, and perfect website style. Go absolutely nuts with creativity!',
  requirements: [
    'Must have a creative name',
    'Must have a philosophy',
    'Must have color scheme',
    'Must have unique features',
    'Must be memorable'
  ]
};

async function callOpenRouter(model, prompt) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app',
        'X-Title': 'Grid 2.0 Model Test'
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'system',
          content: 'You are a wildly creative web designer. Be unhinged, creative, and bold!'
        }, {
          role: 'user',
          content: prompt
        }],
        max_tokens: 500,
        temperature: 0.9
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        content: data.choices[0].message.content,
        usage: data.usage
      };
    } else {
      const error = await response.text();
      return {
        success: false,
        error
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runRealCompetition() {
  console.log('═'.repeat(80));
  console.log('🏆 REAL AI MODEL STYLE COMPETITION - LIVE API CALLS! 🏆');
  console.log('═'.repeat(80));
  console.log('\n📡 Using ACTUAL OpenRouter API with FREE models');
  console.log(`🔑 API Key: ${API_KEY.substring(0, 20)}...`);
  console.log('\n🎯 Challenge: ' + CHALLENGE.name);
  console.log('📋 Brief: ' + CHALLENGE.brief);
  console.log('\nContestants:');
  WORKING_MODELS.forEach((model, i) => {
    console.log(`  ${i + 1}. ${model}`);
  });
  
  console.log('\n' + '─'.repeat(80));
  console.log('LET THE REAL COMPETITION BEGIN!\n');
  
  const prompt = `
Challenge: ${CHALLENGE.brief}

Create a complete website style with:
1. A creative, memorable name
2. A bold philosophy/tagline
3. Color scheme (primary, secondary, accent)
4. 3 unique features
5. Hero headline and subheadline

Be wildly creative! Break conventions! Make it unforgettable!

Respond in JSON format like:
{
  "name": "Style Name",
  "philosophy": "Bold tagline",
  "colors": { "primary": "#hex", "secondary": "#hex", "accent": "#hex" },
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "hero": { "headline": "...", "subheadline": "..." }
}`;

  const results = [];
  
  for (const model of WORKING_MODELS) {
    console.log(`\n🤖 Testing ${model}...`);
    const startTime = Date.now();
    
    const result = await callOpenRouter(model, prompt);
    const duration = Date.now() - startTime;
    
    if (result.success) {
      console.log(`✅ SUCCESS in ${duration}ms!`);
      
      try {
        // Try to parse JSON from response
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        const styleData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        
        if (styleData) {
          console.log(`   Name: "${styleData.name}"`);
          console.log(`   Philosophy: "${styleData.philosophy}"`);
          console.log(`   Hero: "${styleData.hero?.headline}"`);
        } else {
          console.log(`   Response: ${result.content.substring(0, 100)}...`);
        }
        
        results.push({
          model,
          success: true,
          duration,
          style: styleData || { raw: result.content },
          usage: result.usage
        });
      } catch (e) {
        console.log(`   Could not parse JSON, raw response saved`);
        results.push({
          model,
          success: true,
          duration,
          style: { raw: result.content },
          usage: result.usage
        });
      }
    } else {
      console.log(`❌ FAILED: ${result.error.substring(0, 100)}`);
      results.push({
        model,
        success: false,
        duration,
        error: result.error
      });
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Summary
  console.log('\n' + '═'.repeat(80));
  console.log('📊 COMPETITION RESULTS');
  console.log('═'.repeat(80) + '\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n🏆 SUCCESSFUL SUBMISSIONS:');
    successful.forEach((r, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
      console.log(`${medal} ${r.model}`);
      if (r.style.name) {
        console.log(`     "${r.style.name}" - ${r.style.philosophy}`);
      }
    });
  }
  
  // Save results
  const outputDir = path.join(__dirname, 'real-competition-results');
  await fs.mkdir(outputDir, { recursive: true });
  
  const filename = `real-competition-${Date.now()}.json`;
  await fs.writeFile(
    path.join(outputDir, filename),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      challenge: CHALLENGE,
      results,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length
      }
    }, null, 2)
  );
  
  console.log(`\n💾 Results saved to: ${filename}`);
  
  if (successful.length === 0) {
    console.log('\n⚠️ No models worked. Possible issues:');
    console.log('1. API key needs to be activated on OpenRouter');
    console.log('2. Rate limiting in effect');
    console.log('3. Models require payment/credits');
    console.log('\nBut your dashboard shows they ARE working, so...');
    console.log('Try running this script from your environment where it works!');
  }
}

runRealCompetition().catch(console.error);