import * as React from "react";
import { Navigate, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
import DefaultSEO from "./components/DefaultSEO";
import { PerformanceDebugger } from '@/components/PerformanceMetrics';
import { RouteCleanupHandler } from "./components/RouteCleanupHandler";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

// Import Index directly to avoid lazy loading issues on main page
import Index from "./pages/Index";

// Lazy loaded components
const RecipeFormatter = React.lazy(() => import("./pages/RecipeFormatter"));
const RecipeWorkspace = React.lazy(() => import("./pages/RecipeWorkspace"));
const Auth = React.lazy(() => import("./pages/Auth"));
const MyRecipes = React.lazy(() => import("./pages/MyRecipes"));
const About = React.lazy(() => import("./pages/About"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Books = React.lazy(() => import("./pages/Books"));
const Recipes = React.lazy(() => import("./pages/Recipes"));
const VitaleStarter = React.lazy(() => import("./pages/VitaleStarter"));
const VitalePreview = React.lazy(() => import("./pages/VitalePreview"));
const KaiserRolls = React.lazy(() => import("./pages/KaiserRolls"));
const PublicRecipe = React.lazy(() => import("./pages/PublicRecipe"));
const HenrysFoolproofRecipe = React.lazy(() => import("./pages/HenrysFoolproofRecipe"));
const BreadGlossary = React.lazy(() => import("./pages/BreadGlossary"));
const BreadCalculator = React.lazy(() => import("./pages/BreadCalculator"));
const Community = React.lazy(() => import("./pages/Community"));
const TroubleshootingPage = React.lazy(() => import("./pages/TroubleshootingPage"));
const OfflineFallback = React.lazy(() => import("./pages/OfflineFallback"));
const CrustAndCrumb = React.lazy(() => import("./pages/CrustAndCrumb"));
const Legal = React.lazy(() => import("./pages/Legal"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const SearchTest = React.lazy(() => import("./pages/SearchTest"));
const InlineSearchTestPage = React.lazy(() => import("./pages/InlineSearchTest"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Tools = React.lazy(() => import("./pages/Tools"));
const Guides = React.lazy(() => import("./pages/Guides"));
const Challenges = React.lazy(() => import("./pages/Challenges"));
const Coaching = React.lazy(() => import("./pages/Coaching"));
const Contact = React.lazy(() => import("./pages/Contact"));
const GithubRoot = React.lazy(() => import("./pages/GithubRoot"));
const GithubReadme = React.lazy(() => import("./pages/GithubReadme"));
const GithubWriteTest = React.lazy(() => import("./pages/GithubWriteTest"));
const GoRedirect = React.lazy(() => import("./pages/GoRedirect"));
const LazyAIAssistantSidebar = React.lazy(() => import("./components/AIAssistantSidebar").then(m => ({ default: m.AIAssistantSidebar })));
const MyFavorites = React.lazy(() => import("./pages/MyFavorites"));
const MyReviews = React.lazy(() => import("./pages/MyReviews"));
const SearchResultsPage = React.lazy(() => import("./pages/SearchResultsPage"));

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

// Recipe redirect component for backward compatibility
const RecipeRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/recipes/${slug}`} replace />;
};

function App() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = React.useState(false);

  return (
    <AppErrorBoundary>
      <AuthProvider>
          <TooltipProvider>
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
            <BrowserRouter>
              <RouteCleanupHandler />
                <EnhancedSkipLink />
                <DefaultSEO />
                <React.Suspense fallback={<SimpleLoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/recipe-formatter" element={<RecipeFormatter />} />
                    <Route path="/recipe-workspace" element={<RecipeWorkspace />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/my-recipes" element={<MyRecipes />} />
                    <Route path="/my-favorites" element={<MyFavorites />} />
                    <Route path="/my-reviews" element={<MyReviews />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/vitale-starter" element={<VitaleStarter />} />
                    <Route path="/preview/vitale-sourdough-mastery" element={<VitalePreview />} />
                    <Route path="/kaiser-rolls" element={<KaiserRolls />} />
                    <Route path="/henrys-foolproof-recipe" element={<HenrysFoolproofRecipe />} />
                    <Route path="/glossary" element={<BreadGlossary />} />
                    <Route path="/bread-calculator" element={<BreadCalculator />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/troubleshooting" element={<TroubleshootingPage />} />
                    <Route path="/crust-and-crumb" element={<CrustAndCrumb />} />
                    <Route path="/legal" element={<Legal />} />
                    <Route path="/recipes/:slug" element={<PublicRecipe />} />
                    <Route path="/r/:slug" element={<PublicRecipe />} />
                    <Route path="/recipe/:slug" element={<RecipeRedirect />} />
                    <Route path="/feed.xml" element={<FeedRedirect />} />
                    <Route path="/sitemap.xml" element={<SitemapRedirect />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/guides" element={<Guides />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/coaching" element={<Coaching />} />
                    <Route path="/contact" element={<Contact />} />
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
                </React.Suspense>
                
                <React.Suspense fallback={null}>
                  <LazyAIAssistantSidebar 
                    isOpen={isAIAssistantOpen}
                    onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
                  />
                </React.Suspense>
              </BrowserRouter>
            </CriticalResourceLoader>
            {/* Performance debugger removed to prevent re-render flashing */}
          </TooltipProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}

export default App;