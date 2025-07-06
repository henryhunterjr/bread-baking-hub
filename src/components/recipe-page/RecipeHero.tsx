import { Badge } from '@/components/ui/badge';

interface RecipeHeroProps {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export const RecipeHero = ({ title, date, author, description, imageUrl, imageAlt }: RecipeHeroProps) => {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Home</span>
        <span>»</span>
        <span>{title}</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-primary">
        {title}
      </h1>
      
      <div className="flex items-center justify-center gap-4 text-muted-foreground">
        <Badge variant="outline">{date}</Badge>
        <Badge variant="outline">{author}</Badge>
      </div>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        {description}
      </p>

      <div className="relative max-w-2xl mx-auto">
        <img 
          src={imageUrl}
          alt={imageAlt}
          className="rounded-2xl shadow-warm w-full h-auto"
        />
      </div>
    </div>
  );
};