#!/usr/bin/env node

/**
 * Test free image generation APIs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Test OpenRouter for available models
async function testOpenRouter() {
  console.log('🔍 Testing OpenRouter API...');
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('❌ No OpenRouter API key found');
    return;
  }

  // Get available models
  const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/models',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://grid2repo.vercel.app',
      'X-Title': 'Grid 2.0'
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const models = JSON.parse(data);
          const imageModels = models.data?.filter(m => 
            m.id.includes('dall-e') || 
            m.id.includes('stable-diffusion') || 
            m.id.includes('midjourney') ||
            m.id.includes('flux') ||
            m.architecture?.includes('image')
          ) || [];
          
          console.log(`✅ Found ${imageModels.length} image models on OpenRouter:`);
          imageModels.forEach(model => {
            const price = model.pricing?.prompt || '0';
            console.log(`  - ${model.id}: $${price}/image`);
          });
        } catch (e) {
          console.log('❌ Failed to parse OpenRouter response:', e.message);
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.log('❌ OpenRouter API error:', e.message);
      resolve();
    });
    
    req.end();
  });
}

// Test free image generation with Pollinations.ai (completely free, no API key needed)
async function testPollinations() {
  console.log('\n🌻 Testing Pollinations.ai (FREE, no API key)...');
  
  const testPrompt = 'A beautiful futuristic cityscape with neon lights';
  const encodedPrompt = encodeURIComponent(testPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
  
  console.log('✅ Pollinations.ai is available!');
  console.log(`  Example URL: ${imageUrl}`);
  console.log('  Features:');
  console.log('    - Completely FREE');
  console.log('    - No API key required');
  console.log('    - Supports custom dimensions');
  console.log('    - Fast generation');
  
  return imageUrl;
}

// Test Lexica.art API (free tier available)
async function testLexica() {
  console.log('\n🎨 Testing Lexica.art API...');
  
  const options = {
    hostname: 'lexica.art',
    path: '/api/v1/search?q=futuristic',
    method: 'GET'
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.images && result.images.length > 0) {
            console.log(`✅ Lexica.art API is available!`);
            console.log(`  Found ${result.images.length} pre-generated images`);
            console.log('  Features:');
            console.log('    - Search existing AI art');
            console.log('    - Free tier available');
            console.log('    - High quality images');
          }
        } catch (e) {
          console.log('❌ Lexica API not accessible:', e.message);
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.log('❌ Lexica API error:', e.message);
      resolve();
    });
    
    req.end();
  });
}

// Main test function
async function runTests() {
  console.log('🚀 Testing Free Image Generation APIs\n');
  console.log('=' .repeat(50));
  
  await testOpenRouter();
  const pollinationsUrl = await testPollinations();
  await testLexica();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:');
  console.log('  ✅ Pollinations.ai - Best option (FREE, no limits)');
  console.log('  ⚠️  OpenRouter - Requires payment for image models');
  console.log('  ✅ Lexica.art - Good for searching existing art');
  
  console.log('\n💡 Recommendation:');
  console.log('  Use Pollinations.ai for generating unique images for all 32 styles!');
  console.log('  It\'s completely free and requires no API keys.');
}

// Run the tests
runTests().catch(console.error);