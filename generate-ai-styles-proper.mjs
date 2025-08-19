#!/usr/bin/env node

// Generate AI styles with proper ContentGraph structure

import fetch from 'node-fetch';
import fs from 'fs/promises';

const API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Creative AI models
const MODELS = [
  'deepseek/deepseek-r1:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'qwen/qwen3-coder:free',
  'moonshotai/kimi-k2:free'
];

// Structured prompt that returns exactly what we need
const STRUCTURED_PROMPT = `You are a visionary designer creating a unique website style.

Create your perfect website design with a distinctive personality and philosophy.

Return ONLY a valid JSON object with this EXACT structure:

{
  "name": "Your Unique Style Name",
  "philosophy": "Your design philosophy in one compelling sentence",
  "colors": {
    "primary": "#HEX_COLOR",
    "secondary": "#HEX_COLOR", 
    "background": "#HEX_COLOR"
  },
  "content": {
    "hero": {
      "headline": "Powerful headline that embodies your style",
      "subheadline": "Supporting text that explains your unique approach",
      "bullets": [
        "First key benefit or feature",
        "Second compelling point", 
        "Third unique advantage"
      ]
    },
    "features": {
      "headline": "Features section title",
      "subheadline": "Brief description of what makes you special",
      "items": [
        "First amazing feature that fits your style",
        "Second innovative capability",
        "Third game-changing element"
      ]
    },
    "cta": {
      "headline": "Call to action that matches your personality",
      "description": "Compelling description that drives action",
      "primaryAction": "Action Button Text"
    }
  },
  "uniqueFeatures": [
    "First mind-bending feature",
    "Second reality-defying capability", 
    "Third impossible-but-amazing element"
  ]
}

Be wildly creative. Make it uniquely YOURS. No generic corporate speak.
Think: What if reality was a website? What would it look like?`;

async function callModel(model) {
  console.log(`🎨 Generating style with ${model.split('/')[1]}...`);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://grid2repo.vercel.app/',
        'X-Title': 'Grid 2.0'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: STRUCTURED_PROMPT }],
        max_tokens: 1200,
        temperature: 0.9
      })
    });

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      console.log(`   ✅ Got response`);
      
      // Try to extract and parse JSON
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const style = JSON.parse(jsonMatch[0]);
          console.log(`   💡 Style: "${style.name}"`);
          return {
            model,
            success: true,
            style,
            rawResponse: content,
            timestamp: new Date().toISOString()
          };
        }
      } catch (parseError) {
        console.log(`   ⚠️ Parse failed: ${parseError.message}`);
      }
    }
    
    return {
      model,
      success: false,
      error: 'No valid response',
      timestamp: new Date().toISOString()
    };
    
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

async function generateProperStyles() {
  console.log('🚀 Generating AI styles with proper structure...\n');
  
  const results = [];
  const validStyles = [];
  
  for (const model of MODELS) {
    const result = await callModel(model);
    results.push(result);
    
    if (result.success && result.style) {
      validStyles.push(result.style);
    }
    
    // Small delay between calls
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save results
  const timestamp = Date.now();
  await fs.writeFile(
    `ai-styles-proper-${timestamp}.json`,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      totalModels: MODELS.length,
      successful: validStyles.length,
      results,
      validStyles
    }, null, 2)
  );
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Generated ${validStyles.length}/${MODELS.length} valid styles`);
  console.log('='.repeat(60));
  
  validStyles.forEach((style, i) => {
    console.log(`\n${i + 1}. "${style.name}"`);
    console.log(`   Philosophy: "${style.philosophy}"`);
    console.log(`   Hero: "${style.content.hero.headline}"`);
    console.log(`   Colors: ${style.colors.primary}, ${style.colors.secondary}`);
  });
  
  console.log(`\n📁 Saved to: ai-styles-proper-${timestamp}.json`);
  return validStyles;
}

generateProperStyles().catch(console.error);