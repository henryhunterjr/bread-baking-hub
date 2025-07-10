#!/bin/bash

echo "Testing AI Draft Submission System..."
echo "======================================"

# Blog Post Submission
echo "1. Submitting Blog Post..."
blog_response=$(curl -s -i -X POST https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/submit-content \
  -H "Authorization: Bearer c404c9f18d2d7ae73a882156681a4975c094a0e7fe52a589c5e7615c51baaa0a" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog",
    "runDate": "2025-07-10",
    "payload": {
      "blogDraft": {
        "title": "Mastering High-Hydration Sourdough: July 2025 Techniques & Trends",
        "excerpt": "Discover how bakers are pushing hydration to 90%+, using precision proofers, and infusing summer fruits into their loaves.",
        "body": "<h1>Mastering High-Hydration Sourdough: July 2025 Techniques & Trends</h1>\n<p>This month, home bakers are taking hydration ratios to new heights—sometimes 90% or more—to unlock open crumb and glossy crusts. Here'\''s how they do it.</p>\n<h2>1. 90%+ Hydration Methods</h2>\n<p>Bakers are using stretch-and-fold every 30 minutes during bulk ferment to build gluten despite the slack dough. The \"double coil fold\" technique, popularized on TikTok, increases dough strength without kneading.</p>\n<h2>2. Precision Proofers & Starter Control</h2>\n<p>Devices like the Brød & Taylor Sourdough Home and the new Ooni Proof Pro maintain starter temps between 78–82 °F, delivering consistent rise schedules—even in humid summer kitchens.</p>\n<h2>3. Summer-Fruit Infusions</h2>\n<p>Seasonal spins include blueberry-lavender focaccias and apricot-almond levains. These loaves ferment with fruit puree added at the final fold, creating vibrant color and nuanced sweetness.</p>\n<h2>4. Community Spotlight</h2>\n<p>On Instagram, @LoafAndLetLive'\''s 92% hydration \"Cloud Boule\" went viral, racking up 50K likes. Their tutorial uses a 24-hour cold ferment to develop tang while retaining moisture.</p>\n<h2>5. Gear Reviews</h2>\n<p>The new KitchenAid Artisan Spiral Mixer gets praise for handling wet doughs with ease; the retractable paddle lets you scrape down walls without stopping the machine.</p>\n<p>Whether you'\''re chasing open crumb or experimenting with fruit blends, these July trends show that the art of hydration and precise proofing are the keys to bakery-level sourdough at home.</p>",
        "imageUrl": "https://example.com/images/high-hydration-sourdough.jpg",
        "tags": ["high hydration","proofers","summer recipes","sourdough techniques"]
      }
    }
  }')

echo "Blog Response:"
echo "$blog_response"
echo ""

# Newsletter Submission
echo "2. Submitting Newsletter..."
newsletter_response=$(curl -s -i -X POST https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/submit-content \
  -H "Authorization: Bearer c404c9f18d2d7ae73a882156681a4975c094a0e7fe52a589c5e7615c51baaa0a" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "newsletter",
    "runDate": "2025-07-10",
    "payload": {
      "newsletterDraft": {
        "title": "Weekly Sourdough Digest – July 10, 2025",
        "excerpt": "This week: 90% hydration, proofers, and summer-fruit levains.",
        "body": "- Bakers pushing hydration to 90%+ with double coil folds.\n- Precision proofers (Brød & Taylor Sourdough Home) for steady temps.\n- Viral 24-hour cold-ferment \"Cloud Boule\" tutorial.\n- KitchenAid Spiral Mixer: a wet-dough game-changer.\n- Summer-fruit focaccias: blueberry-lavender & apricot-almond levains.",
        "imageUrl": "https://example.com/images/newsletter-header-sourdough.jpg",
        "tags": ["newsletter","weekly","hydration","summer bakes"]
      }
    }
  }')

echo "Newsletter Response:"
echo "$newsletter_response"
echo ""

echo "======================================"
echo "Test Complete! Check your Dashboard → Inbox for new drafts with red badge."