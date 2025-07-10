-- Insert test AI draft data to simulate what an AI agent would submit
INSERT INTO public.ai_drafts (type, payload, run_date) VALUES 
(
  'blog',
  '{
    "blogDraft": {
      "title": "The Perfect Sourdough Starter Revival Guide",
      "excerpt": "Learn the foolproof method to bring your neglected sourdough starter back to life with these simple steps.",
      "content": "# The Perfect Sourdough Starter Revival Guide\n\nHas your sourdough starter been sitting in the fridge, forgotten and neglected? Don''t worry – it''s probably not dead! Even starters that have been dormant for weeks or months can often be revived with the right care.\n\n## Signs Your Starter Can Be Saved\n\n- Liquid (hooch) on top is normal\n- Mold is the only real danger sign\n- Even if it smells very sour or vinegary, it can likely be revived\n\n## The Revival Process\n\n### Day 1-2: Assessment and First Feeding\n\n1. **Remove any hooch** (the liquid layer on top)\n2. **Discard the top layer** of starter (about 1/2 inch)\n3. **Take what looks healthiest** from underneath\n4. **Feed with equal parts** flour and water (1:1:1 ratio)\n\n### Day 3-5: Building Strength\n\n- Feed twice daily with fresh flour and water\n- Look for bubbling activity\n- The smell should become more pleasant and yeasty\n\n### Day 6-7: Testing Readiness\n\n- Your starter should double in size within 4-8 hours of feeding\n- It should have a pleasant, tangy aroma\n- Time to bake your first loaf!\n\n## Pro Tips for Success\n\n- **Use filtered water** – chlorine can inhibit yeast growth\n- **Maintain consistent temperature** (75-80°F is ideal)\n- **Be patient** – some starters take longer to revive than others\n\nWith consistent care and feeding, your starter will be back to its bubbly, active self in no time!",
      "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
      "tags": ["sourdough", "starter", "troubleshooting", "bread-making"]
    }
  }',
  CURRENT_DATE
),
(
  'newsletter', 
  '{
    "newsletterDraft": {
      "title": "Weekly Bread Wisdom: Winter Baking Tips",
      "subtitle": "Keep your bread game strong during the cold months",
      "content": "# Winter Baking Challenges\n\nAs temperatures drop, many bakers notice their bread behaving differently. Here''s how to adapt:\n\n## Temperature Matters\n- Cold kitchens slow down fermentation\n- Find warm spots: oven with light on, top of refrigerator\n- Extend proofing times as needed\n\n## Humidity Control\n- Winter air is dry – cover dough well\n- Steam in the oven becomes even more critical\n- Consider a humidifier in your kitchen\n\n## This Week''s Recipe: Hearty Winter Wheat\nA robust whole wheat loaf perfect for cold mornings...",
      "imageUrls": [
        "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop"
      ]
    }
  }',
  CURRENT_DATE - 1
),
(
  'blog',
  '{
    "blogDraft": {
      "title": "Understanding Bread Scoring: Art Meets Science",
      "excerpt": "Master the technique of scoring bread for better oven spring and beautiful presentation.",
      "content": "# Understanding Bread Scoring: Art Meets Science\n\nScoring bread is one of those techniques that seems simple but can make or break your loaf. Let''s dive into the why and how of this essential skill.\n\n## Why Score Bread?\n\n### Controlled Expansion\nWhen bread enters the hot oven, steam inside wants to escape. Without scoring, your loaf might burst unpredictably at weak points.\n\n### Better Oven Spring\nProper scoring creates weak points where you want them, allowing maximum rise and creating that coveted ''ear.''\n\n### Visual Appeal\nA well-scored loaf is simply beautiful – it''s your signature on the bread.\n\n## Essential Scoring Tools\n\n- **Lame (bread knife)**: The traditional tool\n- **Sharp razor blade**: For precise cuts\n- **Serrated knife**: In a pinch, but less ideal\n\n## Basic Scoring Patterns\n\n### The Simple Slash\nOne confident cut down the center, about 1/2 inch deep.\n\n### The Cross\nTwo perpendicular cuts creating four sections.\n\n### The Wheat Stalk\nMultiple angled cuts resembling a wheat plant.\n\n## Technique Tips\n\n1. **Work quickly** – don''t let the dough deflate\n2. **Cut at a 30-45 degree angle** for best ear formation\n3. **Be decisive** – confident cuts work better than hesitant ones\n4. **Practice on less important loaves** first\n\nRemember: even ''imperfect'' scoring often looks beautiful once baked!",
      "imageUrl": "https://images.unsplash.com/photo-1549444156-b6e4b8c57aba?w=800&h=600&fit=crop",
      "tags": ["scoring", "technique", "oven-spring", "bread-art"]
    }
  }',
  CURRENT_DATE - 2
);