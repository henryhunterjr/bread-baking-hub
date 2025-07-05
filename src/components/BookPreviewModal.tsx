import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { BookData } from "@/data/books-data";

interface BookPreviewModalProps {
  selectedBook: BookData | null;
  isPlayingAudio: boolean;
  onClose: () => void;
  onPlayAudio: () => void;
}

const BookPreviewModal = ({ 
  selectedBook, 
  isPlayingAudio, 
  onClose, 
  onPlayAudio 
}: BookPreviewModalProps) => {
  if (!selectedBook) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-stone animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Book Cover */}
          <div className="lg:w-1/3 p-8 flex flex-col items-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <img 
              src={selectedBook.coverImage} 
              alt={selectedBook.title}
              className="w-full max-w-[250px] rounded-lg shadow-stone mb-6"
            />
            {selectedBook.audioUrl && (
              <Button 
                onClick={onPlayAudio}
                className="w-full max-w-[200px] mb-4"
                variant="default"
              >
                <Play className="mr-2 h-4 w-4" />
                Listen to Excerpt
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full max-w-[200px]"
              asChild
            >
              <a href="https://read.amazon.com/sample/B0FGQPM4TG?clientId=share" target="_blank" rel="noopener noreferrer">
                Read Sample
              </a>
            </Button>
          </div>

          {/* Right side - Book Details */}
          <div className="lg:w-2/3 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {selectedBook.title}
                </h1>
                <p className="text-xl text-muted-foreground italic mb-2">
                  {selectedBook.subtitle}
                </p>
                <p className="text-lg text-primary font-medium">
                  By {selectedBook.author}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Book Details</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {selectedBook.description}
              </p>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Reading age:</strong> Adult
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Language:</strong> English
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Publication date:</strong> 2024
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Book Preview</h3>
              <div 
                className="prose prose-stone dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBook.previewContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreviewModal;