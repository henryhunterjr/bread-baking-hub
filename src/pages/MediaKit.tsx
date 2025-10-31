import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaKitHero from "@/components/mediakit/MediaKitHero";
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
        
        <Header />
        
        <main>
          <MediaKitHero />
          
          {/* Future sections will go here */}
        </main>
        
        <Footer />
      </div>
    </MediaKitProvider>
  );
};

export default MediaKit;
