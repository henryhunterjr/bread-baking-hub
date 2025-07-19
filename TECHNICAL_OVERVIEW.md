# BakingGreatBread.blog - Complete Technical Architecture Overview

## 🏗️ 1. Architecture Overview

### Frontend Framework & Setup
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5+ with SWC compiler
- **UI Framework**: Tailwind CSS with custom design system
- **Component Library**: Radix UI + shadcn/ui components
- **State Management**: Zustand for local state, TanStack Query for server state
- **Routing**: React Router v6 with lazy loading
- **PWA**: Enabled with offline support and service worker caching

### Backend Services 
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Storage**: Supabase Storage for images and files
- **Edge Functions**: Supabase Edge Runtime (Deno) for serverless logic
- **External APIs**: WordPress.com blog proxy, OpenAI GPT-4, ElevenLabs TTS

### Deployment Architecture
- **Primary**: Lovable Cloud Platform
- **Domain**: bakinggreatbread.com (routes to Lovable)
- **CDN**: Automatic via Lovable infrastructure
- **SSL**: Automatic HTTPS with cert management

## 🗂️ 2. File Structure & Key Directories

### Core Application Files
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── dashboard/       # Admin dashboard components  
│   ├── AIAssistantSidebar.tsx
│   ├── Header.tsx       # Main navigation
│   ├── HeroSection.tsx  # Homepage hero
│   └── ...
├── pages/               # Route components (lazy loaded)
│   ├── Index.tsx        # Homepage 
│   ├── Dashboard.tsx    # Admin content management
│   ├── Blog.tsx         # Blog listing
│   ├── BlogPost.tsx     # Individual blog posts
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication state
│   ├── useAIChat.ts     # AI assistant logic
│   └── useTextToSpeech.ts
├── utils/               # Utility functions
│   ├── imageUtils.ts    # Hero image mapping & fallbacks
│   ├── seoUtils.ts      # Sitemap & robots.txt generation
│   ├── blogCache.ts     # Service worker blog caching
│   └── heroImageMapping.ts # Static blog image mappings
├── integrations/supabase/
│   ├── client.ts        # Supabase client config
│   └── types.ts         # Auto-generated database types
└── App.tsx              # Main app with routing
```

### Database Schema (Supabase)
```
public/
├── profiles             # User profiles (linked to auth.users)
├── blog_posts          # Published blog content
├── recipes             # User-generated recipes  
├── recipe_versions     # Recipe version history
├── manuscripts         # Draft storage
├── ai_drafts          # AI-generated content drafts
├── blog_clicks        # Analytics tracking
├── newsletter_subscribers
├── submissions        # User content submissions
└── site_settings      # Site configuration
```

## 📱 3. Recipe System Deep Dive

### Recipe URL Generation & Storage
- **Database**: Recipes stored in `public.recipes` table
- **Slug Generation**: `generate_recipe_slug()` function ensures uniqueness
- **URL Pattern**: `/r/{slug}` for public recipes
- **Visibility**: Controlled by `is_public` boolean field
- **Versioning**: Automatic version history in `recipe_versions` table

### Image URL Matching Logic
```typescript
// Fallback chain priority:
1. Slug-mapped hero image (heroImageMapping.ts)
2. Direct hero_image_url from database
3. social_image_url fallback  
4. inline_image_url fallback
5. Site hero banner fallback
6. Default image fallback

