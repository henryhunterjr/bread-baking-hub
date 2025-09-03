#!/usr/bin/env node

// Image optimization script to convert large images to WebP/AVIF
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TARGET_SIZE_KB = 200;
const WEBP_QUALITY = 75;

function analyzeImages() {
  console.log('🖼️  Analyzing images...');
  
  const publicImages = './public';
  const largeImages = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (/\.(png|jpg|jpeg)$/i.test(item)) {
        const sizeKB = stat.size / 1024;
        if (sizeKB > TARGET_SIZE_KB) {
          largeImages.push({
            path: fullPath,
            size: sizeKB.toFixed(2),
            name: item
          });
        }
      }
    });
  }
  
  if (fs.existsSync(publicImages)) {
    scanDirectory(publicImages);
  }
  
  console.log(`\n📊 Found ${largeImages.length} images over ${TARGET_SIZE_KB}KB:`);
  largeImages.forEach(img => {
    console.log(`${img.path}: ${img.size} KB`);
  });
  
  return largeImages;
}

function optimizeImages(images) {
  console.log('\n🎨 Optimizing images...');
  
  images.forEach(img => {
    const ext = path.extname(img.path);
    const baseName = path.basename(img.path, ext);
    const dir = path.dirname(img.path);
    const webpPath = path.join(dir, `${baseName}.webp`);
    
    try {
      // Convert to WebP using sharp (if available) or imagemagick
      console.log(`Converting ${img.name}...`);
      
      // This would require sharp or imagemagick - for now just copy
      // In production, you'd use: sharp(img.path).webp({ quality: WEBP_QUALITY }).toFile(webpPath)
      console.log(`Would convert ${img.path} to ${webpPath} at ${WEBP_QUALITY}% quality`);
      
    } catch (error) {
      console.error(`Failed to convert ${img.name}:`, error.message);
    }
  });
}

// Run analysis
const largeImages = analyzeImages();

if (largeImages.length > 0) {
  optimizeImages(largeImages);
  
  console.log('\n📝 Recommendations:');
  console.log('1. Install sharp: npm install sharp');
  console.log('2. Convert large PNGs to WebP format');
  console.log('3. Update image references in components');
  console.log('4. Use responsive images with srcset');
} else {
  console.log('✅ All images are optimally sized');
}