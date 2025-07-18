import { supabase } from '@/integrations/supabase/client';

export const submitContentDraft = async (type: 'blog' | 'newsletter', payload: any, runDate?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('submit-content', {
      body: {
        type,
        payload,
        runDate: runDate || new Date().toISOString().split('T')[0]
      },
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_AUTO_DRAFT_TOKEN || 'auto-draft-secret-token'}`
      }
    });

    if (error) {
      console.error('Error submitting content:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to submit content:', error);
    throw error;
  }
};

// Newsletter content you shared
export const submitYourNewsletterContent = async () => {
  const newsletterContent = {
    newsletter: {
      subject_line: "Weekly Bread Wisdom: Winter Baking Tips",
      header: {
        greeting: "Hello Baking Great Bread Community!",
        intro_paragraph: "As temperatures drop, many bakers notice their bread behaving differently. Here's how to adapt and thrive during the winter months."
      },
      main_content: [
        {
          section_title: "Temperature Matters",
          content: "Cold kitchens slow down fermentation. Find warm spots like your oven with the light on or the top of your refrigerator. Extend proofing times as needed."
        },
        {
          section_title: "Humidity Control", 
          content: "Winter air is dry – cover dough well. Steam in the oven becomes even more critical. Consider a humidifier in your kitchen."
        }
      ],
      featured_recipe: {
        title: "Hearty Winter Wheat Bread",
        hero_image_url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop",
        description: "A robust whole wheat loaf perfect for cold mornings, packed with nutrients and flavor.",
        quick_stats: {
          prep_time: "20 minutes",
          total_time: "4 hours",
          difficulty: "Beginner",
          yield: "1 large loaf"
        },
        highlight_ingredients: [
          "Whole wheat flour",
          "Bread flour", 
          "Active dry yeast",
          "Honey"
        ],
        teaser_text: "Perfect for weekend baking, this recipe delivers bakery-quality results with simple techniques that work even in cold kitchens.",
        call_to_action: "Get the Full Recipe",
        recipe_url: "/recipes/hearty-winter-wheat-bread"
      },
      community_section: {
        title: "Winter Bake-Along Challenge",
        content: "Join us this month as we master cold-weather baking techniques together. Share your winter bread photos!",
        cta_text: "Join the Challenge",
        cta_url: "/community/winter-challenge"
      },
      closing: {
        signature: "Happy Baking,\nHenry Hunter",
        footer_links: [
          {
            text: "Visit the Blog", 
            url: "https://www.bakinggreatbread.blog"
          },
          {
            text: "Join Our Facebook Group",
            url: "https://bit.ly/3srdSYS"
          }
        ]
      }
    }
  };

  return await submitContentDraft('newsletter', newsletterContent);
};