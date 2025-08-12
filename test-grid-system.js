#!/usr/bin/env node

// Comprehensive test suite for Grid 2.0 system
// Tests all core functionality end-to-end

const API_BASE = 'http://localhost:3000';
let sessionId = null;
let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    console.log(`\n📝 Testing: ${name}`);
    await fn();
    console.log(`✅ PASSED: ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAILED: ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
}

async function apiCall(endpoint, data) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionId ? { 'Cookie': `grid2_session=${sessionId}` } : {})
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  const result = await response.json();
  
  // Capture session ID from init
  if (result.sessionId) {
    sessionId = result.sessionId;
  }
  
  return result;
}

async function runTests() {
  console.log('🚀 Grid 2.0 System Test Suite');
  console.log('=============================');
  
  // Test 1: Preview API initialization
  await test('Preview API - Initialize session', async () => {
    const result = await apiCall('/api/preview', {
      action: 'init',
      sections: [
        {
          id: 'hero-test',
          type: 'hero-split-image-left',
          meta: {
            kind: 'hero',
            variant: 'split-image-left',
            name: 'Hero • Split Image Left'
          },
          props: {
            tone: 'bold',
            content: { headline: 'Test Hero' }
          }
        }
      ]
    });
    
    if (!result.sessionId) throw new Error('No session ID returned');
    if (!result.sections || result.sections.length === 0) {
      throw new Error('No sections returned');
    }
    console.log(`   Session ID: ${result.sessionId}`);
    console.log(`   Sections: ${result.sections.length}`);
  });
  
  // Test 2: Transform commands
  await test('Preview API - Transform command', async () => {
    const result = await apiCall('/api/preview', {
      action: 'command',
      sessionId: sessionId,
      command: 'make hero more dramatic'
    });
    
    if (!result.intents || result.intents.length === 0) {
      throw new Error('No intents detected');
    }
    if (!result.sections) throw new Error('No sections in response');
    
    console.log(`   Intents: ${result.intents.join(', ')}`);
    console.log(`   Analysis: ${result.analysis?.summary || 'none'}`);
  });
  
  // Test 3: Preview without committing
  await test('Preview API - Preview transform', async () => {
    const result = await apiCall('/api/preview', {
      action: 'preview',
      sessionId: sessionId,
      command: 'add urgency'
    });
    
    if (!result.preview) throw new Error('No preview returned');
    if (!result.intents) throw new Error('No intents returned');
    
    console.log(`   Preview sections: ${result.preview.length}`);
    console.log(`   Can undo: ${result.canUndo}`);
    console.log(`   Can redo: ${result.canRedo}`);
  });
  
  // Test 4: Undo functionality
  await test('Preview API - Undo', async () => {
    const result = await apiCall('/api/preview', {
      action: 'undo',
      sessionId: sessionId
    });
    
    if (!result.sections) throw new Error('No sections after undo');
    console.log(`   Sections after undo: ${result.sections.length}`);
    console.log(`   Can redo: ${result.canRedo}`);
  });
  
  // Test 5: Redo functionality
  await test('Preview API - Redo', async () => {
    const result = await apiCall('/api/preview', {
      action: 'redo',
      sessionId: sessionId
    });
    
    if (!result.sections) throw new Error('No sections after redo');
    console.log(`   Sections after redo: ${result.sections.length}`);
  });
  
  // Test 6: Get current state
  await test('Preview API - Get state', async () => {
    const result = await apiCall('/api/preview', {
      action: 'get',
      sessionId: sessionId
    });
    
    if (!result.sections) throw new Error('No sections in get response');
    console.log(`   Current sections: ${result.sections.length}`);
  });
  
  // Test 7: AI Director endpoint
  await test('AI Director API', async () => {
    const result = await apiCall('/api/ai-director', {
      prompt: 'Create a SaaS landing page',
      style: 'apple'
    });
    
    if (!result.page) throw new Error('No page generated');
    if (!result.spec) throw new Error('No spec generated');
    
    console.log(`   Sections generated: ${result.page.sections.length}`);
    console.log(`   Style: ${result.spec.style?.tone}`);
    console.log(`   Primary color: ${result.spec.brandTokens?.colors?.primary}`);
  });
  
  // Test 8: Export API - Static HTML
  await test('Export API - Static HTML', async () => {
    const result = await apiCall('/api/export', {
      format: 'static',
      sections: [
        {
          id: 'test-hero',
          type: 'hero-split-image-left',
          meta: {
            kind: 'hero',
            variant: 'split-image-left',
            name: 'Hero • Split Image Left'
          },
          props: {
            tone: 'minimal',
            content: { headline: 'Export Test' }
          }
        }
      ]
    });
    
    if (!result.files) throw new Error('No files in export');
    const indexFile = result.files.find(f => f.path === 'index.html');
    if (!indexFile) throw new Error('No index.html in export');
    
    console.log(`   Files exported: ${result.files.length}`);
    console.log(`   HTML size: ${indexFile.content.length} bytes`);
  });
  
  // Test 9: Export API - Next.js
  await test('Export API - Next.js', async () => {
    const result = await apiCall('/api/export', {
      format: 'nextjs',
      includeSource: true,
      sections: [
        {
          id: 'test-hero',
          type: 'hero-split-image-left',
          meta: {
            kind: 'hero',
            variant: 'split-image-left',
            name: 'Hero • Split Image Left'
          },
          props: {
            tone: 'bold',
            content: { headline: 'Next.js Export' }
          }
        }
      ]
    });
    
    if (!result.files) throw new Error('No files in export');
    const packageJson = result.files.find(f => f.path === 'package.json');
    if (!packageJson) throw new Error('No package.json in export');
    
    console.log(`   Files exported: ${result.files.length}`);
    console.log(`   Has components: ${result.files.some(f => f.path.includes('components'))}`);
  });
  
  // Test 10: Beam search determinism
  await test('Beam Search - Determinism', async () => {
    const prompt = 'Create a product landing page';
    
    // Run twice with same input
    const result1 = await apiCall('/api/ai-director', { prompt });
    const result2 = await apiCall('/api/ai-director', { prompt });
    
    // Check if sections are identical
    const sections1 = result1.page.sections.map(s => s.type).join(',');
    const sections2 = result2.page.sections.map(s => s.type).join(',');
    
    if (sections1 !== sections2) {
      throw new Error('Beam search not deterministic!');
    }
    
    console.log(`   Sections order: ${sections1}`);
    console.log(`   ✓ Deterministic output confirmed`);
  });
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log(`   📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
  
  if (testsFailed > 0) {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Grid 2.0 is working correctly.');
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});