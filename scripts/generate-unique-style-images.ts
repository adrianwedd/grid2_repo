#!/usr/bin/env node

/**
 * Generate unique placeholder images for all 32 styles
 * Each style gets its own unique images based on its philosophy and tone
 */

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

// All 32 styles with their unique characteristics
const ALL_STYLES = [
  // Original 12 styles
  { id: 'minimal-swiss', name: 'Minimal Swiss', colors: { primary: '#000000', secondary: '#666666', bg: '#FFFFFF' } },
  { id: 'bold-brutalist', name: 'Bold Brutalist', colors: { primary: '#FF0000', secondary: '#000000', bg: '#FFFF00' } },
  { id: 'playful-memphis', name: 'Playful Memphis', colors: { primary: '#FF69B4', secondary: '#00CED1', bg: '#FFE4E1' } },
  { id: 'corporate-professional', name: 'Corporate Professional', colors: { primary: '#003366', secondary: '#0066CC', bg: '#F0F4F8' } },
  { id: 'elegant-editorial', name: 'Elegant Editorial', colors: { primary: '#2C3E50', secondary: '#8B7355', bg: '#FAF9F6' } },
  { id: 'modern-tech', name: 'Modern Tech', colors: { primary: '#6366F1', secondary: '#8B5CF6', bg: '#0F172A' } },
  { id: 'warm-organic', name: 'Warm Organic', colors: { primary: '#D2691E', secondary: '#8B4513', bg: '#FFF8DC' } },
  { id: 'luxury-premium', name: 'Luxury Premium', colors: { primary: '#D4AF37', secondary: '#1C1C1C', bg: '#FFFEF7' } },
  { id: 'creative-artistic', name: 'Creative Artistic', colors: { primary: '#FF1493', secondary: '#00FFFF', bg: '#FFE4E1' } },
  { id: 'nature-eco', name: 'Nature Eco', colors: { primary: '#228B22', secondary: '#8B4513', bg: '#F5FFFA' } },
  { id: 'retro-vintage', name: 'Retro Vintage', colors: { primary: '#FF6347', secondary: '#4682B4', bg: '#FFF8DC' } },
  { id: 'zen-tranquil', name: 'Zen Tranquil', colors: { primary: '#4A5568', secondary: '#718096', bg: '#F7FAFC' } },
  
  // Original 8 AI styles
  { id: 'quantum-nebula', name: 'Quantum Nebula', colors: { primary: '#FF00FF', secondary: '#00FFFF', bg: '#0A0A1A' } },
  { id: 'deepseek-enigma', name: 'DeepSeek Enigma', colors: { primary: '#0080FF', secondary: '#4B0082', bg: '#0A0A0A' } },
  { id: 'thunder-goat', name: 'Thunder Goat', colors: { primary: '#FF00F6', secondary: '#8B00FF', bg: '#1A001A' } },
  { id: 'voidwhisper', name: 'VOIDWHISPER', colors: { primary: '#FF00FF', secondary: '#000000', bg: '#FFFFFF' } },
  { id: 'psychedelic-cafe', name: 'Psychedelic Café', colors: { primary: '#FF69B4', secondary: '#FFA500', bg: '#2F004F' } },
  { id: 'glitchgizzard', name: 'GlitchGizzard', colors: { primary: '#FFD9FF', secondary: '#DDA0DD', bg: '#1C0033' } },
  { id: 'glm-air-flow', name: 'GLM Air Flow', colors: { primary: '#00FFCC', secondary: '#40E0D0', bg: '#001A33' } },
  { id: 'quantum-quokka', name: 'Quantum Quokka', colors: { primary: '#FF66CC', secondary: '#CC66FF', bg: '#330033' } },
  
  // New 12 AI styles
  { id: 'neon-ghost', name: 'Neon Ghost Protocol', colors: { primary: '#FF00FF', secondary: '#00FFFF', bg: '#0A0A1A' } },
  { id: 'zen-ethereal', name: 'Ethereal Zen Garden', colors: { primary: '#4A5568', secondary: '#68D391', bg: '#F7FAFC' } },
  { id: 'retro-arcade', name: 'Pixel Paradise Arcade', colors: { primary: '#FF6B6B', secondary: '#4ECDC4', bg: '#1A1A2E' } },
  { id: 'dark-academia', name: 'Nocturne Arcana Library', colors: { primary: '#8B4513', secondary: '#DAA520', bg: '#1C1C1C' } },
  { id: 'solar-punk', name: 'Sunrise Symphony', colors: { primary: '#10B981', secondary: '#F59E0B', bg: '#FEFCE8' } },
  { id: 'vaporwave-dreams', name: 'Digital Sunset Mall', colors: { primary: '#FF71CE', secondary: '#B967FF', bg: '#05FFA1' } },
  { id: 'brutalist-concrete', name: 'Concrete Monolith', colors: { primary: '#2D3748', secondary: '#E53E3E', bg: '#EDF2F7' } },
  { id: 'memphis-party', name: 'Geometric Playground', colors: { primary: '#F687B3', secondary: '#FBB6CE', bg: '#FED7E2' } },
  { id: 'cosmic-void', name: 'Void Whisper Station', colors: { primary: '#6B46C1', secondary: '#1E293B', bg: '#020617' } },
  { id: 'cottage-comfort', name: 'Digital Cottage Haven', colors: { primary: '#92400E', secondary: '#D97706', bg: '#FEF3C7' } },
  { id: 'maximalist-chaos', name: 'Everything Everywhere', colors: { primary: '#FF0080', secondary: '#00FF80', bg: '#8000FF' } },
  { id: 'glitch-reality', name: 'Reality.exe Error', colors: { primary: '#00FFFF', secondary: '#FF00FF', bg: '#000000' } },
];

