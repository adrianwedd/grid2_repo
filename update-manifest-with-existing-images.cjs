const fs = require('fs');
const path = require('path');

// Read the current manifest
const manifestPath = path.join(__dirname, 'public', 'generated-images', 'ai-patient-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log('🔧 Updating manifest with existing newer images...');

// Update failed entries with newer generated images
// luxury-cta
if (manifest.luxury && manifest.luxury.cta && manifest.luxury.cta.error) {
  manifest.luxury.cta = {
    "filename": "luxury-cta-ai-generated-1755558393973.png",
    "filepath": "public/generated-images/luxury-cta-ai-generated-1755558393973.png",
    "style": "luxury",
    "section": "cta", 
    "type": "ai-generated",
    "timestamp": 1755558393973,
    "prompt": "Elegant gold and black marble texture with metallic accents, premium materials, sophisticated lighting, luxury product backdrop, high-end aesthetic, professional commercial photography, rich and opulent"
  };
  console.log('✅ Fixed luxury CTA');
}

// modern-features
if (manifest.modern && manifest.modern.features && manifest.modern.features.error) {
  manifest.modern.features = {
    "filename": "modern-features-ai-generated-1755558416357.png",
    "filepath": "public/generated-images/modern-features-ai-generated-1755558416357.png", 
    "style": "modern",
    "section": "features",
    "type": "ai-generated",
    "timestamp": 1755558416357,
    "prompt": "Futuristic holographic interface with floating data visualizations, neon blue and purple gradients, tech startup aesthetic, clean geometric shapes, professional tech photography, innovative and cutting-edge"
  };
  console.log('✅ Fixed modern features');
}

// playful-cta
if (manifest.playful && manifest.playful.cta && manifest.playful.cta.error) {
  manifest.playful.cta = {
    "filename": "playful-cta-ai-generated-1755558443948.png",
    "filepath": "public/generated-images/playful-cta-ai-generated-1755558443948.png",
    "style": "playful",
    "section": "cta",
    "type": "ai-generated", 
    "timestamp": 1755558443948,
    "prompt": "Colorful confetti explosion with balloons, party streamers, bright rainbow colors, celebration atmosphere, dynamic motion, joyful energy, professional product photography, vibrant and fun composition"
  };
  console.log('✅ Fixed playful CTA');
}

// creative-hero 
if (manifest.creative && manifest.creative.hero && manifest.creative.hero.error) {
  manifest.creative.hero = {
    "filename": "creative-hero-ai-generated-1755558365363.png", 
    "filepath": "public/generated-images/creative-hero-ai-generated-1755558365363.png",
    "style": "creative",
    "section": "hero",
    "type": "ai-generated",
    "timestamp": 1755558365363,
    "prompt": "Abstract artistic explosion of paint splashes, vibrant colors mixing in mid-air, creative chaos, dynamic motion, artistic expression, professional studio photography, bold and unconventional composition"
  };
  console.log('✅ Fixed creative hero');
}

// Add zen (completely missing)
if (!manifest.zen) {
  manifest.zen = {
    "hero": {
      "filename": "zen-hero-1755561010115.png",
      "filepath": "public/generated-images/zen-hero-1755561010115.png",
      "style": "zen",
      "section": "hero", 
      "type": "ai-generated",
      "timestamp": 1755561010115,
      "prompt": "Minimalist zen garden with perfectly raked sand patterns, single stone, soft morning light, tranquil atmosphere, muted earth tones, Japanese aesthetic, wide angle, photorealistic, 8k quality, serene and balanced composition"
    }
  };
  console.log('✅ Added zen hero');
}

// Write the updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('🎉 Manifest updated successfully!');

// Summary
const totalImages = Object.values(manifest).reduce((count, tone) => {
  if (typeof tone === 'object' && tone !== null) {
    return count + Object.values(tone).filter(section => section && !section.error).length;
  }
  return count;
}, 0);

console.log(`📊 Total images in manifest: ${totalImages}`);
console.log(`🎨 Tones covered: ${Object.keys(manifest).length}`);