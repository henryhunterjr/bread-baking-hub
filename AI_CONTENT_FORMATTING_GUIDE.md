# AI Content Formatting Guide for Grok
## How to Format Recipes, Blog Posts, and Newsletters for Henry Hunter Website

This guide provides exact formatting requirements for generating content that can be directly uploaded to the Henry Hunter website without manual editing.

---

## 1. RECIPE FORMATTING

### Output Format: JSON

Use this exact JSON structure:

```json
{
  "title": "Recipe Name - Keep Under 60 Characters for SEO",
  "slug": "recipe-name-lowercase-with-hyphens",
  "introduction": "A compelling 2-3 paragraph introduction. Use plain text with **bold** for emphasis and *italic* for technical terms.",
  "description": "SEO-optimized summary under 160 characters",
  "author_name": "Henry Hunter",
  "prep_time": "20 minutes",
  "cook_time": "45 minutes",
  "total_time": "1 hour 5 minutes",
  "servings": "8 servings",
  "yield": "2 loaves",
  "difficulty": "Medium",
  "course": "Main Course",
  "cuisine": "French",
  "tags": ["sourdough", "bread", "artisan"],
  "ingredients": [
    {
      "header": "For the Dough",
      "items": [
        "500g bread flour",
        "350ml warm water (75°F/24°C)",
        "100g active sourdough starter",
        "10g fine sea salt"
      ]
    },
    {
      "header": "For the Topping",
      "items": [
        "Olive oil for brushing",
        "Flaky sea salt"
      ]
    }
  ],
  "method": [
    {
      "header": "Day 1 - Evening (8:00 PM)",
      "subSections": [
        {
          "title": "Mix the Dough",
          "steps": [
            "Combine flour and water in a large bowl. Mix until no dry flour remains.",
            "Cover and let rest for 30 minutes (autolyse).",
            "Add starter and salt. Mix thoroughly for 3-4 minutes."
          ]
        },
        {
          "title": "First Rise",
          "steps": [
            "Cover bowl with damp towel.",
            "Let rise at room temperature for 4 hours.",
            "Perform stretch and folds every 30 minutes (4 times total)."
          ]
        }
      ]
    },
    {
      "header": "Day 2 - Morning (8:00 AM)",
      "subSections": [
        {
          "title": "Shape and Proof",
          "steps": [
            "Turn dough onto lightly floured surface.",
            "Pre-shape into round. Rest 20 minutes.",
            "Final shape into batard or boule.",
            "Place in proofing basket seam-side up."
          ]
        }
      ]
    }
  ],
  "equipment": [
    "Digital kitchen scale",
    "Large mixing bowl",
    "Bench scraper",
    "Proofing basket (banneton)",
    "Dutch oven or baking stone",
    "Lame or sharp knife"
  ],
  "tips": [
    "Use a kitchen scale for accuracy - baking by weight is more consistent than volume.",
    "Keep your starter active with regular feedings for best results.",
    "The dough should feel slightly sticky but not wet. If too wet, add flour 10g at a time."
  ],
  "troubleshooting": [
    {
      "issue": "Dough is too sticky to handle",
      "solution": "Wet your hands before handling or dust with rice flour. Don't add too much flour as this will make the bread dense."
    },
    {
      "issue": "Bread didn't rise properly",
      "solution": "Check your starter is active and bubbly. Room temperature should be 70-75°F for optimal fermentation."
    }
  ],
  "nutrition": {
    "calories": "220 per serving",
    "protein": "8g",
    "carbs": "42g",
    "fat": "2g"
  },
  "seoDescription": "Master the art of sourdough with this detailed recipe guide. Step-by-step instructions for perfect crusty bread every time.",
  "recommended_products": [
    "Professional banneton proofing basket",
    "Digital kitchen scale",
    "Bread lame with replaceable blades"
  ]
}
```

### Key Formatting Rules for Recipes:

1. **Text Formatting in Strings:**
   - Use `**text**` for bold
   - Use `*text*` for italic
   - Use plain text for everything else
   - NO HTML tags in recipe data

