#!/usr/bin/env node

/**
 * Script to remove all console.log statements from production code
 * This can be run as part of the build process
 */

import fs from 'fs';
import path from 'path';

const removeConsoleFromFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const cleanedContent = content
    .replace(/console\.log\([^;]*\);?\n?/g, '')
    .replace(/console\.error\([^;]*\);?\n?/g, '')
    .replace(/console\.warn\([^;]*\);?\n?/g, '')
    .replace(/console\.info\([^;]*\);?\n?/g, '');
  
  if (content !== cleanedContent) {
    fs.writeFileSync(filePath, cleanedContent);
    console.log(`Cleaned console statements from: ${filePath}`);
  }
};

const processDirectory = (dirPath: string) => {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      removeConsoleFromFile(fullPath);
    }
  }
};

// Run the cleaner
processDirectory('./src');
console.log('Console statement cleanup completed.');