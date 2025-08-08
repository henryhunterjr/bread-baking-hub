import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import OfflineBanner from "@/components/OfflineBanner";
import BackToTop from "@/components/BackToTop";
import { AIAssistantSidebar } from "@/components/AIAssistantSidebar";
import { useState, Suspense, lazy } from "react";
import { SimpleLoadingSpinner } from "./components/SimpleLoadingSpinner";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

// Import Index directly to avoid lazy loading issues on main page
import Index from "./pages/Index";
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
const Tools = lazy(() => import("./pages/Tools"));
const Guides = lazy(() => import("./pages/Guides"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Coaching = lazy(() => import("./pages/Coaching"));
const Contact = lazy(() => import("./pages/Contact"));

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

const queryClient = new QueryClient();

const App = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <OfflineBanner />
            <BackToTop />
            <BrowserRouter>
              <Suspense fallback={<SimpleLoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/recipe-formatter" element={<RecipeFormatter />} />
                <Route path="/recipe-workspace" element={<RecipeWorkspace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/my-recipes" element={<MyRecipes />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/about" element={<About />} />
                <Route path="/books" element={<Books />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/vitale-starter" element={<VitaleStarter />} />
                <Route path="/kaiser-rolls" element={<KaiserRolls />} />
                <Route path="/henrys-foolproof-recipe" element={<HenrysFoolproofRecipe />} />
                <Route path="/glossary" element={<BreadGlossary />} />
                <Route path="/bread-calculator" element={<BreadCalculator />} />
                <Route path="/community" element={<Community />} />
                <Route path="/troubleshooting" element={<TroubleshootingPage />} />
                <Route path="/crust-and-crumb" element={<CrustAndCrumb />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/r/:slug" element={<PublicRecipe />} />
                <Route path="/feed.xml" element={<FeedRedirect />} />
                <Route path="/sitemap.xml" element={<SitemapRedirect />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/coaching" element={<Coaching />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/search-test" element={<SearchTest />} />
                <Route path="/inline-search-test" element={<InlineSearchTestPage />} />
                <Route path="/offline" element={<OfflineFallback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            
            {/* Site-wide AI Assistant - Crusty */}
            <AIAssistantSidebar 
              isOpen={isAIAssistantOpen}
              onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
            />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};

export default App;
