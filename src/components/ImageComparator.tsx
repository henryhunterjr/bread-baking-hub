import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface ImageComparatorProps {
  beforeSrc: string;
  afterSrc: string;
  annotation?: string;
  width?: number; // optional width in px
  height?: number; // optional height in px
}

const ImageComparator: React.FC<ImageComparatorProps> = ({
  beforeSrc,
  afterSrc,
  annotation,
  width,
  height
}) => {
  const [showBefore, setShowBefore] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const containerStyle = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  const aspectRatio = height && width ? width / height : 16 / 9;

  return (
    <Card className="overflow-hidden">
      <div 
        className="relative group cursor-pointer"
        style={containerStyle}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setShowBefore(!showBefore)}
      >
        {/* Before Image */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${
            showBefore ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={beforeSrc}
            alt="Before"
            className="w-full h-full object-cover"
            style={{ aspectRatio: height ? `${width}/${height}` : aspectRatio }}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=${width || 400}&h=${height || 300}&fit=crop`;
            }}
          />
          <div className="absolute top-2 left-2">
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
              Problem
            </span>
          </div>
        </div>

        {/* After Image */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${
            showBefore ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <img
            src={afterSrc}
            alt="After"
            className="w-full h-full object-cover"
            style={{ aspectRatio: height ? `${width}/${height}` : aspectRatio }}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=${width || 400}&h=${height || 300}&fit=crop`;
            }}
          />
          <div className="absolute top-2 left-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
              Solution
            </span>
          </div>
        </div>

        {/* Overlay Controls */}
        <div 
          className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="bg-background/90 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                setShowBefore(!showBefore);
              }}
            >
              {showBefore ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Solution
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Show Problem
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Click Indicator */}
        <div className="absolute bottom-2 right-2">
          <span className="bg-background/80 text-foreground px-2 py-1 rounded text-xs">
            Click to compare
          </span>
        </div>
      </div>

      {/* Annotation */}
      {annotation && (
        <div className="p-3 bg-muted/30 border-t">
          <p className="text-sm text-muted-foreground text-center">
            {annotation}
          </p>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex border-t">
        <Button
          variant={showBefore ? "default" : "ghost"}
          className="flex-1 rounded-none border-r"
          onClick={() => setShowBefore(true)}
        >
          <span className="w-3 h-3 bg-destructive rounded-full mr-2"></span>
          Before
        </Button>
        <Button
          variant={!showBefore ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => setShowBefore(false)}
        >
          <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
          After
        </Button>
      </div>
    </Card>
  );
};

export default ImageComparator;