// Image types to generate
const IMAGE_TYPES = [
  { type: 'hero', width: 1920, height: 1080 },
  { type: 'feature-1', width: 800, height: 600 },
  { type: 'feature-2', width: 800, height: 600 },
  { type: 'feature-3', width: 800, height: 600 },
  { type: 'cta', width: 1200, height: 600 },
];

/**
 * Generate a unique placeholder image for a style
 */
function generatePlaceholderImage(
  style: typeof ALL_STYLES[0],
  imageType: typeof IMAGE_TYPES[0],
  outputPath: string
) {
  const canvas = createCanvas(imageType.width, imageType.height);
  const ctx = canvas.getContext('2d');

  // Fill background with style's background color
  ctx.fillStyle = style.colors.bg;
  ctx.fillRect(0, 0, imageType.width, imageType.height);

  // Create unique pattern based on style ID
  const seed = style.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  // Draw unique geometric patterns
  ctx.globalAlpha = 0.8;
  
  // Primary color shapes
  ctx.fillStyle = style.colors.primary;
  for (let i = 0; i < 5; i++) {
    const x = random(0, imageType.width);
    const y = random(0, imageType.height);
    const size = random(50, 200);
    
    if (i % 2 === 0) {
      // Circles
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Rectangles
      ctx.fillRect(x - size/2, y - size/2, size, size);
    }
  }

  // Secondary color accents
  ctx.fillStyle = style.colors.secondary;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 3; i++) {
    const x = random(0, imageType.width);
    const y = random(0, imageType.height);
    const size = random(30, 150);
    
    // Triangles
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
  }

  // Add style name text
  ctx.globalAlpha = 1;
  ctx.fillStyle = style.colors.primary;
  ctx.font = `bold ${Math.floor(imageType.height / 10)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(style.name, imageType.width / 2, imageType.height / 2);

  // Add image type label
  ctx.font = `${Math.floor(imageType.height / 20)}px Arial`;
  ctx.fillStyle = style.colors.secondary;
  ctx.fillText(imageType.type.toUpperCase(), imageType.width / 2, imageType.height / 2 + imageType.height / 10);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

/**
 * Main function to generate all images
 */
async function generateAllImages() {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'unique-styles');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎨 Generating unique images for all 32 styles...\n');

  let totalGenerated = 0;

  for (const style of ALL_STYLES) {
    const styleDir = path.join(outputDir, style.id);
    
    // Create style directory
    if (!fs.existsSync(styleDir)) {
      fs.mkdirSync(styleDir, { recursive: true });
    }

    console.log(`📸 Generating images for ${style.name}...`);

    for (const imageType of IMAGE_TYPES) {
      const filename = `${style.id}-${imageType.type}.png`;
      const outputPath = path.join(styleDir, filename);
      
      generatePlaceholderImage(style, imageType, outputPath);
      totalGenerated++;
    }
  }

  console.log(`\n✅ Successfully generated ${totalGenerated} unique images!`);
  console.log(`📁 Images saved to: ${outputDir}`);
  
  // Create manifest file
  const manifest = {
    generated: new Date().toISOString(),
    styles: ALL_STYLES.map(style => ({
      id: style.id,
      name: style.name,
      images: IMAGE_TYPES.map(type => ({
        type: type.type,
        path: `/images/unique-styles/${style.id}/${style.id}-${type.type}.png`,
        width: type.width,
        height: type.height
      }))
    }))
  };

  const manifestPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📄 Manifest saved to: ${manifestPath}`);
}

// Check if canvas is available
try {
  require('canvas');
  generateAllImages().catch(console.error);
} catch (error) {
  console.error('❌ Canvas module not installed. Installing now...');
  console.log('Run: npm install canvas');
  process.exit(1);
}