// Implementation in imageUtils.ts
getBlogPostHeroImage(slug, heroImageUrl, socialImageUrl, inlineImageUrl, heroBannerUrl)
```

### Recipe Data Structure
```json
{
  "id": "uuid",
  "user_id": "uuid", 
  "title": "string",
  "slug": "auto-generated-slug",
  "data": {
    "ingredients": [...],
    "instructions": [...],
    "notes": "string",
    "difficulty": "string",
    "prep_time": "string",
    "bake_time": "string"
  },
  "image_url": "storage-url",
  "tags": ["array"],
  "folder": "organization-folder",
  "is_public": boolean,
  "created_at": "timestamp"
}
```

### Hero Image Mapping System
- **File**: `src/utils/heroImageMapping.ts`
- **Purpose**: Maps blog post slugs to specific hero images
- **Fallback**: Comprehensive chain for missing images
- **Cache**: Hero banner URL cached to reduce DB calls
- **Storage**: Images stored in Supabase Storage buckets

## 📝 4. Blog Deployment System

### Content Management Workflow
1. **Draft Creation**: Dashboard → BlogPostTab → Content editor
2. **Auto-save**: Real-time draft saving via `upsert-post` edge function
3. **Publishing**: Draft promotion with metadata validation
4. **SEO**: Automatic meta tags, schema.org, and sitemap generation

### WordPress Integration
- **Proxy**: `blog-proxy` edge function caches WordPress API calls
- **Caching**: 5-minute cache for posts/categories
- **API**: WordPress REST API v2 with `_embed` parameter
- **Fallback**: Local blog posts if WordPress unavailable

### Automated Deployment Triggers
- **Blog Posts**: Instant deployment on publish
- **Images**: Auto-upload to Supabase Storage
- **SEO**: Dynamic sitemap.xml generation
- **RSS**: Auto-generated feed at `/feed.xml`

### SEO & Metadata Handling
```typescript
// Comprehensive SEO implementation
- Dynamic title/description generation
- Open Graph meta tags
- Twitter Card optimization  
- JSON-LD structured data
- Automatic canonical URLs
- XML sitemap with all content
- Robots.txt with proper directives
```

## ⚡ 5. Critical Functionality Map

### User-Facing Features & Locations
```
🏠 Homepage (/) 
   ├── HeroSection.tsx - Hero banner with dynamic image
   ├── AboutHenry.tsx - Author bio section
   ├── BooksPreview.tsx - Featured books
   ├── LatestBlogPosts.tsx - WordPress blog integration
   └── AIAssistantSidebar.tsx - "Krusty" chat assistant

📖 Blog System (/blog)
   ├── Blog.tsx - Post listing with pagination
   ├── BlogPost.tsx - Individual post rendering  
   └── WordPress proxy integration

🥖 Recipe System (/recipes, /r/{slug})
   ├── RecipeWorkspace.tsx - Recipe editor
   ├── PublicRecipe.tsx - Public recipe display
   └── MyRecipes.tsx - User recipe management

🔧 Admin Dashboard (/dashboard)  
   ├── BlogPostTab.tsx - Content creation
   ├── NewsletterTab.tsx - Email campaigns
   ├── ImageManager.tsx - Media management
   └── SiteSettings.tsx - Configuration

🤖 AI Features
   ├── AIAssistantSidebar.tsx - Chat interface
   ├── useAIChat.ts - Chat logic
   └── CrustAndCrumb.tsx - Bread troubleshooting
```

### API Endpoints & Edge Functions
```
Supabase Edge Functions:
├── /blog-proxy - WordPress API caching
├── /rss-feed - RSS feed generation  
├── /upsert-post - Blog post management
├── /send-newsletter - Email campaigns
├── /track-blog-click - Analytics
├── /bakers-helper - AI chat assistant
├── /text-to-speech - Audio generation
├── /submit-content - User submissions
├── /import-draft - AI draft management
├── /format-recipe - Recipe formatting
└── /scan-symptoms - Bread troubleshooting
```

### Database Queries & Data Flows
```
Critical Queries:
├── Blog Posts: SELECT with is_draft=false filter
├── Public Recipes: SELECT with is_public=true filter  
├── User Content: RLS-protected by user_id
├── Analytics: INSERT-only blog_clicks tracking
├── Settings: site_settings for configuration
└── Real-time: Supabase Realtime subscriptions
```

### Third-Party Integrations
```
External Services:
├── WordPress.com - Blog content source
├── OpenAI GPT-4 - AI chat and content generation
├── ElevenLabs - Text-to-speech conversion
├── Resend - Email delivery service
├── Supabase - Backend as a Service
└── Lovable - Hosting and deployment
```

## 🐛 6. Known Issues & Context

### Current Recipe URL/Image Matching Problems
- ✅ **FIXED**: Hero banner broken link (updated to full URL)
- ⚠️ **ONGOING**: Some blog posts lack hero images in mapping
- ⚠️ **ONGOING**: Inconsistent image fallback behavior
- ⚠️ **ONGOING**: WordPress API occasionally returns empty results

### Blog Deployment Issues  
- ✅ **FIXED**: Database function security (search_path set)
- ⚠️ **ONGOING**: Edge function cold starts cause delays
- ⚠️ **ONGOING**: Large blog images not optimized
- ⚠️ **ONGOING**: WordPress cache invalidation timing

### Security Warnings (From Supabase Linter)
- ✅ **FIXED**: Function search_path security issues
- ⚠️ **PENDING**: Extension versions outdated  
- ⚠️ **PENDING**: Auth OTP expiry settings
- ⚠️ **PENDING**: Leaked password protection disabled

## 🌍 7. Environment Details

### Required Environment Variables
```bash
# Supabase Configuration
SUPABASE_URL=https://ojyckskucneljvuqzrsw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=[Secret - configured in Supabase]

