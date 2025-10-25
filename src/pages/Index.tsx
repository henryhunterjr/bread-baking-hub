import React, { lazy, Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
const SocialProofBanner = lazy(() => import("../components/SocialProofBanner").then(m => ({ default: m.SocialProofBanner })));
const Testimonials = lazy(() => import("../components/Testimonials").then(m => ({ default: m.Testimonials })));
const AboutHenry = lazy(() => import("../components/AboutHenry"));
const BooksPreview = lazy(() => import("../components/BooksPreview"));
const ToolsResources = lazy(() => import("../components/ToolsResources"));
const FromOvenToMarketHero = lazy(() => import("../components/FromOvenToMarketHero").then(m => ({ default: m.FromOvenToMarketHero })));
const BreadBookHero = lazy(() => import("../components/BreadBookHero").then(m => ({ default: m.BreadBookHero })));
const BakersBench = lazy(() => import("../components/BakersBench"));
const MonthlyChallenge = lazy(() => import("../components/MonthlyChallenge"));
const LatestBlogPosts = lazy(() => import("../components/LatestBlogPosts"));
const CallToAction = lazy(() => import("../components/CallToAction"));
const PodcastSection = lazy(() => import("../components/PodcastSection"));
const RecommendedTools = lazy(() => import("../components/RecommendedTools"));
const TestimonialsSection = lazy(() => import("../components/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const AuthorBioSection = lazy(() => import("../components/AuthorBioSection").then(m => ({ default: m.AuthorBioSection })));
const FeaturedRecipes = lazy(() => import("../components/FeaturedRecipes").then(m => ({ default: m.FeaturedRecipes })));
const SeasonalFilters = lazy(() => import("../components/SeasonalFilters").then(m => ({ default: m.SeasonalFilters })));
import { sanitizeStructuredData } from '@/utils/sanitize';

import { useSeasonalRecipes } from '@/hooks/useSeasonalRecipes';
import { useImageOptimization, CRITICAL_IMAGES } from '@/hooks/useImageOptimization';
import { ImagePreloader } from '@/components/ui/PerformanceCriticalImage';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Initialize image optimization
  const { preloadCriticalImages } = useImageOptimization();
  
  // Preload critical images for LCP optimization
  React.useEffect(() => {
    preloadCriticalImages(CRITICAL_IMAGES);
  }, [preloadCriticalImages]);
  
  // Add seasonal recipes functionality for search and featured recipes
  const {
    recipes,
    featuredRecipes,
    selectedSeason,
    setSelectedSeason,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    searchQuery,
    setSearchQuery,
  } = useSeasonalRecipes();

  // Generate organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Baking Great Bread",
    "description": "Expert bread baking guidance, recipes, and community for passionate home bakers",
    "url": "https://bakinggreatbread.com",
    "logo": "https://bakinggreatbread.com/assets/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@bakinggreatbread.com"
    },
    "sameAs": [
      "https://www.youtube.com/@bakinggreatbread",
      "https://www.instagram.com/bakinggreatbread"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Baking Great Bread",
    "description": "Master the art of bread baking with expert tutorials, troubleshooting guides, and community support",
    "url": "https://bakinggreatbread.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bakinggreatbread.com/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Henry Hunter",
    "url": "https://bakinggreatbread.com/about",
    "image": "https://bakinggreatbread.com/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png",
    "jobTitle": "Master Baker & Author",
    "sameAs": [
      "https://www.youtube.com/@bakinggreatbread",
      "https://www.instagram.com/bakinggreatbread"
    ]
  };
  return (
    <>
      <Helmet>
        <title>Baking Great Bread at Home - Expert Guidance for Real Home Bakers</title>
        <meta name="description" content="Expert guidance for real home bakers. Proven tutorials, troubleshooting guides, sourdough tips, and a supportive community of passionate bakers." />
        <meta name="keywords" content="bread baking, sourdough, Henry Hunter, baking tutorials, bread recipes, troubleshooting, artisan bread, home baking" />
        <link rel="canonical" href="https://bakinggreatbread.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Baking Great Bread at Home - Expert Guidance for Real Home Bakers" />
        <meta property="og:description" content="Expert guidance for real home bakers. Proven tutorials, troubleshooting guides, and community support." />
        <meta property="og:url" content="https://bakinggreatbread.com" />
        <meta property="og:site_name" content="Baking Great Bread" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-join-our-supportive-baking-community/a-warm-inviting-lifestyle-photograph-sho9sttfiagry2spdvvrlstkqbrxrfijer9-kofpmfryhtg.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Baking Great Bread at Home - Expert Guidance for Real Home Bakers" />
        <meta name="twitter:description" content="Expert guidance for real home bakers. Proven tutorials, troubleshooting guides, and community support." />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-08/baking-great-bread-at-home-join-our-supportive-baking-community/a-warm-inviting-lifestyle-photograph-sho9sttfiagry2spdvvrlstkqbrxrfijer9-kofpmfryhtg.png" />
        
        {/* Additional SEO */}
        <meta name="author" content="Henry Hunter" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="google-site-verification" content="your-verification-code" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeStructuredData(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeStructuredData(websiteSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeStructuredData(personSchema)
          }}
        />
        {/* Performance hints */}
        <link rel="preconnect" href="https://ojyckskucneljvuqzrsw.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i0.wp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://secure.gravatar.com" crossOrigin="anonymous" />
      </Helmet>
      
    <div className="bg-background text-foreground">
      <Header />
      <nav aria-label="Main navigation" className="sr-only">
        <ul>
          <li><a href="#main-content">Skip to main content</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/recipes">Recipes</a></li>
        </ul>
      </nav>
      <main id="main-content" role="main" tabIndex={-1}>
        <ImagePreloader images={CRITICAL_IMAGES} />
        <HeroSection />
        <Suspense fallback={null}>
          <SocialProofBanner />
        </Suspense>
        <Suspense fallback={null}>
          <Testimonials className="px-4 mt-6" />
        </Suspense>
        <Suspense fallback={null}>
          <AboutHenry />
        </Suspense>
        
        {/* Recipe Search Section */}
        <Suspense fallback={null}>
          <div className="py-12 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
              <SeasonalFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedDifficulty={selectedDifficulty}
                onDifficultyChange={setSelectedDifficulty}
                resultCount={recipes.length}
              />
            </div>
          </div>
        </Suspense>
        
        {/* Featured Recipes - "Baking now" Section */}
        <Suspense fallback={null}>
          <FeaturedRecipes 
            featuredRecipes={featuredRecipes}
            onRecipeClick={(recipe) => {
              // Navigate to recipe page
              window.location.href = `/recipes/${recipe.slug}`;
            }}
          />
        </Suspense>
        
        <Suspense fallback={null}>
          <PodcastSection />
        </Suspense>
        <Suspense fallback={null}>
          <BooksPreview />
        </Suspense>
        <Suspense fallback={null}>
          <ToolsResources />
        </Suspense>
        <Suspense fallback={null}>
          <RecommendedTools />
        </Suspense>
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={null}>
          <AuthorBioSection />
        </Suspense>
        <Suspense fallback={null}>
          <FromOvenToMarketHero />
        </Suspense>
        <Suspense fallback={null}>
          <BakersBench />
        </Suspense>
        <Suspense fallback={null}>
          <MonthlyChallenge />
        </Suspense>
        <Suspense fallback={null}>
          <BreadBookHero />
        </Suspense>
        <Suspense fallback={null}>
          <LatestBlogPosts />
        </Suspense>
        <Suspense fallback={null}>
          <CallToAction />
        </Suspense>
      </main>
      <Footer />
      
      <Suspense fallback={null}>
        <LazyAIAssistantSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </Suspense>
    </div>
    </>
  );
};

export default Index;