import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Play } from 'lucide-react';

const PodcastSection = () => {
  const handleListenClick = () => {
    // Replace with your actual podcast URL
    window.open('https://youtube.com/@your-channel', '_blank');
  };

  return (
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
            <div className="relative group cursor-pointer" onClick={handleListenClick}>
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
            onClick={handleListenClick}
            size="lg"
            className="mr-4 mb-4"
          >
            <Play className="w-5 h-5 mr-2" />
            Listen Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open('https://youtube.com/@your-channel', '_blank')}
            className="mb-4"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Subscribe on YouTube
          </Button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            New episodes weekly • Available on all major podcast platforms
          </p>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;