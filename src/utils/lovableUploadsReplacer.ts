// Comprehensive utility to replace all /lovable-uploads/ references with permanent URLs
// This addresses the 308 violations across 69 files

export const PERMANENT_URL_MAPPINGS: Record<string, string> = {
  // Hero images
  '/lovable-uploads/db15ab36-18a2-4103-b9d5-a5e58af2b2a2.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/hero-main.png',
  '/lovable-uploads/b5e1dc0c-46f0-43df-9624-3a332d98ec4e.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/hero-secondary.png',
  
  // Book covers
  '/lovable-uploads/73deb0d3-e387-4693-bdf8-802f89a1ae85.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/sourdough-cover.png',
  '/lovable-uploads/171c5ec1-d38e-4257-a2e4-60b75d2e2909.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/bread-journey-cover.png',
  '/lovable-uploads/1bca24b8-dbf6-440d-8240-4c714ec30891.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/yeast-water-cover.png',
  '/lovable-uploads/a0d33e20-2a9e-46c9-a500-e9e01876a8df.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/market-cover.png',
  '/lovable-uploads/43da7651-de36-46f7-ab6a-22e594aed31b.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/seasonal-baking-cover.png',
  '/lovable-uploads/83cde278-edfc-4a30-98f4-79f37c79346e.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/loaf-lie-cover.png',
  '/lovable-uploads/ed2db3c9-f60e-4085-ab44-a1df3ff34c0f.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/vitale-cover.png',
  '/lovable-uploads/2b4a2ed0-1e01-4acf-9de5-2e2165f803b6.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/watchers-cover.png',
  
  // Author and profile images
  '/lovable-uploads/e9d4e95a-2202-46e4-9b07-ae4646daff63.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/family-photos/henry-profile.png',
  '/lovable-uploads/817f9119-54ab-4a7e-8906-143e981eac8a.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/family-photos/author-bio.png',
  '/lovable-uploads/8cb72eaf-5058-4063-8999-6b31c041d83b.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/family-photos/crusty-avatar.png',
  
  // Logo
  '/lovable-uploads/82d8e259-f73d-4691-958e-1dd4d0bf240d.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/official-logo.png',
  '/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/seo-logo.png',
  
  // Recipe thumbnails and other content
  '/lovable-uploads/6aad1feb-5cbe-4539-830e-5c5b14ef0b79.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-1.png',
  '/lovable-uploads/fce61684-fea2-4c54-86b5-2e05b69655d5.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-2.png',
  '/lovable-uploads/3dd9d3e1-4062-40cc-82b2-41f79418dcdb.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-3.png',
  '/lovable-uploads/fecb5d01-9088-44ad-8722-faaccc87696a.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-4.png',
  '/lovable-uploads/eef793ee-a94a-4d13-9293-213e2ec9e632.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-5.png',
  '/lovable-uploads/c1225388-44e4-4de5-a0c7-15ba9198e7f7.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-6.png',
  '/lovable-uploads/52f625dc-3e68-4315-b686-b4a28e6ec226.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-7.png',
  '/lovable-uploads/09c8881c-d626-4390-a889-bed6bac99dfd.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-8.png',
  '/lovable-uploads/8d5f316f-d7b0-464e-8306-4db6ea04f0fe.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-9.png',
  '/lovable-uploads/93086385-e498-4bde-999e-d18bbb9471f1.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/recipe-uploads/recipe-10.png',
  
  // Video content
  '/lovable-uploads/drive-1B-qILrva5lCLDQkLZSisiP3Xt2UpQhf5.mp4': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/audio-files/bread-journey-video.mp4',
  '/lovable-uploads/6cd3602b-f737-4c3d-a3f4-772cd8654362.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/video-poster.png',
  
  // Special content images
  '/lovable-uploads/95d3ead0-8c78-4ab5-9710-a0d28e1cb0e7.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/market-hero.png',
  '/lovable-uploads/a95e5824-e4a5-4592-a465-9ea4df7c5488.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/hero-images/loaf-lie-hero.png',
  
  // HD versions and additional variants
  '/lovable-uploads/bread-journey-cover-hd.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/bread-journey-cover-hd.png',
  '/lovable-uploads/yeast-water-cover-hd.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/yeast-water-cover-hd.png',
  '/lovable-uploads/6f937c37-592f-4516-8414-a82a3c9dc838.png': 'https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/yeast-water-alt.png'
};

export const replaceAllLovableUploads = (content: string): string => {
  let updatedContent = content;
  
  Object.entries(PERMANENT_URL_MAPPINGS).forEach(([oldUrl, newUrl]) => {
    // Replace both direct references and import statements
    updatedContent = updatedContent.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
    
    // Also handle import statements
    const importPattern = new RegExp(`import\\s+\\w+\\s+from\\s+["']${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    updatedContent = updatedContent.replace(importPattern, `import imageAsset from "${newUrl}"`);
  });
  
  return updatedContent;
};

export const getLovableUploadsCount = (content: string): number => {
  const matches = content.match(/\/lovable-uploads\//g);
  return matches ? matches.length : 0;
};

export const validateAllImagesReplaced = (content: string): boolean => {
  return getLovableUploadsCount(content) === 0;
};