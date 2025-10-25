import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveImage } from '@/components/ResponsiveImage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AffiliateAdvertisement } from '@/components/AffiliateAdvertisement';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterData {
  title: string;
  subtitle: string;
  content: string;
  heroImageUrl: string;
  inlineImageUrl?: string;
  socialImageUrl?: string;
  tags: string[];
}

const NewsletterPreview = () => {
  const { id } = useParams();
  const [newsletter, setNewsletter] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletter = async () => {
      if (!id) return;
      
      try {
        // First try with the newsletter flag, then fallback to just the ID
        let { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .eq('publish_as_newsletter', true)
          .single();

        // If not found with newsletter flag, try without it
        if (error && error.code === 'PGRST116') {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
          
          if (fallbackError) throw fallbackError;
          data = fallbackData;
        } else if (error) {
          throw error;
        }

        if (!data) throw new Error('Newsletter not found');

        setNewsletter({
          title: data.title,
          subtitle: data.subtitle,
          content: data.content,
          heroImageUrl: data.hero_image_url || '',
          inlineImageUrl: (data as any).inline_image_url || '',
          socialImageUrl: (data as any).social_image_url || '',
          tags: data.tags || []
        });
      } catch (error) {
        console.error('Error fetching newsletter:', error);
        setNewsletter(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Newsletter Not Found</h1>
          <p className="text-muted-foreground">The newsletter you're looking for doesn't exist or isn't published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-section-background text-foreground rounded-lg overflow-hidden">
          {/* Hero Image */}
          {newsletter.heroImageUrl && (
            <div className="relative overflow-hidden min-h-[500px] flex items-center">
              {/* Background Image */}
              <ResponsiveImage
                src={newsletter.heroImageUrl}
                alt={newsletter.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay Content */}
              <div className="relative z-10 w-full h-full flex items-center">
                <div className="max-w-7xl mx-auto px-8 py-16 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                    {/* Left Side - Text Content */}
                    <div className="text-white">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                        FROM BOARDROOM TO BREAD
                      </h1>
                      <p className="text-xl md:text-2xl lg:text-3xl font-medium text-amber-300 drop-shadow-md">
                        Henry Hunter's recipe for resilience
                      </p>
                    </div>
                    
                    {/* Right Side - Space for the person in the image */}
                    <div className="hidden lg:block">
                      {/* This space allows the person in the background image to be visible */}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            {newsletter.title && (
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif leading-tight">
                {newsletter.title}
              </h1>
            )}

            {/* Subtitle */}
            {newsletter.subtitle && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {newsletter.subtitle}
              </p>
            )}

            {/* Inline Thumbnail - Auto-displays after subtitle */}
            {newsletter.inlineImageUrl && (
              <ResponsiveImage
                src={newsletter.inlineImageUrl}
                alt={newsletter.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg my-6"
                loading="lazy"
              />
            )}

            {/* Author Block */}
            <div className="flex items-center gap-4 py-4 border-y border-border">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <ResponsiveImage 
                  src="/lovable-uploads/817f9119-54ab-4a7e-8906-143e981eac8a.png" 
                  alt="Henry Hunter - Master Baker"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="font-medium text-foreground">Henry Hunter</div>
                <div className="text-sm text-muted-foreground">Master Baker</div>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Content */}
            {newsletter.content && (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  skipHtml={false}
                  components={{
                    h1: ({children}) => <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground mb-4 mt-6 leading-tight">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl md:text-2xl font-bold font-serif text-foreground mb-3 mt-5 leading-tight">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg md:text-xl font-bold font-serif text-foreground mb-2 mt-4 leading-tight">{children}</h3>,
                    h4: ({children}) => <h4 className="text-base md:text-lg font-semibold text-foreground mb-2 mt-3">{children}</h4>,
                    h5: ({children}) => <h5 className="text-base font-semibold text-foreground mb-2 mt-3">{children}</h5>,
                    h6: ({children}) => <h6 className="text-sm font-semibold text-foreground mb-2 mt-3">{children}</h6>,
                    p: ({children}) => <p className="text-foreground mb-4 leading-relaxed text-sm md:text-base">{children}</p>,
                    ul: ({children}) => <ul className="list-disc pl-4 md:pl-6 mb-4 space-y-1 text-foreground">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-4 md:pl-6 mb-4 space-y-1 text-foreground">{children}</ol>,
                    li: ({children}) => <li className="text-foreground leading-relaxed text-sm md:text-base">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                    em: ({children}) => <em className="italic text-foreground">{children}</em>,
                    a: ({href, children}) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/20 text-foreground italic">{children}</blockquote>,
                    code: ({children}) => <code className="bg-muted px-2 py-1 rounded text-xs md:text-sm font-mono text-foreground">{children}</code>,
                    pre: ({children}) => <pre className="bg-muted p-3 md:p-4 rounded-lg overflow-x-auto my-4 text-xs md:text-sm">{children}</pre>,
                    img: ({src, alt}) => (
                      <div className="my-4 rounded-lg overflow-hidden">
                        <ResponsiveImage 
                          src={src || ''} 
                          alt={alt || ''} 
                          className="w-full h-auto object-cover" 
                          loading="lazy" 
                        />
                      </div>
                    )
                  }}
                >
                  {newsletter.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Affiliate Advertisement */}
            {newsletter.content.toLowerCase().includes('sourdough') && (
              <AffiliateAdvertisement
                title="Vitale Dehydrated Sourdough Starter"
                description="Can't revive your starter? Don't worry! Vitale's dehydrated sourdough starter is like you never missed a beat. Just add water and you're back to baking beautiful sourdough bread in no time."
                productImage="/lovable-uploads/99a7eb7a-a09d-4215-a771-2f6858b0d6ab.png"
                ctaText="Get Your Vitale Starter"
                affiliateLink="https://vitalesourdoughco.etsy.com"
                context="Struggling to revive your starter after neglecting it? You're not alone."
              />
            )}

            {/* CTA Card */}
            <Card className="bg-gradient-amber text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Bake?</h3>
                <p className="mb-4 opacity-90">
                  Get our latest recipes and baking tips delivered to your inbox.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPreview;