import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaKitHero from "@/components/mediakit/MediaKitHero";
import PlatformCards from "@/components/mediakit/PlatformCards";
import GrowthCharts from "@/components/mediakit/GrowthCharts";
import AudienceProfile from "@/components/mediakit/AudienceProfile";
import TopContent from "@/components/mediakit/TopContent";
import PartnerSection from "@/components/mediakit/PartnerSection";
import CollaborationBenefits from "@/components/mediakit/CollaborationBenefits";
import ContactCTA from "@/components/mediakit/ContactCTA";
import ExportControls from "@/components/mediakit/ExportControls";
import { MediaKitProvider } from "@/components/mediakit/MediaKitContext";

const MediaKit = () => {
  return (
    <MediaKitProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Media Kit - Henry Hunter | Artisan Baker & Community Leader</title>
          <meta 
            name="description" 
            content="Partner with Henry Hunter - Artisan Baker, Author, and Community Leader. View our reach, engagement stats, and collaboration opportunities." 
          />
          <meta name="robots" content="index, follow" />
        </Helmet>
        
        
        <ExportControls />
        <Header />
        
        <main>
          <MediaKitHero />
          <PlatformCards />
          <GrowthCharts />
          <AudienceProfile />
          <TopContent />
          <PartnerSection />
          <CollaborationBenefits />
          <ContactCTA />
        </main>
        
        <Footer />
      </div>
    </MediaKitProvider>
  );
};

export default MediaKit;
