import { Badge } from '@/components/ui/badge';

interface RecipeHeaderProps {
  title: string;
  date: string;
  author: string;
  description: string;
}

export const RecipeHeader = ({ title, date, author, description }: RecipeHeaderProps) => {
  return (
    <div className="text-center space-y-6">
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
    </div>
  );
};