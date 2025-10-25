import React, { Suspense } from "react";
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
import { lazyWithRetry } from "./components/withChunkErrorBoundary";

// Import Index directly to avoid lazy loading issues on main page
import Index from "./pages/Index";

// Lazy loaded components with chunk error handling
const RecipeFormatter = lazyWithRetry(() => import("./pages/RecipeFormatter"), "RecipeFormatter");
const RecipeWorkspace = lazyWithRetry(() => import("./pages/RecipeWorkspace"), "RecipeWorkspace");
const Auth = lazyWithRetry(() => import("./pages/Auth"), "Auth");
const MyRecipes = lazyWithRetry(() => import("./pages/MyRecipes"), "MyRecipes");
const About = lazyWithRetry(() => import("./pages/About"), "About");
const Blog = lazyWithRetry(() => import("./pages/Blog"), "Blog");
const BlogPost = lazyWithRetry(() => import("./pages/BlogPost"), "BlogPost");
const Books = lazyWithRetry(() => import("./pages/Books"), "Books");
const Recipes = lazyWithRetry(() => import("./pages/Recipes"), "Recipes");
const VitaleStarter = lazyWithRetry(() => import("./pages/VitaleStarter"), "VitaleStarter");
const VitalePreview = lazyWithRetry(() => import("./pages/VitalePreview"), "VitalePreview");
const KaiserRolls = lazyWithRetry(() => import("./pages/KaiserRolls"), "KaiserRolls");
const PublicRecipe = lazyWithRetry(() => import("./pages/PublicRecipe"), "PublicRecipe");
const HenrysFoolproofRecipe = lazyWithRetry(() => import("./pages/HenrysFoolproofRecipe"), "HenrysFoolproofRecipe");
const BreadGlossary = lazyWithRetry(() => import("./pages/BreadGlossary"), "BreadGlossary");
const BreadCalculator = lazyWithRetry(() => import("./pages/BreadCalculator"), "BreadCalculator");
const Community = lazyWithRetry(() => import("./pages/Community"), "Community");
const TroubleshootingPage = lazyWithRetry(() => import("./pages/TroubleshootingPage"), "TroubleshootingPage");
const OfflineFallback = lazyWithRetry(() => import("./pages/OfflineFallback"), "OfflineFallback");
const CrustAndCrumb = lazyWithRetry(() => import("./pages/CrustAndCrumb"), "CrustAndCrumb");
const Legal = lazyWithRetry(() => import("./pages/Legal"), "Legal");
const NotFound = lazyWithRetry(() => import("./pages/NotFound"), "NotFound");
const SearchTest = lazyWithRetry(() => import("./pages/SearchTest"), "SearchTest");
const InlineSearchTestPage = lazyWithRetry(() => import("./pages/InlineSearchTest"), "InlineSearchTest");
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard"), "Dashboard");
const OwnerAnalytics = lazyWithRetry(() => import("./pages/OwnerAnalytics"), "OwnerAnalytics");
const Tools = lazyWithRetry(() => import("./pages/Tools"), "Tools");
const Guides = lazyWithRetry(() => import("./pages/Guides"), "Guides");
const Challenges = lazyWithRetry(() => import("./pages/Challenges"), "Challenges");
const Coaching = lazyWithRetry(() => import("./pages/Coaching"), "Coaching");
const Contact = lazyWithRetry(() => import("./pages/Contact"), "Contact");
const GithubRoot = lazyWithRetry(() => import("./pages/GithubRoot"), "GithubRoot");
const GithubReadme = lazyWithRetry(() => import("./pages/GithubReadme"), "GithubReadme");
const GithubWriteTest = lazyWithRetry(() => import("./pages/GithubWriteTest"), "GithubWriteTest");
const GoRedirect = lazyWithRetry(() => import("./pages/GoRedirect"), "GoRedirect");
const MyFavorites = lazyWithRetry(() => import("./pages/MyFavorites"), "MyFavorites");
const MyReviews = lazyWithRetry(() => import("./pages/MyReviews"), "MyReviews");
const AddRecipe = lazyWithRetry(() => import("./pages/AddRecipe"), "AddRecipe");
const SearchResultsPage = lazyWithRetry(() => import("./pages/SearchResultsPage"), "SearchResultsPage");
const RecipePrint = lazyWithRetry(() => import("./pages/print/RecipePrint"), "RecipePrint");
const Help = lazyWithRetry(() => import("./pages/Help"), "Help");
const MyRecipeLibrary = lazyWithRetry(() => import("./pages/MyRecipeLibrary"), "MyRecipeLibrary");
const PasswordReset = lazyWithRetry(() => import("./pages/PasswordReset"), "PasswordReset");
const NewsletterPreview = lazyWithRetry(() => import("./pages/NewsletterPreview"), "NewsletterPreview");
const SaltConverter = lazyWithRetry(() => import("./pages/SaltConverter"), "SaltConverter");
const RecipeAdmin = lazyWithRetry(() => import("./pages/RecipeAdmin"), "RecipeAdmin");

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
              <Route path="/add-recipe" element={<AddRecipe />} />
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
              <Route path="/recipe-admin" element={<RecipeAdmin />} />
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