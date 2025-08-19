const fs = require('fs');
const path = require('path');

// Read current manifest
const manifestPath = path.join(__dirname, 'public', 'generated-images', 'ai-patient-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Get all actual PNG files
const imagesDir = path.join(__dirname, 'public', 'generated-images');
const actualFiles = fs.readdirSync(imagesDir)
  .filter(f => f.endsWith('.png'))
  .reduce((acc, filename) => {
    // Parse filename pattern: tone-section-*.png
    const parts = filename.split('-');
    if (parts.length >= 3) {
      const tone = parts[0];
      const section = parts[1];
      
      if (!acc[tone]) acc[tone] = {};
      acc[tone][section] = filename;
    }
    return acc;
  }, {});

console.log('🔍 Found actual files:', actualFiles);

// Update manifest with correct filenames
for (const [tone, sections] of Object.entries(manifest)) {
  if (typeof sections === 'object' && sections !== null) {
    for (const [section, data] of Object.entries(sections)) {
      if (actualFiles[tone] && actualFiles[tone][section]) {
        const correctFilename = actualFiles[tone][section];
        console.log(`✅ Fixing ${tone}-${section}: ${data.filename} → ${correctFilename}`);
        manifest[tone][section] = {
          ...data,
          filename: correctFilename,
          filepath: `public/generated-images/${correctFilename}`
        };
        // Remove error field if present
        delete manifest[tone][section].error;
      } else {
        console.log(`⚠️ No file found for ${tone}-${section}`);
      }
    }
  }
}

// Handle special cases (techno is not in manifest but files exist)
if (actualFiles.techno && !manifest.techno) {
  manifest.techno = {
    hero: {
      filename: actualFiles.techno.hero,
      filepath: `public/generated-images/${actualFiles.techno.hero}`,
      style: 'techno',
      section: 'hero',
      type: 'ai-generated',
      timestamp: Date.now()
    },
    features: {
      filename: actualFiles.techno.features,
      filepath: `public/generated-images/${actualFiles.techno.features}`,
      style: 'techno', 
      section: 'features',
      type: 'ai-generated',
      timestamp: Date.now()
    },
    cta: {
      filename: actualFiles.techno.cta,
      filepath: `public/generated-images/${actualFiles.techno.cta}`,
      style: 'techno',
      section: 'cta', 
      type: 'ai-generated',
      timestamp: Date.now()
    }
  };
  console.log('✅ Added techno tone to manifest');
}

// Save updated manifest
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('🎉 Manifest updated with correct filenames!');

// Summary
const totalTones = Object.keys(manifest).length;
const totalImages = Object.values(manifest).reduce((count, tone) => {
  if (typeof tone === 'object' && tone !== null) {
    return count + Object.values(tone).filter(section => section && !section.error).length;
  }
  return count;
}, 0);

console.log(`📊 Final stats: ${totalTones} tones, ${totalImages} images`);