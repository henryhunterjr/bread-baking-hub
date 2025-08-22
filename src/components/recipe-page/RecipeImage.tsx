import { ResponsiveImage } from '@/components/ResponsiveImage';

interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const RecipeImage = ({ 
  src, 
  alt, 
  className = "", 
  width = 800,
  height = 600,
  priority = false 
}: RecipeImageProps) => {
  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <ResponsiveImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="rounded-2xl shadow-warm w-full h-auto"
        loading={priority ? "eager" : "lazy"}
        sizes="(max-width: 768px) 100vw, 800px"
        aspectRatio="4:3"
      />
    </div>
  );
};