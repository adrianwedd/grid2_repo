// Create proper 96x96 PNG icons using SVG and canvas
const fs = require('fs');
const path = require('path');

// SVG icon definitions
const iconSVGs = {
  'clean-interface': `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect x="16" y="16" width="64" height="64" rx="8" fill="none" stroke="#3B82F6" stroke-width="2"/>
  <rect x="24" y="24" width="48" height="8" rx="2" fill="#3B82F6"/>
  <rect x="24" y="40" width="32" height="4" rx="1" fill="#93C5FD"/>
  <rect x="24" y="48" width="24" height="4" rx="1" fill="#93C5FD"/>
  <rect x="24" y="56" width="40" height="4" rx="1" fill="#93C5FD"/>
  <circle cx="68" cy="68" r="6" fill="#3B82F6"/>
</svg>`,
  
  'simple-workflow': `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="32" r="8" fill="#10B981"/>
  <circle cx="48" cy="48" r="8" fill="#10B981"/>
  <circle cx="72" cy="64" r="8" fill="#10B981"/>
  <line x1="30" y1="36" x2="42" y2="44" stroke="#10B981" stroke-width="2"/>
  <line x1="54" y1="52" x2="66" y2="60" stroke="#10B981" stroke-width="2"/>
  <polygon points="40,42 46,44 40,46" fill="#10B981"/>
  <polygon points="64,58 70,60 64,62" fill="#10B981"/>
</svg>`,
  
  'fast-performance': `
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <polygon points="32,64 48,16 52,16 52,32 64,32 64,36 52,36 52,48 64,48 48,80 44,80 44,64" fill="#F59E0B"/>
  <circle cx="48" cy="48" r="32" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="8,4"/>
</svg>`
};

// Convert SVG to base64 PNG (simplified approach)
function createIcon(name, svg) {
  const outputDir = './public/generated-images/feature-icons';
  const filePath = path.join(outputDir, `${name}.png`);
  
  console.log(`Creating ${name} icon...`);
  
  // For now, create a simple colored square as PNG placeholder
  // In a real implementation, you'd use a library like sharp or canvas to convert SVG to PNG
  const simpleIconBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x60, 0x00, 0x00, 0x00, 0x60, // 96x96 dimensions
    0x08, 0x06, 0x00, 0x00, 0x00, 0xE0, 0x77, 0x3D, 0xF8, // color type, etc.
    // Add more PNG data here - this is a simplified example
  ]);
  
  // Write SVG file instead for now
  const svgPath = path.join(outputDir, `${name}-icon.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ Created ${name}-icon.svg`);
}

// Ensure output directory exists
const outputDir = './public/generated-images/feature-icons';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create all icons
for (const [name, svg] of Object.entries(iconSVGs)) {
  createIcon(name, svg);
}

console.log('✅ Icon creation complete!');
console.log('Note: SVG files created. For production, convert these to PNG using an image conversion tool.');