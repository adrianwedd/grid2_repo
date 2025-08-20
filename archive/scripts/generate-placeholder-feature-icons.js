// Generate placeholder SVG icons for features
import fs from 'fs';
import path from 'path';

const FEATURE_ICONS = {
  'clean-interface': {
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f0f4f8"/>
      <rect x="40" y="40" width="120" height="80" rx="8" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <rect x="50" y="50" width="100" height="20" rx="4" fill="#e0e7ff"/>
      <rect x="50" y="80" width="60" height="8" rx="2" fill="#dbeafe"/>
      <rect x="50" y="95" width="80" height="8" rx="2" fill="#dbeafe"/>
      <circle cx="140" cy="90" r="15" fill="#3b82f6" opacity="0.2"/>
      <path d="M135 90 L140 95 L145 85" stroke="#3b82f6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    description: 'Clean interface'
  },
  'fast-performance': {
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f0f4f8"/>
      <path d="M100 40 L120 80 L110 80 L110 120 L90 120 L90 80 L80 80 Z" fill="#10b981" opacity="0.9"/>
      <circle cx="100" cy="140" r="20" fill="none" stroke="#10b981" stroke-width="2"/>
      <circle cx="100" cy="140" r="15" fill="#10b981" opacity="0.2"/>
      <rect x="60" y="160" width="80" height="4" rx="2" fill="#10b981" opacity="0.4"/>
    </svg>`,
    description: 'Fast performance'
  },
  'simple-workflow': {
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f0f4f8"/>
      <circle cx="50" cy="100" r="15" fill="#8b5cf6" opacity="0.8"/>
      <circle cx="100" cy="100" r="15" fill="#8b5cf6" opacity="0.8"/>
      <circle cx="150" cy="100" r="15" fill="#8b5cf6" opacity="0.8"/>
      <path d="M65 100 L85 100" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M115 100 L135 100" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrow)"/>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6"/>
        </marker>
      </defs>
    </svg>`,
    description: 'Simple workflow'
  }
};

// Create output directory
const outputDir = './public/generated-images/feature-icons';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating Placeholder Feature Icons');
console.log('=======================================\n');

const manifest = {};

for (const [featureName, config] of Object.entries(FEATURE_ICONS)) {
  const filename = `placeholder-${featureName}.svg`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, config.svg);
  console.log(`✅ Generated ${filename}`);
  
  manifest[featureName] = {
    filename,
    filepath,
    description: config.description,
    type: 'placeholder'
  };
}

// Save manifest
const manifestPath = path.join(outputDir, 'placeholder-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\n📄 Manifest saved to ${manifestPath}`);

console.log('\n✨ All placeholder icons generated successfully!');