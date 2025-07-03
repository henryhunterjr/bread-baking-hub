import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { OfflineBanner } from "@/components/OfflineBanner";
import Index from "./pages/Index";
import RecipeFormatter from "./pages/RecipeFormatter";
import RecipeWorkspace from "./pages/RecipeWorkspace";
import Auth from "./pages/Auth";
import MyRecipes from "./pages/MyRecipes";
import About from "./pages/About";
import PublicRecipe from "./pages/PublicRecipe";
import BreadGlossary from "./pages/BreadGlossary";
import OfflineFallback from "./pages/OfflineFallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineBanner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recipe-formatter" element={<RecipeFormatter />} />
            <Route path="/recipe-workspace" element={<RecipeWorkspace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/about" element={<About />} />
            <Route path="/glossary" element={<BreadGlossary />} />
            <Route path="/r/:slug" element={<PublicRecipe />} />
            <Route path="/offline" element={<OfflineFallback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
