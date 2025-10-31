import { ExternalLink, Eye, Heart } from "lucide-react";
import { useMediaKit } from "./MediaKitContext";

interface ContentItem {
  title: string;
  platform: string;
  url: string;
  thumbnail: string;
  views: number;
  engagement: number;
  excerpt: string;
}

const TopContent = () => {
  const { sectionVisibility } = useMediaKit();
  const topContent: ContentItem[] = [
    {
      title: "Caramel Apple Sticky Buns",
      platform: "Blog",
      url: "/blog/caramel-apple-sticky-buns",
      thumbnail: "/lovable-uploads/d2bb4e31-2942-4654-888e-13ef3bbeaa90.png",
      views: 85,
      engagement: 45,
      excerpt: "A fall favorite that combines sourdough with seasonal flavors...",
    },
    {
      title: "From Conference Room to Bread Baker",
      platform: "Blog",
      url: "/blog/from-conference-room-to-bread-baker",
      thumbnail: "/lovable-uploads/aff4f11b-5fc6-420e-8ac0-1c53dcc3dd20.png",
      views: 16,
      engagement: 28,
      excerpt: "The story of transitioning from corporate life to artisan baking...",
    },
    {
      title: "Salt Converter Tool",
      platform: "Website",
      url: "/salt-converter",
      thumbnail: "/placeholder.svg",
      views: 21,
      engagement: 15,
      excerpt: "Essential tool for converting between different types of salt...",
    },
  ];

  if (!sectionVisibility.topContent) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top Performing Content
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recent high-engagement content showcasing our reach and influence (Last 90 days)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topContent.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-video bg-muted overflow-hidden relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                  {item.platform}
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{item.engagement}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            Content consistently drives engagement and community participation
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopContent;
