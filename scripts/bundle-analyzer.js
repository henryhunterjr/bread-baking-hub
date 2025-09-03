#!/usr/bin/env node

// Bundle analyzer script to identify optimization opportunities
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Analyzing bundle size...');

// Build the project first
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Run bundle analyzer
console.log('Running bundle analyzer...');
execSync('npx vite-bundle-analyzer dist', { stdio: 'inherit' });

// Analyze build output
const distPath = './dist';
if (fs.existsSync(distPath)) {
  const files = fs.readdirSync(path.join(distPath, 'assets'));
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  console.log('\n📊 JS Bundle Sizes:');
  jsFiles.forEach(file => {
    const filePath = path.join(distPath, 'assets', file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`${file}: ${sizeKB} KB`);
  });
  
  const totalJS = jsFiles.reduce((total, file) => {
    const filePath = path.join(distPath, 'assets', file);
    const stats = fs.statSync(filePath);
    return total + stats.size;
  }, 0);
  
  console.log(`\n📦 Total JS: ${(totalJS / 1024).toFixed(2)} KB`);
  
  if (totalJS > 250 * 1024) {
    console.log('⚠️  Bundle size exceeds 250KB - optimization needed');
  } else {
    console.log('✅ Bundle size is within target');
  }
}