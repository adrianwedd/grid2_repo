#!/usr/bin/env node

// Generate ALL unique AI styles with proper content

import fetch from 'node-fetch';
import fs from 'fs/promises';

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error('❌ OPENROUTER_API_KEY environment variable is required');
  process.exit(1);
}

// AI models to use for generation
const MODELS = [
  'deepseek/deepseek-r1:free',
  'mistralai/mistral-small-3.2-24b-instruct:free',
  'qwen/qwen3-coder:free',
  'moonshotai/kimi-k2:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'z-ai/glm-4.5-air:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'google/gemma-2-9b-it:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'mistralai/devstral-small-2505:free',
  'deepseek/deepseek-chat-v3-0324:free'
];

// Unique style prompts for each model
const STYLE_PROMPTS = [
  "Create a CYBERPUNK NEON style: dark future, neon lights, holographic interfaces, digital rain",
  "Create a ZEN GARDEN style: peaceful, balanced, natural harmony, mindful simplicity",
  "Create a RETRO ARCADE style: 80s nostalgia, pixel art, bright colors, game-inspired",
  "Create a DARK ACADEMIA style: scholarly, mysterious, gothic libraries, ancient knowledge",
  "Create a SOLAR PUNK style: sustainable future, green tech, optimistic eco-design",
  "Create a VAPORWAVE style: aesthetic nostalgia, purple/pink gradients, glitch art",
  "Create a BRUTALIST style: raw concrete, bold geometry, imposing presence",
  "Create a MEMPHIS style: playful patterns, bold shapes, primary colors, postmodern fun",
  "Create a COSMIC HORROR style: otherworldly dread, impossible geometry, void aesthetics",
  "Create a COTTAGECORE style: cozy rural life, handmade warmth, pastoral charm",
  "Create a MAXIMALIST style: more is more, explosive colors, overwhelming beauty",
  "Create a GLITCH ART style: digital decay, corruption beauty, reality errors"
];

const STRUCTURED_PROMPT = (theme) => `You are creating a unique website style with the theme: ${theme}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no explanation):

{
  "id": "unique-style-id",
  "name": "Style Name",
  "philosophy": "One compelling sentence describing your unique design philosophy",
  "colors": {
    "primary": "#HEX_COLOR",
    "secondary": "#HEX_COLOR",
    "background": "#HEX_COLOR"
  },
  "content": {
    "hero": {
      "headline": "Powerful headline that embodies the ${theme} style",
      "subheadline": "Supporting text that explains the unique approach",
      "bullets": [
        "First key benefit matching the theme",
        "Second compelling point",
        "Third unique advantage"
      ]
    },
    "features": {
      "headline": "Features section title",
      "subheadline": "Brief description of what makes this special",
      "items": [
        "First amazing feature that fits the ${theme} style",
        "Second innovative capability",
        "Third game-changing element"
      ]
    },
    "cta": {
      "headline": "Call to action matching the ${theme} personality",
      "description": "Compelling description that drives action",
      "primaryAction": "Action Button Text"
    }
  },
  "uniqueFeatures": [
    "First mind-bending feature unique to ${theme}",
    "Second reality-defying capability",
    "Third impossible-but-amazing element"
  ]
}

Be extremely creative and ensure the content is UNIQUE to the ${theme} theme. Make it memorable!`;

