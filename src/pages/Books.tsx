import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BooksHeroSlideshow from "@/components/BooksHeroSlideshow";
import BooksGrid from "@/components/BooksGrid";

const Books = () => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  const showPreview = (slideId: string, content: string) => {
    setSelectedPreview(slideId);
    setPreviewContent(content);
  };

  const closePreview = () => {
    setSelectedPreview(null);
    setPreviewContent("");
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      {/* Hero Slideshow */}
      <BooksHeroSlideshow onPreview={showPreview} />

      {/* Books Grid */}
      <BooksGrid onPreview={showPreview} />

      {/* Newsletter CTA */}
      <section className="py-16 bg-section-background">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="bg-card rounded-2xl p-12 shadow-stone">
            <h2 className="text-3xl font-bold text-primary mb-4">Stay Connected</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get notified when new books are released and receive exclusive baking tips and recipes.
            </p>
            <Button size="lg" asChild>
              <a href="https://www.facebook.com/groups/BakingGreatBreadAtHome" target="_blank" rel="noopener noreferrer">
                Join the Community
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {selectedPreview && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div 
            className="bg-background rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto p-8 shadow-stone"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-primary">Book Preview</h2>
              <Button variant="ghost" size="icon" onClick={closePreview}>
                <span className="text-2xl">&times;</span>
              </Button>
            </div>
            <div 
              className="prose prose-stone dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Books;