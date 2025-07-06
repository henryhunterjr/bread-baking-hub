interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const RecipeImage = ({ src, alt, className = "" }: RecipeImageProps) => {
  return (
    <div className={`relative max-w-2xl mx-auto ${className}`}>
      <img 
        src={src}
        alt={alt}
        className="rounded-2xl shadow-warm w-full h-auto"
        loading="lazy"
        width="800"
        height="600"
      />
    </div>
  );
};