async function generateStyle(model, stylePrompt, index) {
  console.log(`\n🎨 Generating style ${index + 1}/${STYLE_PROMPTS.length} with ${model.split('/')[1]}...`);
  console.log(`   Theme: ${stylePrompt.split(':')[0].replace('Create a ', '')}`);
  
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
        messages: [{ 
          role: 'user', 
          content: STRUCTURED_PROMPT(stylePrompt)
        }],
        max_tokens: 1500,
        temperature: 0.9
      })
    });

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      
      // Try to extract and parse JSON
      try {
        // Remove any markdown code blocks if present
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const style = JSON.parse(jsonMatch[0]);
          console.log(`   ✅ Success: "${style.name}" - ${style.philosophy}`);
          return {
            ...style,
            model,
            generatedAt: new Date().toISOString()
          };
        }
      } catch (parseError) {
        console.log(`   ⚠️ Parse failed: ${parseError.message}`);
      }
    }
    
    console.log(`   ❌ No valid response from ${model}`);
    return null;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function generateAllStyles() {
  console.log('🚀 Generating ALL AI Styles for Grid 2.0\n');
  console.log('═══════════════════════════════════════════');
  
  const styles = [];
  const errors = [];
  
  for (let i = 0; i < STYLE_PROMPTS.length; i++) {
    const model = MODELS[i % MODELS.length];
    const result = await generateStyle(model, STYLE_PROMPTS[i], i);
    
    if (result) {
      styles.push(result);
    } else {
      errors.push({ 
        index: i, 
        theme: STYLE_PROMPTS[i].split(':')[0].replace('Create a ', ''),
        model 
      });
    }
    
    // Small delay between calls
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // Save results
  const timestamp = Date.now();
  const filename = `ai-styles-complete-${timestamp}.json`;
  
  await fs.writeFile(
    filename,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      totalAttempted: STYLE_PROMPTS.length,
      successful: styles.length,
      failed: errors.length,
      styles,
      errors
    }, null, 2)
  );
  
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 Generation Complete!\n');
  console.log(`✅ Successfully generated: ${styles.length}/${STYLE_PROMPTS.length} styles`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️ Failed generations:`);
    errors.forEach(e => {
      console.log(`   - ${e.theme} (${e.model})`);
    });
  }
  
  console.log(`\n📁 Results saved to: ${filename}`);
  
  // Also generate TypeScript code for the styles
  if (styles.length > 0) {
    const tsCode = generateTypeScriptCode(styles);
    const tsFilename = `ai-styles-code-${timestamp}.ts`;
    await fs.writeFile(tsFilename, tsCode);
    console.log(`📝 TypeScript code saved to: ${tsFilename}`);
  }
  
  return styles;
}

function generateTypeScriptCode(styles) {
  let code = `// AI-Generated Styles for Grid 2.0
// Generated at: ${new Date().toISOString()}

import type { ContentGraph } from '@/types/section-system';

export interface AIStyleContent {
  id: string;
  name: string;
  philosophy: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  content: ContentGraph;
  uniqueFeatures: string[];
}

export const AI_GENERATED_STYLES: Record<string, AIStyleContent> = {
`;

  styles.forEach((style, index) => {
    code += `  '${style.id}': {
    id: '${style.id}',
    name: '${style.name}',
    philosophy: '${style.philosophy.replace(/'/g, "\\'")}',
    colors: ${JSON.stringify(style.colors, null, 6).replace(/\n/g, '\n    ')},
    content: {
      hero: {
        headline: '${style.content.hero.headline.replace(/'/g, "\\'")}',
        subheadline: '${style.content.hero.subheadline.replace(/'/g, "\\'")}',
        bullets: ${JSON.stringify(style.content.hero.bullets, null, 8).replace(/\n/g, '\n        ')}
      },
      features: {
        headline: '${style.content.features.headline.replace(/'/g, "\\'")}',
        subheadline: '${style.content.features.subheadline.replace(/'/g, "\\'")}',
        items: ${JSON.stringify(style.content.features.items, null, 8).replace(/\n/g, '\n        ')}
      },
      cta: {
        headline: '${style.content.cta.headline.replace(/'/g, "\\'")}',
        description: '${style.content.cta.description.replace(/'/g, "\\'")}',
        primaryAction: { label: '${style.content.cta.primaryAction}', href: '/start' }
      }
    },
    uniqueFeatures: ${JSON.stringify(style.uniqueFeatures, null, 6).replace(/\n/g, '\n    ')}
  }${index < styles.length - 1 ? ',\n' : ''}
`;
  });

  code += `};

// Style metadata for UI display
export const AI_STYLE_METADATA = [
`;

  styles.forEach((style, index) => {
    // Map to appropriate tone based on theme
    let tone = 'creative';
    const name = style.name.toLowerCase();
    if (name.includes('zen') || name.includes('minimal')) tone = 'minimal';
    else if (name.includes('brutal') || name.includes('dark')) tone = 'bold';
    else if (name.includes('retro') || name.includes('vapor')) tone = 'retro';
    else if (name.includes('playful') || name.includes('memphis')) tone = 'playful';
    else if (name.includes('cosmic') || name.includes('glitch')) tone = 'modern';
    
    code += `  {
    value: '${tone}' as const,
    name: '${style.name}',
    description: '${style.philosophy.replace(/'/g, "\\'")}',
    colors: ${JSON.stringify(style.colors, null, 6).replace(/\n/g, '\n    ')},
    aiStyleId: '${style.id}'
  }${index < styles.length - 1 ? ',' : ''}
`;
  });

  code += `];
`;

  return code;
}

// Run generation
generateAllStyles().catch(console.error);