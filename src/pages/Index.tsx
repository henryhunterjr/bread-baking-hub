import { useState } from 'react';
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
import { AIAssistantSidebar } from "../components/AIAssistantSidebar";

const Index = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <AboutHenry />
        <PodcastSection />
        <BooksPreview />
        <ToolsResources />
        <RecommendedTools />
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
  );
};

export default Index;