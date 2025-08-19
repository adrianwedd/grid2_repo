#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';

// The image URL you provided and the order of generation
const imageUrls = [
  // Add the URL you provided - this appears to be one of the generated images
  'https://sdmntpreastus2.oaiusercontent.com/files/00000000-30ec-61f6-87ec-445ba93d77cd/raw?se=2025-08-19T00%3A00%3A41Z&sp=r&sv=2024-08-04&sr=b&scid=93466a11-96f1-5740-84db-0f326b849d2a&skoid=5c72dd08-68ae-4091-b4e1-40ccec0693ae&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-18T20%3A16%3A33Z&ske=2025-08-19T20%3A16%3A33Z&sks=b&skv=2024-08-04&sig=6EByXESWWCPwwtmsj93ESHcKD98uoqMdjki/VsCEb00%3D'
];

// Based on generation order, this should be one of the last 3:
const imageName = 'playful-hero'; // or corporate-hero or creative-cta

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join('./public/generated-images', filename);
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('📥 Downloading image from URL...\n');
  
  // Create directory if needed
  const outputDir = './public/generated-images';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    const filepath = await downloadImage(imageUrls[0], `${imageName}.png`);
    console.log(`✅ Downloaded: ${filepath}`);
  } catch (error) {
    console.error('❌ Download failed:', error.message);
  }
}

main();