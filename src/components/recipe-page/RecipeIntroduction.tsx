import { Card } from '@/components/ui/card';

interface RecipeIntroductionProps {
  content: string[];
}

export const RecipeIntroduction = ({ content }: RecipeIntroductionProps) => {
  return (
    <Card className="p-8 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Introduction</h2>
      <div className="prose prose-lg max-w-none text-foreground">
        {content.map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
};