2. **Ingredient Structure:**
   - Group ingredients with descriptive headers
   - Use exact measurements with units
   - Format: "quantity unit ingredient (optional note)"
   - Example: "500g bread flour (all-purpose works too)"

3. **Method Structure:**
   - Use clear time-based headers: "Day 1 - Evening (8:00 PM)"
   - Group related steps under descriptive titles
   - Keep steps clear and actionable (start with action verb)
   - Each step = one clear instruction

4. **Required Fields:**
   - title, ingredients, method (MUST have these)
   - introduction (strongly recommended)
   - servings or yield
   - prep_time, cook_time, total_time (recommended)

5. **Optional but Valuable:**
   - equipment, tips, troubleshooting, nutrition
   - difficulty: "Easy", "Medium", or "Hard"
   - tags: array of relevant keywords

---

## 2. BLOG POST FORMATTING

### Output Format: Markdown with Metadata

Blog posts use **Markdown** with specific header hierarchy and can include inline HTML for advanced formatting.

```markdown
---
title: "Your SEO-Optimized Blog Post Title (Under 60 Chars)"
slug: "blog-post-url-slug"
published_at: "2025-01-15T10:00:00Z"
tags: ["baking", "sourdough", "techniques"]
hero_image_url: "https://example.com/image.jpg"
seoDescription: "Compelling 150-160 character description for search engines"
---

# Your Blog Post Title

*Published: January 15, 2025 • 5 min read*

![Alt text for hero image](https://example.com/image.jpg)

## Introduction (H2 - Use for Main Sections)

Your opening paragraph should hook the reader immediately. **Use bold** for emphasis on key terms. *Use italic* for subtle emphasis or technical terms.

Keep paragraphs short (2-4 sentences) for better readability on mobile devices.

### Why This Matters (H3 - Use for Subsections)

Subsections help break up content and improve scannability.

## Main Content Section

### Numbered Lists for Steps

1. **First step:** Always bold the step number or title
   - Sub-point with additional details
   - Another sub-point

2. **Second step:** Continue with clear, actionable instructions
   - Supporting detail here

### Bullet Lists for Tips

- **Pro tip:** Lead with bold for emphasis
- Regular tip without bold
- Another helpful hint

### Formatting Best Practices

| Element | Usage | Example |
|---------|-------|---------|
| **Bold** | Emphasis, key terms | **sourdough starter** |
| *Italic* | Subtle emphasis, scientific terms | *fermentation* |
| `Code` | Measurements, temperatures | `75°F` or `24°C` |

## Visual Elements

### Images

Always include alt text for accessibility and SEO:

```markdown
![Baker shaping sourdough bread on wooden counter](https://example.com/shaping-bread.jpg)
```

### Callout Boxes (Use blockquotes)

> **Baker's Note:** This is an important callout that stands out from the main text. Use for critical tips, warnings, or key insights.

## Links and References

Use descriptive link text:
- Good: Learn more about [sourdough starter maintenance](link)
- Bad: Click [here](link) to learn more

## Conclusion

End with a clear call-to-action:
- Try the recipe
- Share your results
- Ask questions in comments

---

**Recipe Link:** [View the full recipe →](/recipes/perfect-sourdough)
```

### Key Formatting Rules for Blog Posts:

1. **Header Hierarchy:**
   - `#` H1: Post title only (once per post)
   - `##` H2: Main sections
   - `###` H3: Subsections
   - Never skip levels (no H1 to H3)

2. **Text Emphasis:**
   - **Bold**: `**text**` for strong emphasis, key terms
   - *Italic*: `*text*` for subtle emphasis, foreign words
   - `Code`: `` `text` `` for measurements, temperatures, technical terms

3. **Lists:**
   - Numbered lists for sequential steps/instructions
   - Bullet lists for non-sequential items
   - Bold the first few words for scannable lists

4. **Images:**
   - Always include descriptive alt text
   - Use high-quality images (min 1200px wide)
   - Place images near relevant text

5. **SEO Requirements:**
   - Title: Under 60 characters with main keyword
   - Meta description: 150-160 characters
   - Use H2s to break up long content (every 300-400 words)
   - Include internal links to recipes and related posts
   - Alt text on all images with relevant keywords

---

## 3. NEWSLETTER FORMATTING

### Output Format: JSON with HTML Content

Newsletters are formatted as HTML for email clients but returned as JSON:

```json
{
  "subject": "🍞 Master Sourdough This Weekend - New Recipe Inside",
  "preheader": "Everything you need to bake perfect artisan bread at home",
  "content": "<html>FULL HTML CONTENT HERE</html>"
}
```

### HTML Newsletter Template:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      font-size: 28px;
      margin-bottom: 10px;
    }
    h2 {
      color: #34495e;
      font-size: 22px;
      margin-top: 30px;
      border-bottom: 2px solid #e8b86d;
      padding-bottom: 8px;
    }
    h3 {
      color: #34495e;
      font-size: 18px;
      margin-top: 20px;
    }
    .intro {
      font-size: 18px;
      line-height: 1.7;
      color: #555;
      margin: 20px 0;
    }
    .ingredient-group {
      margin: 15px 0;
    }
    .ingredient-header {
      font-weight: bold;
      color: #2c3e50;
      margin-top: 15px;
    }
    ul, ol {
      padding-left: 25px;
      margin: 10px 0;
    }
    li {
      margin: 8px 0;
    }
    .tip-box {
      background: #fff8dc;
      border-left: 4px solid #e8b86d;
      padding: 15px;
      margin: 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: #e8b86d;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 14px;
      color: #777;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  
  <!-- Warm, Personal Introduction -->
  <div class="intro">
    <p>Hey friend,</p>
    <p>There's something magical about pulling a perfectly baked sourdough loaf from your oven. That deep golden crust, the sound of it crackling as it cools, and the aroma filling your kitchen – it's what baking is all about.</p>
    <p>This weekend, I'm sharing my go-to sourdough recipe that's been five years in the making. It's foolproof, flexible, and forgiving – perfect whether you're just starting out or looking to refine your technique.</p>
  </div>

  <!-- Recipe Title -->
  <h1>Perfect Weekend Sourdough</h1>
  
  <img src="https://example.com/hero-image.jpg" alt="Golden sourdough loaf with crackling crust">

  <!-- Ingredients Section -->
  <h2>What You'll Need</h2>
  
  <div class="ingredient-group">
    <div class="ingredient-header">For the Dough:</div>
    <ul>
      <li>500g bread flour (or all-purpose in a pinch)</li>
      <li>350ml warm water (75°F/24°C)</li>
      <li>100g active sourdough starter</li>
      <li>10g fine sea salt</li>
    </ul>
  </div>

  <!-- Method Section -->
  <h2>Let's Bake</h2>
  
  <h3>Day 1 – Evening</h3>
  <ol>
    <li><strong>Mix the dough:</strong> Combine flour and water, let rest 30 minutes, then add starter and salt.</li>
    <li><strong>Bulk fermentation:</strong> Cover and let rise 4 hours, doing stretch-and-folds every 30 minutes.</li>
  </ol>

  <!-- Personal Tips -->
  <div class="tip-box">
    <strong>Henry's Tip:</strong> The key to great sourdough isn't perfection – it's patience. If your dough isn't ready, give it more time. Temperature and time are your best friends here.
  </div>

  <!-- Call to Action -->
  <p style="text-align: center;">
    <a href="https://henryhunter.com/recipes/perfect-sourdough" class="cta-button">
      Get the Full Recipe →
    </a>
  </p>

  <!-- Personal Story/Closing -->
  <p>I still remember my first sourdough disaster – a dense brick that could've doubled as a doorstop. But each loaf taught me something new. That's the beauty of baking: every attempt makes you better.</p>

  <p>Let me know how your bake turns out! Hit reply with a photo – I love seeing your creations.</p>

  <p>Happy baking,<br>
  <strong>Henry</strong></p>

  <!-- Footer -->
  <div class="footer">
    <p>Henry Hunter | Artisan Baking & Recipes</p>
    <p><a href="#">View in browser</a> | <a href="#">Unsubscribe</a></p>
  </div>

</body>
</html>
```

### Key Formatting Rules for Newsletters:

1. **Structure Requirements:**
   - Subject line: 40-50 characters, include emoji for visibility
   - Preheader: 80-100 characters (complements subject)
   - Always start with personal greeting
   - End with warm sign-off and CTA

2. **HTML Formatting:**
   - Inline styles only (email clients strip `<style>` tags often)
   - Use tables for complex layouts (email clients have limited CSS)
   - Keep width under 600px
   - Use web-safe fonts: Georgia, Arial, Helvetica, Times New Roman

3. **Tone and Voice:**
   - Write like you're emailing a friend
   - Use "you" and "I" frequently
   - Include personal anecdotes
   - Show enthusiasm but stay authentic

4. **Content Structure:**
   - Opening hook (why should they care?)
   - Main content (recipe/tips)
   - Personal tip or story
   - Clear call-to-action
   - Warm closing

5. **Email-Specific Considerations:**
   - First sentence = gold (shows in preview)
   - Break up text with images, headers, boxes
   - Every link should be clear what it does
   - Always test on mobile

---

## GENERAL BEST PRACTICES FOR ALL CONTENT

### SEO Optimization:
- Include target keyword in title, first paragraph, and H2s naturally
- Use semantic HTML (H1, H2, H3 hierarchy)
- Add internal links to related content
- Optimize images with descriptive alt text
- Keep URLs clean and descriptive

### Readability:
- Short paragraphs (2-4 sentences)
- Active voice over passive
- Use bullet points and numbered lists
- Include white space
- Write at 8th-grade reading level

### Accessibility:
- Alt text on all images (describe what's shown)
- Proper heading hierarchy
- High contrast text
- Descriptive link text (not "click here")

### Technical Requirements:
- UTF-8 encoding for all content
- ISO 8601 dates: `2025-01-15T10:00:00Z`
- Valid JSON (no trailing commas)
- Escaped quotes in strings: `"He said \"hello\""`

---

## VALIDATION CHECKLIST

Before submitting content, verify:

**Recipes:**
- [ ] JSON is valid (no syntax errors)
- [ ] Has title, ingredients, method
- [ ] Ingredients grouped logically
- [ ] Method has clear time/day headers
- [ ] Steps are actionable (start with verb)
- [ ] Includes tips and troubleshooting

**Blog Posts:**
- [ ] One H1 (title only)
- [ ] H2s every 300-400 words
- [ ] All images have alt text
- [ ] Links use descriptive text
- [ ] Under 60 char title
- [ ] 150-160 char meta description

**Newsletters:**
- [ ] Valid JSON with HTML content
- [ ] Subject under 50 characters
- [ ] Preheader 80-100 characters
- [ ] Inline styles only
- [ ] Clear CTA button/link
- [ ] Warm greeting and closing
- [ ] Mobile-friendly (under 600px wide)

---

## EXAMPLE WORKFLOW

1. **Receive request:** "Create a sourdough recipe"
2. **Generate content** following this guide exactly
3. **Validate** against checklist
4. **Output** properly formatted JSON or Markdown
5. **User uploads** directly to system without editing

---

## COMMON MISTAKES TO AVOID

❌ **Don't:**
- Mix HTML tags in JSON recipe data
- Skip heading levels (H1 to H3)
- Use vague measurements ("a pinch", "some flour")
- Write steps without action verbs
- Forget alt text on images
- Use "click here" for links

✅ **Do:**
- Use markdown formatting in strings (`**bold**`, `*italic*`)
- Follow exact JSON structure
- Be specific with measurements
- Start steps with verbs
- Write descriptive alt text
- Use descriptive link text

---

## QUESTIONS?

If unclear on any formatting requirement:
1. Reference the examples above
2. Check existing content on henryhunter.com
3. Follow the validation checklist
4. When in doubt, keep it simple and clear

**Remember:** The goal is content that can be uploaded directly without manual editing. Precision in formatting = time saved.
