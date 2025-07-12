// Script to update Kaiser Roll blog posts with new social sharing thumbnail
import { supabase } from './src/integrations/supabase/client.js';

const kaiserPosts = [
  {
    id: '365233f3-6d5c-400c-b2da-51277489533f',
    title: 'Top Kaiser Roll Stamps & DIY Shaping Alternatives + Crust Crackle Science',
    subtitle: 'Compare top commercial Kaiser roll stamps and creative DIY shaping options, and dive into the science that makes the perfect crackling crust.',
    heroImageUrl: '/lovable-uploads/a9ec437e-b37d-4689-8e28-e4e3d5347bdf.png'
  },
  {
    id: 'bf0c1804-8258-46ee-8071-13171d804367',
    title: 'Top Kaiser Roll Stamps & DIY Shaping Alternatives + Crust Crackle Science',
    subtitle: 'Compare top commercial Kaiser roll stamps and creative DIY shaping options, and dive into the science that makes the perfect crackling crust.',
    heroImageUrl: '/lovable-uploads/a9ec437e-b37d-4689-8e28-e4e3d5347bdf.png'
  },
  {
    id: 'e81f0438-2b2d-4d64-80c7-bea69a2d9638',
    title: 'Top Kaiser Roll Stamps & DIY Shaping Alternatives + Crust Crackle Science',
    subtitle: 'Compare top commercial Kaiser roll stamps and creative DIY shaping options, and dive into the science that makes the perfect crackling crust.',
    heroImageUrl: '/lovable-uploads/a9ec437e-b37d-4689-8e28-e4e3d5347bdf.png'
  },
  {
    id: 'dac85c19-8764-4ffe-ad43-3304594fbe91',
    title: 'Top Kaiser Roll Stamps & DIY Shaping Alternatives + Crust Crackle Science',
    subtitle: 'Shape it right. Bake it better. Explore the tools and science behind perfect Kaiser rolls.',
    heroImageUrl: '/lovable-uploads/a9ec437e-b37d-4689-8e28-e4e3d5347bdf.png'
  }
];

async function updateKaiserPosts() {
  for (const post of kaiserPosts) {
    try {
      const response = await supabase.functions.invoke('upsert-post', {
        body: {
          id: post.id,
          title: post.title,
          subtitle: post.subtitle,
          heroImageUrl: post.heroImageUrl,
          isDraft: false
        }
      });
      
      if (response.error) {
        console.error(`Error updating post ${post.id}:`, response.error);
      } else {
        console.log(`Successfully updated post ${post.id}`);
      }
    } catch (error) {
      console.error(`Failed to update post ${post.id}:`, error);
    }
  }
}

updateKaiserPosts();