// Update AI manifest with new images
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestPath = path.join(__dirname, 'public', 'generated-images', 'ai-patient-manifest.json');

// Read existing manifest
let manifest = {};
try {
  const existing = fs.readFileSync(manifestPath, 'utf8');
  manifest = JSON.parse(existing);
} catch (e) {
  console.log('Creating new manifest');
}

// Add missing entries
const updates = {
  zen: {
    hero: { filename: 'zen-hero-ai-patient-NEW.png', style: 'Zen garden', colors: ['#8b7a6b', '#d4c4b0', '#e8ddc7'] },
    features: { filename: 'zen-features-ai-patient-NEW.png', style: 'Zen stones', colors: ['#8b7a6b', '#d4c4b0', '#e8ddc7'] },
    cta: { filename: 'zen-cta-ai-patient-NEW.png', style: 'Meditation space', colors: ['#8b7a6b', '#d4c4b0', '#e8ddc7'] }
  },
  playful: {
    ...manifest.playful,
    cta: { filename: 'playful-cta-ai-patient-NEW.png', style: 'Confetti explosion', colors: ['#f472b6', '#fbbf24', '#60a5fa'] }
  },
  luxury: {
    ...manifest.luxury,
    cta: { filename: 'luxury-cta-ai-patient-NEW.png', style: 'Gold marble', colors: ['#d97706', '#000000', '#fef3c7'] }
  },
  creative: {
    hero: { filename: 'creative-hero-ai-patient-NEW.png', style: 'Paint explosion', colors: ['#dc2626', '#f59e0b', '#8b5cf6'] },
    ...manifest.creative
  },
  modern: {
    ...manifest.modern,
    features: { filename: 'modern-features-ai-patient-NEW.png', style: 'Holographic UI', colors: ['#0891b2', '#8b5cf6', '#67e8f9'] }
  }
};

// Merge updates
Object.keys(updates).forEach(tone => {
  if (!manifest[tone]) manifest[tone] = {};
  Object.assign(manifest[tone], updates[tone]);
});

// Write updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Manifest updated with new images');
console.log('Remember to replace NEW.png with actual generated filenames!');
