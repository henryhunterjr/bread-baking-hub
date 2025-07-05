import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BooksHeroSlideshow from "@/components/BooksHeroSlideshow";
import BooksGrid from "@/components/BooksGrid";
import BookshelfDisplay from "@/components/BookshelfDisplay";
import AuthorReflectionBlock from "@/components/AuthorReflectionBlock";
import ComingSoonBlock from "@/components/ComingSoonBlock";
import PraiseSocialProof from "@/components/PraiseSocialProof";
import LoafAndLieSpotlight from "@/components/LoafAndLieSpotlight";
import BookPreviewModal from "@/components/BookPreviewModal";
import { bookData } from "@/data/books-data";

const Books = () => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const showPreview = (slideId: string) => {
    setSelectedPreview(slideId);
  };

  const closePreview = () => {
    setSelectedPreview(null);
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setIsPlayingAudio(false);
  };

  const selectedBook = selectedPreview ? bookData[selectedPreview] : null;

  const playAudioExcerpt = () => {
    if (selectedBook?.audioUrl) {
      // For Google Drive links, open in new tab instead of trying to play inline
      if (selectedBook.audioUrl.includes('googleapis.com') || selectedBook.audioUrl.includes('drive.google.com')) {
        window.open("https://drive.google.com/file/d/1UkmQgTw_s6uM2wBcSl4Z4xkTOYi7kJpt/view", '_blank');
        return;
      }
      
      if (audioElement && !audioElement.paused) {
        // If audio is already playing, pause it
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        // Create new audio element if it doesn't exist
        if (!audioElement) {
          const audio = new Audio(selectedBook.audioUrl);
          audio.addEventListener('loadstart', () => setIsPlayingAudio(true));
          audio.addEventListener('ended', () => setIsPlayingAudio(false));
          audio.addEventListener('error', () => {
            setIsPlayingAudio(false);
            alert('Unable to load audio. Please try again later.');
          });
          setAudioElement(audio);
          audio.play().catch(() => {
            setIsPlayingAudio(false);
            alert('Unable to play audio. Please try again later.');
          });
        } else {
          // Use existing audio element
          audioElement.play().then(() => {
            setIsPlayingAudio(true);
          }).catch(() => {
            setIsPlayingAudio(false);
            alert('Unable to play audio. Please try again later.');
          });
        }
      }
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      {/* Hero Slideshow */}
      <BooksHeroSlideshow onPreview={(slideId) => showPreview(slideId)} />

      {/* Author Reflection Block 1 */}
      <AuthorReflectionBlock 
        story="This book started on a flour-dusted table in Atlanta during lockdown, when I realized most sourdough books weren't written for us—the home bakers who just wanted great bread without the drama."
        position="left"
      />

      {/* Bookshelf Display */}
      <BookshelfDisplay onPreview={(slideId) => showPreview(slideId)} />

      {/* Author Reflection Block 2 */}
      <AuthorReflectionBlock 
        story="After years of teaching bread-making, I discovered that the real magic isn't in perfect technique—it's in understanding the living culture that makes each loaf unique. That's when Vitale was born."
        position="right"
      />

      {/* Books Grid */}
      <BooksGrid onPreview={(slideId) => showPreview(slideId)} />

      {/* The Loaf and the LIE Spotlight */}
      <LoafAndLieSpotlight onPreview={() => showPreview('loaflie')} />

      {/* Coming Soon Block */}
      <ComingSoonBlock />

      {/* Praise & Social Proof */}
      <PraiseSocialProof />

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

      <BookPreviewModal 
        selectedBook={selectedBook}
        isPlayingAudio={isPlayingAudio}
        onClose={closePreview}
        onPlayAudio={playAudioExcerpt}
      />

      <Footer />
    </div>
  );
};

export default Books;