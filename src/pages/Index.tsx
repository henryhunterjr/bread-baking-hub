import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import AboutHenry from "../components/AboutHenry";
import BooksPreview from "../components/BooksPreview";
import ToolsResources from "../components/ToolsResources";
import { FromOvenToMarketHero } from "../components/FromOvenToMarketHero";
import { BreadBookHero } from "../components/BreadBookHero";
import BakersBench from "../components/BakersBench";
import MonthlyChallenge from "../components/MonthlyChallenge";
import LatestBlogPosts from "../components/LatestBlogPosts";
import CallToAction from "../components/CallToAction";
import PodcastSection from "../components/PodcastSection";
import RecommendedTools from "../components/RecommendedTools";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { AuthorBioSection } from "../components/AuthorBioSection";
import { SocialProofBanner } from "../components/SocialProofBanner";
import { AIAssistantSidebar } from "../components/AIAssistantSidebar";
import { sanitizeStructuredData } from '@/utils/sanitize';

const Index = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

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
      </Helmet>
      
    <div className="bg-background text-foreground">
      <Header />
      <main id="main-content" role="main" tabIndex={-1}>
        <HeroSection />
        <SocialProofBanner />
        <AboutHenry />
        <PodcastSection />
        <BooksPreview />
        <ToolsResources />
        <RecommendedTools />
        <TestimonialsSection />
        <AuthorBioSection />
        <FromOvenToMarketHero />
        <BakersBench />
        <MonthlyChallenge />
        <BreadBookHero />
        <LatestBlogPosts />
        <CallToAction />
      </main>
      <Footer />
      <AIAssistantSidebar 
        isOpen={isAIOpen}
        onToggle={() => setIsAIOpen(!isAIOpen)}
      />
    </div>
    </>
  );
};

export default Index;