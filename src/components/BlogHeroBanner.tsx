import { Card } from '@/components/ui/card';

interface BlogHeroBannerProps {
  className?: string;
}

const BlogHeroBanner = ({ className = "" }: BlogHeroBannerProps) => {
  return (
    <Card className={`overflow-hidden border-0 shadow-lg ${className}`}>
      <div className="relative">
        <img
          src="/lovable-uploads/e12fcac9-ef30-4481-9992-e89c6b39233d.png"
          alt="Baking Great Bread at Home Blog - Artisan bread on wooden cutting board in a warm kitchen setting"
          className="w-full h-48 md:h-64 lg:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>
    </Card>
  );
};

export default BlogHeroBanner;