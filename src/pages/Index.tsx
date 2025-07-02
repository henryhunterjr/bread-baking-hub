import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import AboutHenry from "../components/AboutHenry";
import BooksGrid from "../components/BooksGrid";
import ToolsResources from "../components/ToolsResources";
import RecommendedProducts from "../components/RecommendedProducts";
import BakersBench from "../components/BakersBench";
import MonthlyChallenge from "../components/MonthlyChallenge";
import LatestBlogPosts from "../components/LatestBlogPosts";
import CallToAction from "../components/CallToAction";

const Index = () => {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <AboutHenry />
        <BooksGrid />
        <ToolsResources />
        <RecommendedProducts />
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