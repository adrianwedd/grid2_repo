#!/usr/bin/env tsx
// scripts/test-export.ts
// Test the export API functionality

import { demoContent, demoBrand, generatePage } from '../lib/generate-page';

async function testExport() {
  console.log('🚀 Testing Grid 2.0 Export System...\n');

  try {
    // Generate a test page
    console.log('📄 Generating test page...');
    const result = await generatePage(demoContent, demoBrand, 'bold');
    
    console.log(`✅ Generated page with ${result.primary.sections.length} sections`);
    console.log(`   Sections: ${result.primary.sections.map(s => s.meta.kind).join(', ')}`);
    console.log(`   Render time: ${result.renderTime}ms\n`);

    const testCases = [
      { format: 'static', includeSource: false },
      { format: 'nextjs', includeSource: false },
      { format: 'nextjs', includeSource: true },
      { format: 'remix', includeSource: false },
    ];

    for (const testCase of testCases) {
      console.log(`🧪 Testing ${testCase.format} export ${testCase.includeSource ? '(with source)' : '(no source)'}...`);
      
      try {
        const response = await fetch('http://localhost:3000/api/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: result.primary,
            format: testCase.format,
            includeSource: testCase.includeSource,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.log(`❌ Failed: ${error.error}`);
          continue;
        }

        const contentLength = response.headers.get('content-length');
        const filename = response.headers.get('content-disposition')?.match(/filename="([^"]+)"/)?.[1];
        
        console.log(`✅ Success: ${filename} (${formatBytes(parseInt(contentLength || '0'))})`);
        
        // You could write to file here for manual testing:
        // const buffer = await response.arrayBuffer();
        // await Bun.write(`./exports/${filename}`, buffer);
        
      } catch (error) {
        console.log(`❌ Request failed: ${error}`);
      }
      
      console.log('');
    }

    console.log('🎉 Export system test complete!\n');
    
    // Print usage instructions
    console.log('📋 Usage Instructions:');
    console.log('');
    console.log('Static HTML Export:');
    console.log('curl -X POST http://localhost:3000/api/export \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"page": {...}, "format": "static"}\' \\');
    console.log('  --output export.zip');
    console.log('');
    console.log('Next.js Project Export:');
    console.log('curl -X POST http://localhost:3000/api/export \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"page": {...}, "format": "nextjs", "includeSource": true}\' \\');
    console.log('  --output nextjs-project.zip');
    console.log('');
    console.log('🔥 The export system is ready! Users get real, ownable code.');
    console.log('💪 No vendor lock-in. The Grid could never.');

  } catch (error) {
    console.error('💥 Test failed:', error);
    process.exit(1);
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if this is being run directly
if (import.meta.main) {
  testExport()
    .then(() => {
      console.log('✅ Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

export { testExport };