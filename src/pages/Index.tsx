import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
const SocialProofBanner = React.lazy(() => import("../components/SocialProofBanner").then(m => ({ default: m.SocialProofBanner })));
const Testimonials = React.lazy(() => import("../components/Testimonials").then(m => ({ default: m.Testimonials })));
const AboutHenry = React.lazy(() => import("../components/AboutHenry"));
const BooksPreview = React.lazy(() => import("../components/BooksPreview"));
const ToolsResources = React.lazy(() => import("../components/ToolsResources"));
const FromOvenToMarketHero = React.lazy(() => import("../components/FromOvenToMarketHero").then(m => ({ default: m.FromOvenToMarketHero })));
const BreadBookHero = React.lazy(() => import("../components/BreadBookHero").then(m => ({ default: m.BreadBookHero })));
const BakersBench = React.lazy(() => import("../components/BakersBench"));
const MonthlyChallenge = React.lazy(() => import("../components/MonthlyChallenge"));
const LatestBlogPosts = React.lazy(() => import("../components/LatestBlogPosts"));
const CallToAction = React.lazy(() => import("../components/CallToAction"));
const PodcastSection = React.lazy(() => import("../components/PodcastSection"));
const RecommendedTools = React.lazy(() => import("../components/RecommendedTools"));
const TestimonialsSection = React.lazy(() => import("../components/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const AuthorBioSection = React.lazy(() => import("../components/AuthorBioSection").then(m => ({ default: m.AuthorBioSection })));
const LazyAIAssistantSidebar = React.lazy(() => import("../components/AIAssistantSidebar").then(m => ({ default: m.AIAssistantSidebar })));
import { sanitizeStructuredData } from '@/utils/sanitize';

const Index = () => {
  const [isAIOpen, setIsAIOpen] = React.useState(false);

  // Generate organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Baking Great Bread",
    "description": "Expert bread baking guidance, recipes, and community from master baker Henry Hunter",
    "url": "https://bread-baking-hub.vercel.app",
    "logo": "https://bread-baking-hub.vercel.app/assets/logo.png",
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
    "url": "https://bread-baking-hub.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bread-baking-hub.vercel.app/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Henry Hunter",
    "url": "https://bread-baking-hub.vercel.app/about",
    "image": "https://bread-baking-hub.vercel.app/lovable-uploads/f2a6c7d6-5a78-4068-94bd-1810dd3ebd96.png",
    "jobTitle": "Master Baker & Author",
    "sameAs": [
      "https://www.youtube.com/@bakinggreatbread",
      "https://www.instagram.com/bakinggreatbread"
    ]
  };
  return (
    <>
      <Helmet>
        <title>Baking Great Bread - Master Baker Henry Hunter's Expert Guidance</title>
        <meta name="description" content="Learn bread baking from master baker Henry Hunter. Expert tutorials, troubleshooting guides, sourdough tips, and a supportive community of passionate bakers." />
        <meta name="keywords" content="bread baking, sourdough, Henry Hunter, baking tutorials, bread recipes, troubleshooting, artisan bread, home baking" />
        <link rel="canonical" href="https://bread-baking-hub.vercel.app" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Baking Great Bread - Master Baker Henry Hunter's Expert Guidance" />
        <meta property="og:description" content="Learn bread baking from master baker Henry Hunter. Expert tutorials, troubleshooting guides, and community support." />
        <meta property="og:url" content="https://bread-baking-hub.vercel.app" />
        <meta property="og:site_name" content="Baking Great Bread" />
        <meta property="og:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Baking Great Bread - Master Baker Henry Hunter's Expert Guidance" />
        <meta name="twitter:description" content="Learn bread baking from master baker Henry Hunter. Expert tutorials, troubleshooting guides, and community support." />
        <meta name="twitter:image" content="https://ojyckskucneljvuqzrsw.supabase.co/storage/v1/object/public/blog-images/2025-07/baking-great-bread-at-home-blog/optimizeduploadedbreadhero.avif" />
        
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
        <link rel="preload" as="image" href="/lovable-uploads/db15ab36-18a2-4103-b9d5-a5e58af2b2a2.png" />
      </Helmet>
      
    <div className="bg-background text-foreground">
      <Header />
      <main id="main-content" role="main" tabIndex={-1}>
        <HeroSection />
        <React.Suspense fallback={null}>
          <SocialProofBanner />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <Testimonials className="px-4 mt-6" />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <AboutHenry />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <PodcastSection />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <BooksPreview />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <ToolsResources />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <RecommendedTools />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <TestimonialsSection />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <AuthorBioSection />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <FromOvenToMarketHero />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <BakersBench />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <MonthlyChallenge />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <BreadBookHero />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <LatestBlogPosts />
        </React.Suspense>
        <React.Suspense fallback={null}>
          <CallToAction />
        </React.Suspense>
      </main>
      <Footer />
      <React.Suspense fallback={null}>
        <LazyAIAssistantSidebar 
          isOpen={isAIOpen}
          onToggle={() => setIsAIOpen(!isAIOpen)}
        />
      </React.Suspense>
    </div>
    </>
  );
};

export default Index;