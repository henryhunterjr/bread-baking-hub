import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import challengeBreadImage from '@/assets/challenge-bread.jpg';

const LatestBlogPosts = () => {
  const posts = [
    {
      title: "The Science Behind Perfect Bread Crust",
      excerpt: "Understanding how temperature, humidity, and steam create that ideal golden crust we all love.",
      date: "June 28, 2025",
      image: challengeBreadImage,
      slug: "science-perfect-bread-crust",
      readTime: "8 min read"
    },
    {
      title: "Troubleshooting Dense Sourdough",
      excerpt: "Five common mistakes that lead to dense loaves and the simple fixes that will transform your bread.",
      date: "June 22, 2025", 
      image: challengeBreadImage,
      slug: "troubleshooting-dense-sourdough",
      readTime: "6 min read"
    },
    {
      title: "Seasonal Flour Adjustments",
      excerpt: "How humidity and temperature changes affect your flour and what adjustments to make year-round.",
      date: "June 15, 2025",
      image: challengeBreadImage, 
      slug: "seasonal-flour-adjustments",
      readTime: "10 min read"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Latest from the Blog</h2>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Fresh insights, techniques, and troubleshooting tips to elevate your bread baking
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="bg-card rounded-xl overflow-hidden shadow-stone hover:shadow-warm transition-shadow group">
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-foreground px-2 py-1 rounded text-sm">
                  {post.readTime}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-primary text-sm font-medium">{post.date}</div>
                <h3 className="text-xl font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <a 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Read More
                  <ArrowRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="warm" size="xl" asChild>
            <a href="/blog">View All Posts</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;