// Quick test to verify Claude Director hook restoration
const fs = require('fs');

// Read the RealtimeEditor file to verify the hook is properly imported
const editorContent = fs.readFileSync('./components/RealtimeEditor.tsx', 'utf8');

console.log('🔍 Checking Claude Director hook integration...');

// Check that the import is restored
if (editorContent.includes("import { useClaudeDirector } from '@/lib/hooks/useClaudeDirector';")) {
  console.log('✅ Import statement restored');
} else {
  console.log('❌ Import statement missing');
  process.exit(1);
}

// Check that the hook is being used
if (editorContent.includes('generate: generateWithClaude,')) {
  console.log('✅ Hook is properly destructured');
} else {
  console.log('❌ Hook destructuring missing');
  process.exit(1);
}

// Check that old stub code is removed
if (editorContent.includes('Claude Director temporarily disabled')) {
  console.log('❌ Stub code still present');
  process.exit(1);
} else {
  console.log('✅ Stub code removed');
}

// Check that the generateWithClaude function is called
if (editorContent.includes('await generateWithClaude(claudePrompt)')) {
  console.log('✅ Function call present');
} else {
  console.log('❌ Function call missing');
  process.exit(1);
}

console.log('\n🎉 Claude Director hook successfully restored!');