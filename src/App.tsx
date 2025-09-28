import React, { lazy, Suspense } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OfflineBanner from "@/components/OfflineBanner";
import BackToTop from "@/components/BackToTop";
import { AccessibilityEnhancements, EnhancedSkipLink } from "@/components/AccessibilityEnhancements";
import { PerformanceOptimizer, CriticalCSS } from "@/components/PerformanceOptimizer";
import { ContentQualityChecker } from "@/components/ContentQualityChecker";
import { CriticalResourceLoader } from "@/components/CriticalResourceLoader";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import "@/utils/errorMonitoring";
import { SimpleLoadingSpinner } from "./components/SimpleLoadingSpinner";
import MetadataManager from "./components/MetadataManager";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import RouteCleanupHandler from "./components/RouteCleanupHandler";

// Import Index directly to avoid lazy loading issues on main page
import Index from "./pages/Index";

// Lazy loaded components
const RecipeFormatter = lazy(() => import("./pages/RecipeFormatter"));
const RecipeWorkspace = lazy(() => import("./pages/RecipeWorkspace"));
const Auth = lazy(() => import("./pages/Auth"));
const MyRecipes = lazy(() => import("./pages/MyRecipes"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Books = lazy(() => import("./pages/Books"));
const Recipes = lazy(() => import("./pages/Recipes"));
const VitaleStarter = lazy(() => import("./pages/VitaleStarter"));
const VitalePreview = lazy(() => import("./pages/VitalePreview"));
const KaiserRolls = lazy(() => import("./pages/KaiserRolls"));
const PublicRecipe = lazy(() => import("./pages/PublicRecipe"));
const HenrysFoolproofRecipe = lazy(() => import("./pages/HenrysFoolproofRecipe"));
const BreadGlossary = lazy(() => import("./pages/BreadGlossary"));
const BreadCalculator = lazy(() => import("./pages/BreadCalculator"));
const Community = lazy(() => import("./pages/Community"));
const TroubleshootingPage = lazy(() => import("./pages/TroubleshootingPage"));
const OfflineFallback = lazy(() => import("./pages/OfflineFallback"));
const CrustAndCrumb = lazy(() => import("./pages/CrustAndCrumb"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SearchTest = lazy(() => import("./pages/SearchTest"));
const InlineSearchTestPage = lazy(() => import("./pages/InlineSearchTest"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OwnerAnalytics = lazy(() => import("./pages/OwnerAnalytics"));
const Tools = lazy(() => import("./pages/Tools"));
const Guides = lazy(() => import("./pages/Guides"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Coaching = lazy(() => import("./pages/Coaching"));
const Contact = lazy(() => import("./pages/Contact"));
const GithubRoot = lazy(() => import("./pages/GithubRoot"));
const GithubReadme = lazy(() => import("./pages/GithubReadme"));
const GithubWriteTest = lazy(() => import("./pages/GithubWriteTest"));
const GoRedirect = lazy(() => import("./pages/GoRedirect"));
const MyFavorites = lazy(() => import("./pages/MyFavorites"));
const MyReviews = lazy(() => import("./pages/MyReviews"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const RecipePrint = lazy(() => import("./pages/print/RecipePrint"));
const Help = lazy(() => import("./pages/Help"));
const MyRecipeLibrary = lazy(() => import("./pages/MyRecipeLibrary"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const NewsletterPreview = lazy(() => import("./pages/NewsletterPreview"));
const SaltConverter = lazy(() => import("./pages/SaltConverter"));

// Feed redirect component
const FeedRedirect = () => {
  window.location.href = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/rss-feed';
  return <div>Redirecting to RSS feed...</div>;
};

// Sitemap redirect component
const SitemapRedirect = () => {
  window.location.href = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/sitemap';
  return <div>Redirecting to sitemap...</div>;
};

// Share redirect component for pretty URLs
const ShareRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  window.location.href = `https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/og-share/${slug}`;
  return <div>Redirecting to share...</div>;
};

// Recipe redirect component for backward compatibility
const RecipeRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Handle the pumpkin recipe URL change
  if (slug === 'pumpkin-shaped-sourdough-loaf') {
    return <Navigate to="/recipes/festive-pumpkin-sourdough-loaf" replace />;
  }
  
  return <Navigate to={`/recipes/${slug}`} replace />;
};

function App() {
  return (
    <AppErrorBoundary>
      <CriticalCSS />
      <PerformanceOptimizer />
      <AccessibilityEnhancements />
      <ContentQualityChecker enabled={false} />
      <SpeedInsights />
      <Analytics />
      <Toaster />
      <Sonner />
      <OfflineBanner />
      <BackToTop />
      <CriticalResourceLoader>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <RouteCleanupHandler />
          <EnhancedSkipLink />
          <MetadataManager />
          <Suspense fallback={<SimpleLoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recipe-formatter" element={<RecipeFormatter />} />
              <Route path="/recipe-workspace" element={<RecipeWorkspace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-recipes" element={<MyRecipes />} />
              <Route path="/my-recipe-library" element={<MyRecipeLibrary />} />
              <Route path="/my-favorites" element={<MyFavorites />} />
              <Route path="/my-reviews" element={<MyReviews />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/books" element={<Books />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/vitale-starter" element={<VitaleStarter />} />
              <Route path="/preview/vitale-sourdough-mastery" element={<VitalePreview />} />
              <Route path="/newsletter-preview/:id" element={<NewsletterPreview />} />
              <Route path="/kaiser-rolls" element={<KaiserRolls />} />
              <Route path="/henrys-foolproof-recipe" element={<HenrysFoolproofRecipe />} />
              <Route path="/glossary" element={<BreadGlossary />} />
              <Route path="/bread-calculator" element={<BreadCalculator />} />
              <Route path="/community" element={<Community />} />
              <Route path="/troubleshooting" element={<TroubleshootingPage />} />
              <Route path="/crust-and-crumb" element={<CrustAndCrumb />} />
              <Route path="/legal" element={<Legal />} />
              {/* Legacy static pumpkin route - redirect to new URL */}
              <Route path="/pumpkin-shaped-sourdough-loaf" element={<Navigate to="/recipes/festive-pumpkin-sourdough-loaf" replace />} />
              
              {/* Database-driven public recipes */}
              <Route path="/recipes/:slug" element={<PublicRecipe />} />
              <Route path="/r/:slug" element={<RecipeRedirect />} />
              <Route path="/recipe/:slug" element={<RecipeRedirect />} />
              
              {/* Print routes */}
              <Route path="/print/:slug" element={<RecipePrint />} />
              <Route path="/print/recipe/:slug" element={<RecipePrint />} />
              <Route path="/help" element={<Help />} />
              <Route path="/feed.xml" element={<FeedRedirect />} />
              <Route path="/sitemap.xml" element={<SitemapRedirect />} />
              <Route path="/share/:slug" element={<ShareRedirect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/owner/analytics" element={<OwnerAnalytics />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/coaching" element={<Coaching />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/salt-converter" element={<SaltConverter />} />
              <Route path="/search-test" element={<SearchTest />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/inline-search-test" element={<InlineSearchTestPage />} />
              <Route path="/offline" element={<OfflineFallback />} />
              <Route path="/github-root" element={<GithubRoot />} />
              <Route path="/github-readme" element={<GithubReadme />} />
              <Route path="/github-write-test" element={<GithubWriteTest />} />
              <Route path="/go" element={<GoRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CriticalResourceLoader>
    </AppErrorBoundary>
  );
}

export default App;