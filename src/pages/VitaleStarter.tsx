import Header from "../components/Header";
import Footer from "../components/Footer";
import { VitaleHero } from "../components/vitale/VitaleHero";
import { StarterTruthSection } from "../components/vitale/StarterTruthSection";
import { VitaleAdvantage } from "../components/vitale/VitaleAdvantage";
import { ThreeDayPromise } from "../components/vitale/ThreeDayPromise";
import { CustomerSuccess } from "../components/vitale/CustomerSuccess";
import { ProductDetails } from "../components/vitale/ProductDetails";
import { VitaleFAQ } from "../components/vitale/VitaleFAQ";
import { ProcessVideo } from "../components/vitale/ProcessVideo";
import { PurchaseSection } from "../components/vitale/PurchaseSection";
import { VitaleSEO } from "../components/vitale/VitaleSEO";
import FoolproofRecipeBlock from "../components/vitale/FoolproofRecipeBlock";
import VitaleMasteryHero from "../components/vitale/VitaleMasteryHero";
import { Suspense, lazy, useState } from 'react';

const LazyAIAssistantSidebar = lazy(() => import('@/components/AIAssistantSidebar').then(m => ({ default: m.AIAssistantSidebar })));

const VitaleStarter = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <VitaleSEO />
      <Header />
      <main>
        <VitaleHero />
        <FoolproofRecipeBlock />
        <StarterTruthSection />
        <VitaleMasteryHero />
        <VitaleAdvantage />
        <ThreeDayPromise />
        <CustomerSuccess />
        <ProductDetails />
        <VitaleFAQ />
        <ProcessVideo />
        <PurchaseSection />
      </main>
      <Footer />
      
      <Suspense fallback={null}>
        <LazyAIAssistantSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </Suspense>
    </div>
  );
};

export default VitaleStarter;