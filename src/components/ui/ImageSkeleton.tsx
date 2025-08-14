import { cn } from "@/lib/utils"

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
}

export function ImageSkeleton({ 
  className,
  aspectRatio = 'landscape'
}: ImageSkeletonProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video', 
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted rounded-md",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent animate-pulse" />
      
      {/* Shimmer sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

/* Add to tailwind.config.ts under keyframes: */
/*
shimmer: {
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(100%)' }
}
*/