// Generate missing AI images for zen, playful, luxury, and creative tones
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Missing images based on console logs
const MISSING_IMAGES = [
  // Zen - all missing
  {
    tone: 'zen',
    section: 'hero',
    prompt: 'Minimalist zen garden with perfectly raked sand patterns, single stone, soft morning light, tranquil atmosphere, muted earth tones, Japanese aesthetic, wide angle, photorealistic, 8k quality, serene and balanced composition'
  },
  {
    tone: 'zen',
    section: 'features',
    prompt: 'Three zen stones stacked in perfect balance on calm water surface, ripples emanating outward, bamboo in background, soft natural lighting, minimalist composition, meditation concept, photorealistic, professional photography'
  },
  {
    tone: 'zen',
    section: 'cta',
    prompt: 'Peaceful meditation space with floor cushions, bamboo screens, soft natural light filtering through, minimal decor, warm wood tones, inviting atmosphere, professional interior photography, magazine quality'
  },
  
  // Playful - missing cta
  {
    tone: 'playful',
    section: 'cta',
    prompt: 'Colorful confetti explosion with balloons, party streamers, bright rainbow colors, celebration atmosphere, dynamic motion, joyful energy, professional product photography, vibrant and fun composition'
  },
  
  // Luxury - missing cta
  {
    tone: 'luxury',
    section: 'cta',
    prompt: 'Elegant gold and black marble texture with metallic accents, premium materials, sophisticated lighting, luxury product backdrop, high-end aesthetic, professional commercial photography, rich and opulent'
  },
  
  // Creative - missing hero
  {
    tone: 'creative',
    section: 'hero',
    prompt: 'Abstract artistic explosion of paint splashes, vibrant colors mixing in mid-air, creative chaos, dynamic motion, artistic expression, professional studio photography, bold and unconventional composition'
  },
  
  // Modern - missing features
  {
    tone: 'modern',
    section: 'features',
    prompt: 'Futuristic holographic interface with floating data visualizations, neon blue and purple gradients, tech startup aesthetic, clean geometric shapes, professional tech photography, innovative and cutting-edge'
  }
];

console.log('🎨 Missing Images to Generate:');
console.log('================================');

MISSING_IMAGES.forEach(img => {
  const filename = `${img.tone}-${img.section}-ai-patient-${Date.now()}.png`;
  const filepath = path.join(__dirname, 'public', 'generated-images', filename);
  
  console.log(`\n📍 ${img.tone.toUpperCase()} - ${img.section.toUpperCase()}`);
  console.log(`   Filename: ${filename}`);
  console.log(`   Prompt:`);
  console.log(`   "${img.prompt}"`);
  console.log(`   `);
  console.log(`   Copy this prompt to ChatGPT/DALL-E and save as:`);
  console.log(`   ${filepath}`);
});

console.log('\n================================');
console.log('📋 INSTRUCTIONS:');
console.log('1. Open https://chat.openai.com or DALL-E');
console.log('2. Copy each prompt above');
console.log('3. Generate the image');
console.log('4. Download and save with the exact filename shown');
console.log('5. Place in public/generated-images/');
console.log('\n✨ These will complete the missing sections!');

// Also create a script to update the manifest
console.log('\n================================');
console.log('📝 After generating images, run:');
console.log('   node update-ai-manifest.mjs');

// Generate update script
const updateScriptContent = `// Update AI manifest with new images
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
`;

fs.writeFileSync(path.join(__dirname, 'update-ai-manifest.mjs'), updateScriptContent);
console.log('✅ Created update-ai-manifest.mjs');