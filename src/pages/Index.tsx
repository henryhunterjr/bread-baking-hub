import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import AboutHenry from "../components/AboutHenry";
import BooksPreview from "../components/BooksPreview";
import ToolsResources from "../components/ToolsResources";
import { FromOvenToMarketHero } from "../components/FromOvenToMarketHero";
import BakersBench from "../components/BakersBench";
import MonthlyChallenge from "../components/MonthlyChallenge";
import LatestBlogPosts from "../components/LatestBlogPosts";
import CallToAction from "../components/CallToAction";
import PodcastSection from "../components/PodcastSection";
import RecommendedTools from "../components/RecommendedTools";

const Index = () => {
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
        <LatestBlogPosts />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;