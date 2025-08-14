import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export default function TroubleshootingHero() {
  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
      <ImageWithFallback
        src="/lovable-uploads/929d8961-290b-4bf6-a6a1-16fee8b2a307.png"
        alt="Troubleshooting - Bread baking tools and ingredients on wooden surface"
        className="w-full h-full object-cover"
        loading="eager"
        priority
        onError={() => {
          console.error('Troubleshooting hero image failed to load:', '/lovable-uploads/929d8961-290b-4bf6-a6a1-16fee8b2a307.png');
        }}
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-shadow-lg">
            Troubleshooting
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-shadow-md">
            Solve your bread baking challenges
          </p>
        </div>
      </div>
    </div>
  );
}