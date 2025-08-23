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
import LoafAndLieHeroSection from "@/components/LoafAndLieHeroSection";
import BreadJourneyFeatured from "@/components/BreadJourneyFeatured";
import { Suspense } from "react";
import { 
  LazyAudioPlayerModal, 
  LazyVideoPlayerModal, 
  LazyBookPreviewModal,
  AudioPlayerFallback,
  VideoPlayerFallback,
  BookPreviewFallback
} from "@/components/LazyComponentLoader";
import { bookData } from "@/data/books-data";
import { Helmet } from 'react-helmet-async';
import { sanitizeStructuredData } from '@/utils/sanitize';

const Books = () => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{url: string, title: string, description: string} | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const showPreview = (slideId: string) => {
    setSelectedPreview(slideId);
  };

  const showAudioPlayer = (slideId: string) => {
    const book = bookData[slideId];
    if (book?.id === 'loaflie' && book?.videoUrl) {
      // For "The Loaf and the LIE", show video instead of audio
      setSelectedVideo({
        url: book.videoUrl,
        title: book.title,
        description: book.subtitle
      });
    } else {
      setSelectedAudio(slideId);
    }
  };

  const showVideoPlayer = (bookId: string, videoUrl: string) => {
    const book = bookData[bookId];
    if (book) {
      setSelectedVideo({
        url: videoUrl,
        title: book.title,
        description: book.subtitle
      });
    }
  };

  const closePreview = () => {
    setSelectedPreview(null);
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setIsPlayingAudio(false);
  };

  const closeAudioPlayer = () => {
    setSelectedAudio(null);
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
  };

  const selectedBook = selectedPreview ? bookData[selectedPreview] : null;
  const selectedAudioBook = selectedAudio ? bookData[selectedAudio] : null;

  const playAudioExcerpt = () => {
    if (selectedBook?.id === 'loaflie' && selectedBook?.videoUrl) {
      // For "The Loaf and the LIE", show video instead of audio
      setSelectedPreview(null);
      setSelectedVideo({
        url: selectedBook.videoUrl,
        title: selectedBook.title,
        description: selectedBook.subtitle
      });
    } else if (selectedBook?.audioUrl) {
      // Close preview modal and open audio player modal
      setSelectedPreview(null);
      setSelectedAudio(selectedBook.id);
    }
  };

  const playVideoFromPreview = (videoUrl: string) => {
    if (selectedBook) {
      setSelectedPreview(null);
      setSelectedVideo({
        url: videoUrl,
        title: selectedBook.title,
        description: selectedBook.subtitle
      });
    }
  };

  // SEO metadata
  const canonicalUrl = "https://bread-baking-hub.vercel.app/books";
  const metaTitle = "Books by Henry Hunter Jr – Baking Great Bread";
  const metaDescription = "Explore Henry Hunter Jr’s bread books: Bread: A Journey, Sourdough for the Rest of Us, and more. Previews, audio excerpts, and purchase links.";

  // Structured data for CollectionPage with ItemList of books
  const booksList = Object.values(bookData);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Books by Henry Hunter Jr",
    description: metaDescription,
    url: canonicalUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: booksList.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Book",
          name: b.title,
          author: { "@type": "Person", name: b.author },
          image: b.coverImage,
          url: `${canonicalUrl}#${b.id}`
        }
      }))
    }
  };

  // Additional structured data for author, featured book, and product listings
  const siteUrl = "https://bread-baking-hub.vercel.app";
  const ogImageUrl = `${siteUrl}${bookData.journey.coverImage}`;

  const authorPersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Henry Hunter",
    url: `${siteUrl}/about`,
    image: `${siteUrl}/lovable-uploads/e9d4e95a-2202-46e4-9b07-ae4646daff63.png`,
    jobTitle: "Master Baker & Author",
    sameAs: [
      "https://www.youtube.com/@bakinggreatbread",
      "https://www.instagram.com/bakinggreatbread"
    ]
  };

  const breadJourney = bookData.journey;
  const breadJourneyBookSchema = breadJourney ? {
    "@context": "https://schema.org",
    "@type": "Book",
    name: breadJourney.title,
    alternateName: breadJourney.subtitle,
    author: { "@type": "Person", name: breadJourney.author },
    image: `${siteUrl}${breadJourney.coverImage}`,
    inLanguage: "en",
    bookFormat: "EBook",
    description: breadJourney.description,
    publisher: { "@type": "Organization", name: "Baking Great Bread" },
    url: `${canonicalUrl}#${breadJourney.id}`,
    workExample: breadJourney.sampleUrl ? {
      "@type": "Book",
      url: breadJourney.sampleUrl,
      bookFormat: "EBook"
    } : undefined
  } : undefined;

  const productSchemas = ['journey', 'sourdough', 'loaflie', 'market']
    .filter((id) => (bookData as any)[id])
    .map((id) => {
      const b = (bookData as any)[id];
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: b.title,
        description: b.description,
        image: `${siteUrl}${b.coverImage}`,
        brand: { "@type": "Brand", name: "Baking Great Bread" },
        sku: b.id,
        url: `${canonicalUrl}#${b.id}`,
        category: "Books"
      };
    });

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeStructuredData(collectionSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizeStructuredData(authorPersonSchema) }}
        />
        {breadJourneyBookSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: sanitizeStructuredData(breadJourneyBookSchema) }}
          />
        )}
        {productSchemas && productSchemas.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: sanitizeStructuredData(productSchemas) }}
          />
        )}
      </Helmet>
      <div className="bg-background text-foreground min-h-screen">
        <Header />
        <main id="main-content" role="main" tabIndex={-1}>

      <BooksHeroSlideshow onPreview={(slideId) => showPreview(slideId)} />

      {/* Author Reflection Block 1 */}
      <AuthorReflectionBlock 
        story="This book started on a flour-dusted table in Atlanta during lockdown, when I realized most sourdough books weren't written for us—the home bakers who just wanted great bread without the drama."
        position="left"
      />

      {/* The Loaf and the LIE Hero Section */}
      <LoafAndLieHeroSection onListen={() => showAudioPlayer('loaflie')} />

      {/* Bookshelf Display */}
      <BookshelfDisplay onPreview={(slideId) => showPreview(slideId)} />

      {/* Author Reflection Block 2 */}
      <AuthorReflectionBlock 
        story="After years of teaching bread-making, I discovered that the real magic isn't in perfect technique—it's in understanding the living culture that makes each loaf unique. That's when Vitale was born."
        position="right"
      />

      {/* Bread Journey Featured Section */}
      <BreadJourneyFeatured onListen={() => showAudioPlayer('journey')} />

      {/* Books Grid */}
      <BooksGrid 
        onPreview={(slideId) => showPreview(slideId)} 
        onVideoPlay={showVideoPlayer}
      />

      {/* The Loaf and the LIE Spotlight */}
      <LoafAndLieSpotlight 
        onPreview={() => showPreview('loaflie')} 
        onAudio={() => showAudioPlayer('loaflie')}
      />

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
              <a href="https://bit.ly/3srdSYS" target="_blank" rel="noopener noreferrer">
                Join the Community
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Suspense fallback={<BookPreviewFallback />}>
        <LazyBookPreviewModal 
          selectedBook={selectedBook}
          isPlayingAudio={isPlayingAudio}
          onClose={closePreview}
          onPlayAudio={playAudioExcerpt}
          onVideoPlay={playVideoFromPreview}
        />
      </Suspense>

      <Suspense fallback={<AudioPlayerFallback />}>
        <LazyAudioPlayerModal 
          selectedBook={selectedAudioBook}
          onClose={closeAudioPlayer}
        />
      </Suspense>

      <Suspense fallback={<VideoPlayerFallback />}>
        <LazyVideoPlayerModal 
          isOpen={!!selectedVideo}
          onClose={closeVideoPlayer}
          videoUrl={selectedVideo?.url || ''}
          title={selectedVideo?.title || ''}
          description={selectedVideo?.description || ''}
        />
      </Suspense>

      </main>
      <Footer />
    </div>
    </>
  );
};

export default Books;