# External API Keys (configured as Supabase secrets)
OPENAI_API_KEY=[Required for AI features]
ELEVEN_LABS_API_KEY=[Required for TTS]
RESEND_API_KEY=[Required for newsletter]
AUTO_DRAFT_TOKEN=[WordPress integration]
```

### External Service Dependencies
```
Critical Dependencies:
├── Supabase (Database, Auth, Storage, Functions)
├── WordPress.com API (Blog content source)
├── OpenAI API (AI chat assistant)
├── ElevenLabs API (Text-to-speech)
├── Resend API (Email delivery)
└── Lovable Platform (Hosting)

Optional Dependencies:
├── Google Fonts (Typography)
├── YouTube (Embedded videos)
└── Amazon Associates (Affiliate links)
```

### Build & Deployment Commands
```bash
# Development
npm run dev                # Start dev server (port 8080)
npm run build             # Production build
npm run preview           # Preview production build
npm run lint              # ESLint check
npm run test              # Run test suite

# Deployment (Automatic via Lovable)
git push origin main      # Triggers auto-deployment
```

## ✅ 8. Testing Checklist

### Critical User Journeys
```
🔥 MUST WORK:
├── Homepage loads with hero banner
├── Blog posts display with images  
├── AI assistant ("Krusty") responds
├── Public recipes accessible via /r/{slug}
├── Newsletter signup functions
├── Admin dashboard accessible
├── Blog post creation/editing
├── Image uploads to storage
└── SEO meta tags generated

📱 MOBILE REQUIREMENTS:
├── Responsive design on all screens
├── Touch-friendly navigation
├── Fast loading times
├── Offline functionality
└── PWA install prompt
```

### Critical Pages for Validation
```
High Priority:
├── / (Homepage with dynamic hero)
├── /blog (WordPress integration)
├── /dashboard (Admin functionality)  
├── /r/* (Public recipe pages)
└── /troubleshooting (AI features)

Medium Priority:
├── /books (Static content)
├── /about (Static content)
├── /community (Static content)
└── /auth (Authentication flows)
```

### Performance Benchmarks
```
Target Metrics:
├── First Contentful Paint: < 2s
├── Largest Contentful Paint: < 3s  
├── Time to Interactive: < 4s
├── Cumulative Layout Shift: < 0.1
├── Page Speed Score: > 90
└── Core Web Vitals: All green
```

## 🚀 9. Deployment Readiness Status

### ✅ Ready for Production
- Hero banner display fixed
- Database security hardened  
- Edge functions configured
- PWA enabled with caching
- SEO optimized with meta tags
- Responsive design implemented
- Error boundaries in place

### ⚠️ Requires Attention  
- WordPress API error handling
- Image optimization pipeline
- Edge function monitoring
- Performance optimization
- Security audit completion

### 🔧 Recommended Improvements
- Implement error tracking (Sentry)
- Add performance monitoring  
- Set up automated testing
- Configure backup procedures
- Enable real-time analytics
- Implement A/B testing
- Add progressive image loading

---

## 🎯 Summary for AI Debugging Agent

**PRIMARY GOALS:**
1. Ensure hero banner displays correctly ✅
2. Validate all blog posts render with images ⚠️  
3. Confirm public recipes are accessible ⚠️
4. Test AI assistant functionality ⚠️
5. Verify admin dashboard works ⚠️

**CRITICAL FILES TO MONITOR:**
- `src/utils/imageUtils.ts` - Image fallback logic
- `src/utils/heroImageMapping.ts` - Blog image mappings  
- `supabase/functions/` - All edge functions
- `src/pages/Dashboard.tsx` - Admin functionality
- `src/components/AIAssistantSidebar.tsx` - Chat system

**IMMEDIATE ACTION ITEMS:**
1. Test all edge functions are deployed
2. Verify image URLs resolve correctly
3. Check WordPress API connectivity  
4. Validate database RLS policies
5. Confirm SEO meta tags generate properly

The system is architecturally sound with a robust fallback system for images, comprehensive SEO, and proper security implementation. Focus debugging efforts on API connectivity, image resolution, and edge function performance.