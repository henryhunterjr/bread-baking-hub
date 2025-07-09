import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import OfflineBanner from "@/components/OfflineBanner";
import BackToTop from "@/components/BackToTop";
import { AIAssistantSidebar } from "@/components/AIAssistantSidebar";
import { useState } from "react";
import Index from "./pages/Index";
import RecipeFormatter from "./pages/RecipeFormatter";
import RecipeWorkspace from "./pages/RecipeWorkspace";
import Auth from "./pages/Auth";
import MyRecipes from "./pages/MyRecipes";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Books from "./pages/Books";
import Recipes from "./pages/Recipes";
import VitaleStarter from "./pages/VitaleStarter";
import PublicRecipe from "./pages/PublicRecipe";
import HenrysFoolproofRecipe from "./pages/HenrysFoolproofRecipe";
import BreadGlossary from "./pages/BreadGlossary";
import BreadCalculator from "./pages/BreadCalculator";
import Community from "./pages/Community";
import TroubleshootingPage from "./pages/TroubleshootingPage";
import OfflineFallback from "./pages/OfflineFallback";
import CrustAndCrumb from "./pages/CrustAndCrumb";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import SearchTest from "./pages/SearchTest";
import InlineSearchTestPage from "./pages/InlineSearchTest";

// Feed redirect component
const FeedRedirect = () => {
  window.location.href = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/rss-feed';
  return <div>Redirecting to RSS feed...</div>;
};

const queryClient = new QueryClient();

const App = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineBanner />
          <BackToTop />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recipe-formatter" element={<RecipeFormatter />} />
              <Route path="/recipe-workspace" element={<RecipeWorkspace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-recipes" element={<MyRecipes />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/books" element={<Books />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/vitale-starter" element={<VitaleStarter />} />
              <Route path="/henrys-foolproof-recipe" element={<HenrysFoolproofRecipe />} />
              <Route path="/glossary" element={<BreadGlossary />} />
              <Route path="/bread-calculator" element={<BreadCalculator />} />
              <Route path="/community" element={<Community />} />
              <Route path="/troubleshooting" element={<TroubleshootingPage />} />
              <Route path="/crust-and-crumb" element={<CrustAndCrumb />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/r/:slug" element={<PublicRecipe />} />
              <Route path="/feed.xml" element={<FeedRedirect />} />
              <Route path="/search-test" element={<SearchTest />} />
              <Route path="/inline-search-test" element={<InlineSearchTestPage />} />
              <Route path="/offline" element={<OfflineFallback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Site-wide AI Assistant - Crusty */}
            <AIAssistantSidebar 
              isOpen={isAIAssistantOpen}
              onToggle={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
            />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
