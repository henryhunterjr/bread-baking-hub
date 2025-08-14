#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Recursively scan files for /lovable-uploads/ usage
 */
function scanDirectory(dir, violations = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const itemPath = join(dir, item);
    const stat = statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, dist, build directories
      if (['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
        continue;
      }
      scanDirectory(itemPath, violations);
    } else if (stat.isFile()) {
      // Only check source files
      if (!/\.(ts|tsx|js|jsx|json|md|css|scss|html)$/.test(item)) {
        continue;
      }
      
      try {
        const content = readFileSync(itemPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.includes('/lovable-uploads/')) {
            violations.push({
              file: itemPath.replace(rootDir + '/', ''),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
        console.warn(`Warning: Could not read ${itemPath}`);
      }
    }
  }
  
  return violations;
}

function main() {
  console.log('🔍 Checking for /lovable-uploads/ usage in source files...');
  
  const violations = scanDirectory(rootDir);
  
  if (violations.length === 0) {
    console.log('✅ No /lovable-uploads/ paths found in source files.');
    process.exit(0);
  }
  
  console.error('❌ Found /lovable-uploads/ paths in source files:');
  console.error('');
  
  violations.forEach(({ file, line, content }) => {
    console.error(`  ${file}:${line}`);
    console.error(`    ${content}`);
    console.error('');
  });
  
  console.error('💡 Replace /lovable-uploads/ with proper static assets in src/assets/ or public/');
  console.error('   Upload images should be moved to permanent locations before production.');
  console.error('');
  
  process.exit(1);
}

main();