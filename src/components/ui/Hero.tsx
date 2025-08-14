import React from 'react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { BackgroundImageWithFallback } from '@/components/ui/BackgroundImageWithFallback';
import { Button } from '@/components/ui/button';

interface HeroProps {
  // Content
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  description?: string;
  
  // Image
  imageSrc: string;
  imageAlt: string;
  
  // Layout options
  variant?: 'overlay' | 'background' | 'below';
  textPosition?: 'center' | 'bottom' | 'below-image';
  height?: 'sm' | 'md' | 'lg';
  
  // Styling
  overlayOpacity?: 'light' | 'medium' | 'dark';
  textColor?: 'white' | 'primary' | 'muted';
  rounded?: boolean;
  shadow?: boolean;
  
  // CTA
  cta?: {
    text: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'warm' | 'outline';
  };
  
  // Additional props
  className?: string;
  priority?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  eyebrow,
  description,
  imageSrc,
  imageAlt,
  variant = 'overlay',
  textPosition = 'center',
  height = 'md',
  overlayOpacity = 'medium',
  textColor = 'white',
  rounded = false,
  shadow = false,
  cta,
  className = '',
  priority = true,
}) => {
  // Height classes
  const heightClasses = {
    sm: 'h-48 md:h-56',
    md: 'h-48 md:h-64 lg:h-80',
    lg: 'h-64 md:h-80 lg:h-96'
  };

  // Overlay opacity classes
  const overlayClasses = {
    light: 'bg-black/10',
    medium: 'bg-black/20',
    dark: 'bg-black/40'
  };

  // Text color classes
  const textColorClasses = {
    white: 'text-white',
    primary: 'text-foreground',
    muted: 'text-muted-foreground'
  };

  // Text position classes
  const textPositionClasses = {
    center: 'flex items-center justify-center',
    bottom: 'flex items-end justify-center pb-8',
    'below-image': '' // handled separately
  };

  // Handle below-image variant (like RecipeWorkspace)
  if (variant === 'below') {
    return (
      <div className={`w-full ${className}`}>
        <ImageWithFallback
          src={imageSrc}
          alt={imageAlt}
          className={`w-full ${heightClasses[height]} object-cover object-bottom ${
            rounded ? 'rounded-lg' : ''
          } ${shadow ? 'shadow-lg' : ''}`}
          loading="eager"
          priority={priority}
        />
        {(title || subtitle || description || cta) && (
          <div className="text-center space-y-4 mt-6">
            {eyebrow && (
              <p className="text-sm font-medium text-primary uppercase tracking-wide">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {title}
              </h1>
            )}
            {subtitle && (
              <h2 className="text-xl md:text-2xl font-semibold">
                {subtitle}
              </h2>
            )}
            {description && (
              <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${textColorClasses[textColor]}`}>
                {description}
              </p>
            )}
            {cta && (
              <div className="pt-2">
                <Button
                  variant={cta.variant || 'default'}
                  onClick={cta.onClick}
                  asChild={!!cta.href}
                >
                  {cta.href ? (
                    <a href={cta.href}>{cta.text}</a>
                  ) : (
                    cta.text
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Handle background variant (like Glossary)
  if (variant === 'background') {
    return (
      <section className={`relative ${heightClasses[height]} overflow-hidden ${className}`}>
        <BackgroundImageWithFallback 
          src={imageSrc}
          className="absolute inset-0 bg-cover bg-center"
        />
        <div className={`absolute inset-0 ${overlayClasses[overlayOpacity]}`} />
        <div className={`relative h-full ${textPositionClasses[textPosition]}`}>
          <div className={`text-center ${textColorClasses[textColor]}`}>
            {eyebrow && (
              <p className="text-sm md:text-base mb-2 drop-shadow-md">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-shadow-lg">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl lg:text-2xl text-shadow-md">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg md:text-xl mb-2 drop-shadow-md">
                {description}
              </p>
            )}
            {cta && (
              <div className="pt-4">
                <Button
                  variant={cta.variant || 'default'}
                  onClick={cta.onClick}
                  asChild={!!cta.href}
                >
                  {cta.href ? (
                    <a href={cta.href}>{cta.text}</a>
                  ) : (
                    cta.text
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Handle overlay variant (like Troubleshooting) - default
  return (
    <div className={`relative w-full ${heightClasses[height]} overflow-hidden ${className}`}>
      <ImageWithFallback
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
        loading="eager"
        priority={priority}
        onError={() => {
          console.error('Hero image failed to load:', imageSrc);
        }}
      />
      <div className={`absolute inset-0 ${overlayClasses[overlayOpacity]} ${textPositionClasses[textPosition]}`}>
        <div className={`text-center ${textColorClasses[textColor]}`}>
          {eyebrow && (
            <p className="text-sm md:text-base mb-2 drop-shadow-md">
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-shadow-lg">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl text-shadow-md">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-lg md:text-xl mb-2 drop-shadow-md">
              {description}
            </p>
          )}
          {cta && (
            <div className="pt-4">
              <Button
                variant={cta.variant || 'default'}
                onClick={cta.onClick}
                asChild={!!cta.href}
              >
                {cta.href ? (
                  <a href={cta.href}>{cta.text}</a>
                ) : (
                  cta.text
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};