// Quick test to simulate OG image resolution
import { resolveSocialImage } from './src/utils/resolveSocialImage.js';

const testCases = [
  {
    name: 'Supabase image URL',
    input: {
      social: 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/test.png',
      updatedAt: '2025-01-13T12:00:00Z'
    }
  },
  {
    name: 'Relative path',
    input: {
      hero: '/images/hero.jpg',
      updatedAt: '2025-01-13T12:00:00Z'
    }
  }
];

console.log('Testing social image resolution...');
testCases.forEach(test => {
  const result = resolveSocialImage(test.input);
  console.log(`${test.name}: ${result}`);
  
  // Check for double-prefix
  const hasDoublePrefix = result.includes('https://bakinggreatbread.com/https://') || 
                         result.includes('https://bread-baking-hub.vercel.app/https://');
  if (hasDoublePrefix) {
    console.error(`❌ Double prefix detected in: ${result}`);
  } else {
    console.log(`✅ No double prefix`);
  }
});