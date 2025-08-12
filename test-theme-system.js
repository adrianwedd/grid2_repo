#!/usr/bin/env node

// Test theme system functionality

const API_BASE = 'http://localhost:3000';

async function test(name, fn) {
  try {
    console.log(`\n📝 Testing: ${name}`);
    await fn();
    console.log(`✅ PASSED: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ FAILED: ${name}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🎨 Theme System Test Suite');
  console.log('===========================');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Theme Cache API
  if (await test('Theme Cache API - List themes', async () => {
    const response = await fetch(`${API_BASE}/api/claude-cache-list`);
    if (!response.ok) throw new Error('API call failed');
    
    const themes = await response.json();
    if (!Array.isArray(themes)) throw new Error('Response is not an array');
    if (themes.length === 0) throw new Error('No themes found');
    
    console.log(`   Found ${themes.length} cached themes`);
    
    // Check theme structure
    const firstTheme = themes[0];
    if (!firstTheme.philosophy) throw new Error('Theme missing philosophy');
    if (!firstTheme.spec) throw new Error('Theme missing spec');
    
    console.log(`   First theme: "${firstTheme.philosophy.substring(0, 50)}..."`);
  })) passed++; else failed++;
  
  // Test 2: Theme structure validation
  if (await test('Theme Structure - Valid brand tokens', async () => {
    const response = await fetch(`${API_BASE}/api/claude-cache-list`);
    const themes = await response.json();
    
    // Find themes with complete brand tokens
    const completeThemes = themes.filter(theme => 
      theme.spec?.brandTokens?.colors?.primary &&
      theme.spec?.brandTokens?.typography?.headingFont
    );
    
    if (completeThemes.length === 0) {
      throw new Error('No themes with complete brand tokens');
    }
    
    console.log(`   ${completeThemes.length}/${themes.length} themes have complete brand tokens`);
    
    const example = completeThemes[0];
    console.log(`   Example colors: ${example.spec.brandTokens.colors.primary}`);
    console.log(`   Example font: ${example.spec.brandTokens.typography.headingFont}`);
  })) passed++; else failed++;
  
  // Test 3: Editor page has theme button
  if (await test('Editor UI - Theme button exists', async () => {
    const response = await fetch(`${API_BASE}/editor`);
    const html = await response.text();
    
    if (!html.includes('🎨')) {
      throw new Error('Theme button (🎨) not found in editor');
    }
    
    if (!html.includes('ThemeModal')) {
      throw new Error('ThemeModal component not found');
    }
    
    console.log(`   Theme button and modal component present`);
  })) passed++; else failed++;
  
  // Test 4: Check for luxury/gold themes
  if (await test('Theme Variety - Luxury themes exist', async () => {
    const response = await fetch(`${API_BASE}/api/claude-cache-list`);
    const themes = await response.json();
    
    const luxuryThemes = themes.filter(theme => 
      theme.philosophy?.toLowerCase().includes('luxury') ||
      theme.philosophy?.toLowerCase().includes('versailles') ||
      theme.philosophy?.toLowerCase().includes('gold') ||
      theme.spec?.brandTokens?.colors?.primary?.includes('d4af37') // Gold color
    );
    
    if (luxuryThemes.length === 0) {
      throw new Error('No luxury-themed designs found');
    }
    
    console.log(`   Found ${luxuryThemes.length} luxury themes`);
    console.log(`   Example: "${luxuryThemes[0].philosophy.substring(0, 60)}..."`);
  })) passed++; else failed++;
  
  // Test 5: Check for different style philosophies
  if (await test('Theme Variety - Multiple design philosophies', async () => {
    const response = await fetch(`${API_BASE}/api/claude-cache-list`);
    const themes = await response.json();
    
    const philosophies = {
      apple: themes.filter(t => t.philosophy?.toLowerCase().includes('apple')),
      stripe: themes.filter(t => t.philosophy?.toLowerCase().includes('stripe')),
      notion: themes.filter(t => t.philosophy?.toLowerCase().includes('notion')),
      vercel: themes.filter(t => t.philosophy?.toLowerCase().includes('vercel')),
      modern: themes.filter(t => t.philosophy?.toLowerCase().includes('modern')),
    };
    
    const counts = Object.entries(philosophies)
      .filter(([_, themes]) => themes.length > 0)
      .map(([name, themes]) => `${name}: ${themes.length}`);
    
    if (counts.length < 3) {
      throw new Error('Not enough variety in design philosophies');
    }
    
    console.log(`   Philosophy distribution: ${counts.join(', ')}`);
  })) passed++; else failed++;
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Theme System Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some theme tests failed.');
    process.exit(1);
  } else {
    console.log('\n🎉 Theme system is working correctly!');
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});