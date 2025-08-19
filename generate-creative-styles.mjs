#!/usr/bin/env node

// Generate MORE creative styles with more freedom for AI imagination

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// DeepSeek and other free models that have shown creativity
const CREATIVE_MODELS = [
  'deepseek/deepseek-r1:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'qwen/qwen3-coder:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'moonshotai/kimi-k2:free',
  'z-ai/glm-4.5-air:free',
  'google/gemma-2-9b-it:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
  'meta-llama/llama-3.2-1b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];

const API_KEY = process.env.OPENROUTER_API_KEY || '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';

// MUCH more open-ended creative prompt
const CREATIVE_PROMPT = `You are a visionary designer creating the PERFECT website style.

Create your dream website - no limits, no rules, just pure imagination.

What makes YOUR perfect website? Think about:
- The vibe, mood, feeling, atmosphere
- Colors that speak to you
- Features that would blow minds
- Interactions that surprise and delight
- Experiences that transport users
- Philosophies that inspire
- Aesthetics that break conventions

Be WILDLY creative. Be yourself. Define perfection your way.

Return a JSON object with whatever fields feel right to describe YOUR perfect style.
Include at minimum: name, philosophy/tagline, colors, features, and any other aspects you think matter.

The format is flexible - express your vision however feels natural.`;

async function callModel(model, prompt, maxTokens = 1200) {
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
        temperature: 0.9, // Higher temperature for more creativity
        top_p: 0.95
      })
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

async function generateCreativeStyles() {
  console.log('🚀 Generating WILDLY CREATIVE styles with MORE TOKENS!\n');
  console.log('📝 Prompt: Let AI define their perfect style...\n');
  
  const results = [];
  
  // Process one at a time with patience
  for (const model of CREATIVE_MODELS) {
    const startTime = Date.now();
    const result = await callModel(model, CREATIVE_PROMPT, 1200); // Much higher token limit
    result.duration = Date.now() - startTime;
    results.push(result);
    
    // Log preview of response
    if (result.success && result.response) {
      const preview = result.response.substring(0, 200);
      console.log(`   Preview: ${preview}...`);
    }
    
    // Small delay between calls
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save all results
  const timestamp = Date.now();
  const filename = `creative-styles-${timestamp}.json`;
  
  await fs.writeFile(
    filename,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      prompt: CREATIVE_PROMPT,
      totalModels: CREATIVE_MODELS.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    }, null, 2)
  );
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ GENERATION COMPLETE!');
  console.log('='.repeat(80));
  console.log(`\n📊 Results:`);
  console.log(`   - Successful: ${results.filter(r => r.success).length}/${CREATIVE_MODELS.length}`);
  console.log(`   - Failed: ${results.filter(r => !r.success).length}`);
  console.log(`   - Saved to: ${filename}`);
  
  // Show successful styles
  console.log('\n🎨 Creative Styles Generated:');
  for (const result of results.filter(r => r.success)) {
    const modelName = result.model.split('/')[1].split(':')[0];
    console.log(`\n📝 ${modelName}:`);
    
    // Try to extract style name from response
    try {
      const jsonMatch = result.response.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const style = JSON.parse(jsonMatch[0]);
        const name = style.name || style.website_name || style.websiteName || 'Unnamed';
        const philosophy = style.philosophy || style.tagline || style.motto || '';
        console.log(`   Name: "${name}"`);
        if (philosophy) console.log(`   Philosophy: "${philosophy}"`);
      }
    } catch (e) {
      console.log(`   (Could not parse style details)`);
    }
  }
  
  console.log('\n🚀 Let your imagination run WILD!');
}

generateCreativeStyles().catch(console.error);