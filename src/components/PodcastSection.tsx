import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Play, X } from 'lucide-react';

const PodcastSection = () => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const podcastUrl = 'https://youtu.be/49XtxfMlBgo';
  const embedUrl = 'https://www.youtube.com/embed/49XtxfMlBgo?autoplay=1&rel=0';

  const handlePlayClick = () => {
    setIsPlayerOpen(true);
  };

  const handleExternalClick = () => {
    window.open(podcastUrl, '_blank');
  };

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              The Jar Podcast
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Wisdom on Bread, Beyond the Loaf - Join Henry Hunter for deep conversations about baking, life, and everything in between
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Card className="overflow-hidden shadow-xl max-w-2xl w-full">
              <div className="relative group cursor-pointer" onClick={handlePlayClick}>
                <img 
                  src="/lovable-uploads/13eb9d90-3919-4aa9-aaa3-7d6da4df286d.png" 
                  alt="The Jar Podcast with Henry Hunter - Wisdom on Bread, Beyond the Loaf"
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-primary/90 text-primary-foreground rounded-full p-4">
                    <Play className="w-8 h-8 fill-current" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={handlePlayClick}
              size="lg"
              className="mr-4 mb-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Listen Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleExternalClick}
              className="mb-4"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Watch on YouTube
            </Button>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              New episodes weekly • Available on all major podcast platforms
            </p>
          </div>
        </div>
      </section>

      {/* Media Player Modal */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>The Jar Podcast</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlayerOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title="The Jar Podcast"
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PodcastSection;