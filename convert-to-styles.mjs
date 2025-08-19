#!/usr/bin/env node

// Convert REAL AI responses to style files

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function convertResponsesToStyles() {
  console.log('🎨 Converting REAL AI responses to style files...\n');
  
  // Read the final results
  const resultsData = await fs.readFile('FINAL-real-model-results-1755614303582.json', 'utf8');
  const results = JSON.parse(resultsData);
  
  // Create styles directory
  const stylesDir = path.join(__dirname, 'ai-generated-styles');
  await fs.mkdir(stylesDir, { recursive: true });
  
  const styles = [];
  
  for (const result of results.results) {
    if (!result.success || !result.response) continue;
    
    const modelName = result.model.split('/')[1].split(':')[0];
    console.log(`\n📝 Processing ${modelName}...`);
    
    try {
      // Extract JSON from response
      const jsonMatch = result.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log('   ⚠️ No JSON found in response');
        continue;
      }
      
      const styleData = JSON.parse(jsonMatch[0]);
      console.log(`   ✅ Parsed style: "${styleData.name || styleData.website_name || styleData.websiteName}"`);
      
      // Create comprehensive style object
      const style = {
        id: modelName.replace(/[^a-z0-9]/gi, '-'),
        model: result.model,
        generatedBy: modelName,
        timestamp: result.timestamp,
        name: styleData.name || styleData.website_name || styleData.websiteName || 'Unnamed Style',
        philosophy: styleData.tagline || styleData.philosophy || styleData.motto || '',
        colors: {
          primary: styleData.primary_color || styleData.primary_color_hex || styleData.primaryColor || '#FF00FF',
          secondary: styleData.secondary_color || '#00FFFF',
          accent: styleData.accent_color || '#FFFF00',
          background: styleData.background || '#000000',
          text: styleData.text_color || '#FFFFFF'
        },
        features: styleData.unique_features || styleData.features || [],
        hero: {
          headline: styleData.hero_headline || styleData.heroHeadline || styleData.headline || 'WELCOME TO THE FUTURE',
          subheadline: styleData.hero_subheadline || styleData.subheadline || styleData.tagline || '',
          cta: styleData.cta || 'ENTER THE MATRIX'
        },
        typography: {
          headingFont: styleData.heading_font || 'system-ui',
          bodyFont: styleData.body_font || 'system-ui',
          scale: styleData.font_scale || 1.2
        },
        layout: {
          style: styleData.layout_style || 'chaotic',
          density: styleData.density || 'maximum'
        },
        animations: styleData.animations || ['glitch', 'particle', 'morph'],
        originalResponse: result.response,
        usage: result.usage
      };
      
      // Save individual style file
      const filename = `style-${style.id}-${Date.now()}.json`;
      await fs.writeFile(
        path.join(stylesDir, filename),
        JSON.stringify(style, null, 2)
      );
      
      console.log(`   💾 Saved as ${filename}`);
      styles.push(style);
      
    } catch (error) {
      console.log(`   ❌ Error processing: ${error.message}`);
    }
  }
  
  // Create master styles collection
  const masterFile = path.join(stylesDir, 'AI-GENERATED-STYLES-MASTER.json');
  await fs.writeFile(
    masterFile,
    JSON.stringify({
      generated: new Date().toISOString(),
      source: 'REAL OpenRouter API Calls',
      models: results.totalModels,
      successful: styles.length,
      styles
    }, null, 2)
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ CONVERSION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`\n📁 Generated ${styles.length} style files in: ai-generated-styles/`);
  console.log(`📚 Master file: AI-GENERATED-STYLES-MASTER.json`);
  
  console.log('\n🎨 Styles created from REAL AI:');
  styles.forEach((s, i) => {
    console.log(`   ${i + 1}. "${s.name}" by ${s.generatedBy}`);
    if (s.philosophy) {
      console.log(`      → ${s.philosophy}`);
    }
  });
  
  console.log('\n🚀 These are ACTUAL AI-generated styles, not simulations!');
  
  // Create a showcase HTML file
  const showcaseHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Generated Styles Showcase</title>
  <style>
    body {
      font-family: system-ui;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
      font-size: 3rem;
      margin-bottom: 2rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .styles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }
    .style-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s;
    }
    .style-card:hover {
      transform: translateY(-5px);
    }
    .style-name {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .style-model {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 1rem;
    }
    .style-philosophy {
      font-style: italic;
      margin-bottom: 1rem;
      color: #ffd700;
    }
    .style-features {
      list-style: none;
      padding: 0;
    }
    .style-features li {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }
    .style-features li:before {
      content: "✨";
      position: absolute;
      left: 0;
    }
    .color-preview {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .color-box {
      width: 30px;
      height: 30px;
      border-radius: 5px;
      border: 1px solid rgba(255,255,255,0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 Real AI-Generated Styles</h1>
    <p style="text-align: center; font-size: 1.2rem; margin-bottom: 3rem;">
      Created by actual AI models via OpenRouter API - Not simulations!
    </p>
    <div class="styles-grid">
${styles.map(style => `
      <div class="style-card">
        <div class="style-name">${style.name}</div>
        <div class="style-model">by ${style.generatedBy}</div>
        <div class="style-philosophy">"${style.philosophy}"</div>
        <div class="style-hero" style="font-weight: bold; margin: 1rem 0;">${style.hero.headline}</div>
        <ul class="style-features">
          ${style.features.slice(0, 3).map(f => `<li>${f.substring(0, 100)}...</li>`).join('')}
        </ul>
        <div class="color-preview">
          <div class="color-box" style="background: ${style.colors.primary}" title="Primary"></div>
          <div class="color-box" style="background: ${style.colors.secondary}" title="Secondary"></div>
          <div class="color-box" style="background: ${style.colors.accent}" title="Accent"></div>
        </div>
      </div>
`).join('')}
    </div>
  </div>
</body>
</html>`;
  
  await fs.writeFile(
    path.join(stylesDir, 'showcase.html'),
    showcaseHtml
  );
  
  console.log('\n🌐 Showcase HTML created: ai-generated-styles/showcase.html');
  console.log('   Open this file in a browser to see all the styles!');
}

convertResponsesToStyles().catch(console.error);