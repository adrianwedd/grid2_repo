#!/usr/bin/env node

/**
 * Check the status of generated images
 */

const fs = require('fs');
const path = require('path');

function checkGeneratedImages() {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'ai-generated');
  
  if (!fs.existsSync(outputDir)) {
    console.log('❌ Output directory does not exist yet');
    return;
  }

  const manifestPath = path.join(outputDir, 'manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`📄 Manifest found: ${manifest.totalImages} images for ${manifest.totalStyles} styles`);
  }

  // Check directories
  const styleDirs = fs.readdirSync(outputDir).filter(name => 
    fs.statSync(path.join(outputDir, name)).isDirectory()
  );

  console.log(`📁 Found ${styleDirs.length} style directories:`);

  let totalImages = 0;
  styleDirs.forEach(styleDir => {
    const stylePath = path.join(outputDir, styleDir);
    const images = fs.readdirSync(stylePath).filter(name => 
      name.endsWith('.jpg') || name.endsWith('.png')
    );
    totalImages += images.length;
    console.log(`  ${styleDir}: ${images.length} images`);
  });

  console.log(`\n📊 Total: ${totalImages} images in ${styleDirs.length} styles`);
  
  const expectedTotal = styleDirs.length * 5; // 5 images per style
  const progress = styleDirs.length > 0 ? Math.round((totalImages / expectedTotal) * 100) : 0;
  console.log(`📈 Progress: ${progress}% (${totalImages}/${expectedTotal} expected)`);
}

checkGeneratedImages();