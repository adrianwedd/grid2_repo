#!/usr/bin/env node

/**
 * Test AI Image Provider System
 * 
 * Tests multiple providers and styles
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

// Test configurations
const TEST_CASES = [
  {
    name: 'Minimal Tech Hero',
    prompt: 'A minimalist tech startup hero image with geometric shapes and clean lines',
    style: 'minimal',
    aspectRatio: '16:9',
    quality: 'standard'
  },
  {
    name: 'Bold Creative Agency',
    prompt: 'A bold, dramatic creative agency hero with vibrant colors and dynamic composition',
    style: 'bold',
    aspectRatio: '16:9',
    quality: 'high'
  },
  {
    name: 'Playful App Landing',
    prompt: 'A playful, colorful mobile app landing page hero with fun illustrations',
    style: 'playful',
    aspectRatio: '9:16',
    quality: 'standard'
  },
  {
    name: 'Professional Corporate',
    prompt: 'A professional corporate website hero with modern office and business themes',
    style: 'photorealistic',
    aspectRatio: '16:9',
    quality: 'high'
  },
  {
    name: 'Artistic Portfolio',
    prompt: 'An artistic portfolio hero with creative textures and unique visual style',
    style: 'artistic',
    aspectRatio: '4:3',
    quality: 'standard'
  }
];

async function checkProviderStatus() {
  console.log('🔍 Checking provider status...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/generate-image`);
    const status = await response.json();
    
    console.log('Provider Status:');
    console.log('═══════════════════════════════════════════');
    console.log(`Configured Providers: ${status.configuredProviders.length}/${status.totalProviders}`);
    
    if (status.configuredProviders.length > 0) {
      console.log('\n✅ Active Providers:');
      status.configuredProviders.forEach(p => console.log(`   • ${p}`));
    } else {
      console.log('\n⚠️  No AI providers configured');
      console.log('   Images will use Unsplash placeholders');
    }
    
    console.log('\n📋 Supported Options:');
    console.log(`   Styles: ${status.supportedStyles.join(', ')}`);
    console.log(`   Ratios: ${status.supportedAspectRatios.join(', ')}`);
    console.log(`   Quality: ${status.supportedQualities.join(', ')}`);
    console.log('═══════════════════════════════════════════\n');
    
    return status;
  } catch (error) {
    console.error('❌ Failed to check provider status:', error.message);
    return null;
  }
}

async function testImageGeneration(testCase) {
  console.log(`\n🎨 Testing: ${testCase.name}`);
  console.log(`   Prompt: "${testCase.prompt.substring(0, 50)}..."`);
  console.log(`   Style: ${testCase.style}, Ratio: ${testCase.aspectRatio}, Quality: ${testCase.quality}`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API returned ${response.status}: ${error}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`   ✅ Success!`);
      console.log(`   Provider: ${result.provider} (${result.model})`);
      console.log(`   Cost: $${result.estimatedCost.toFixed(3)}`);
      
      // Check if it's a data URL or regular URL
      if (result.image.startsWith('data:')) {
        console.log(`   Image: [Base64 data, ${result.image.length} chars]`);
      } else {
        console.log(`   Image: ${result.image.substring(0, 60)}...`);
      }
      
      return result;
    } else {
      console.log(`   ❌ Generation failed: ${result.error}`);
      return null;
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 AI Image Provider Testing Suite');
  console.log('═══════════════════════════════════════════\n');
  
  // Check provider status
  const status = await checkProviderStatus();
  if (!status) {
    console.log('\n❌ Cannot connect to API. Is the server running?');
    process.exit(1);
  }
  
  // Run test cases
  console.log('Running test cases...');
  const results = [];
  let successCount = 0;
  let totalCost = 0;
  
  for (const testCase of TEST_CASES) {
    const result = await testImageGeneration(testCase);
    if (result) {
      successCount++;
      totalCost += result.estimatedCost || 0;
      results.push({ ...testCase, result });
    }
    
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('📊 Test Summary');
  console.log('═══════════════════════════════════════════');
  console.log(`Tests Run: ${TEST_CASES.length}`);
  console.log(`Successful: ${successCount}/${TEST_CASES.length}`);
  console.log(`Total Estimated Cost: $${totalCost.toFixed(3)}`);
  
  // Provider usage
  const providerUsage = {};
  results.forEach(r => {
    if (r.result) {
      providerUsage[r.result.provider] = (providerUsage[r.result.provider] || 0) + 1;
    }
  });
  
  if (Object.keys(providerUsage).length > 0) {
    console.log('\n🏆 Provider Usage:');
    Object.entries(providerUsage).forEach(([provider, count]) => {
      console.log(`   ${provider}: ${count} images`);
    });
  }
  
  // Save results
  const timestamp = Date.now();
  const filename = `image-test-results-${timestamp}.json`;
  await fs.writeFile(
    filename,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      status,
      testCases: TEST_CASES,
      results: results.map(r => ({
        ...r,
        // Don't save base64 data to file
        result: r.result ? {
          ...r.result,
          image: r.result.image.startsWith('data:') ? '[BASE64_DATA]' : r.result.image
        } : null
      })),
      summary: {
        testsRun: TEST_CASES.length,
        successful: successCount,
        totalCost: totalCost,
        providerUsage
      }
    }, null, 2)
  );
  
  console.log(`\n📁 Results saved to: ${filename}`);
  
  // Instructions for adding API keys
  if (status.configuredProviders.length === 0) {
    console.log('\n💡 To enable AI image generation, add API keys to .env.local:');
    console.log('   OPENAI_API_KEY=your_openai_key');
    console.log('   STABILITY_API_KEY=your_stability_key');
    console.log('   REPLICATE_API_TOKEN=your_replicate_token');
    console.log('   TOGETHER_API_KEY=your_together_key');
  }
}

// Run tests
runTests().catch(console.error);