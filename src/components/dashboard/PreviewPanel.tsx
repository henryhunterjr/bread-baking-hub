import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Share2, BookOpen, Mail } from 'lucide-react';
import { AffiliateAdvertisement } from '@/components/AffiliateAdvertisement';
import { ResponsiveImage } from '@/components/ResponsiveImage';

interface BlogPostData {
  title: string;
  subtitle: string;
  content: string;
  heroImageUrl: string;
  tags: string[];
  publishAsNewsletter: boolean;
  isDraft: boolean;
}

interface PreviewPanelProps {
  postData: BlogPostData;
  isNewsletter?: boolean;
}

const PreviewPanel = ({ postData, isNewsletter = false }: PreviewPanelProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: postData.title,
        text: postData.subtitle,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Live Preview
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            {isNewsletter ? (
              <Badge variant="secondary">
                <Mail className="w-3 h-3 mr-1" />
                Newsletter
              </Badge>
            ) : (
              <Badge variant="secondary">
                <BookOpen className="w-3 h-3 mr-1" />
                Blog Post
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-section-background text-foreground">
          {/* Hero Image */}
          {postData.heroImageUrl && (
            <div className="aspect-video relative overflow-hidden">
              <ResponsiveImage
                src={postData.heroImageUrl}
                alt={postData.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            {postData.title && (
              <h1 className="text-3xl md:text-4xl font-bold text-foreground font-serif leading-tight">
                {postData.title}
              </h1>
            )}

            {/* Subtitle */}
            {postData.subtitle && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {postData.subtitle}
              </p>
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
            {postData.content && (
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-blockquote:text-foreground">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-bold font-serif text-foreground mb-6 mt-8 leading-tight">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold font-serif text-foreground mb-4 mt-6 leading-tight">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-bold font-serif text-foreground mb-3 mt-5 leading-tight">{children}</h3>,
                    h4: ({children}) => <h4 className="text-lg font-semibold text-foreground mb-2 mt-4">{children}</h4>,
                    p: ({children}) => <p className="text-foreground mb-4 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-foreground">{children}</ol>,
                    li: ({children}) => <li className="text-foreground leading-relaxed">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                    em: ({children}) => <em className="italic text-foreground">{children}</em>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/20 text-foreground italic">{children}</blockquote>,
                    code: ({children}) => <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">{children}</code>,
                    pre: ({children}) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                  }}
                >
                  {postData.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Tags */}
            {postData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* CTA Card */}
            <Card className="bg-gradient-amber text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Bake?</h3>
                <p className="mb-4 opacity-90">
                  Get our latest recipes and baking tips delivered to your inbox.
                </p>
                <Button variant="secondary" size="lg">
                  Subscribe to Newsletter
                </Button>
              </CardContent>
            </Card>

            {/* Affiliate Advertisement */}
            {postData.content.toLowerCase().includes('sourdough') && (
              <AffiliateAdvertisement
                title="Vitale Dehydrated Sourdough Starter"
                description="Can't revive your starter? Don't worry! Vitale's dehydrated sourdough starter is like you never missed a beat. Just add water and you're back to baking beautiful sourdough bread in no time."
                productImage="/lovable-uploads/99a7eb7a-a09d-4215-a771-2f6858b0d6ab.png"
                ctaText="Get Your Vitale Starter"
                affiliateLink="https://vitalesourdoughco.etsy.com"
                context="Struggling to revive your starter after neglecting it? You're not alone."
              />
            )}

            {/* Share Bar (Desktop) */}
            <div className="hidden md:flex items-center justify-between pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Share this {isNewsletter ? 'newsletter' : 'post'}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Facebook</Button>
                <Button size="sm" variant="outline">Twitter</Button>
                <Button size="sm" variant="outline">Email</Button>
              </div>
            </div>

            {/* Mobile Share Button */}
            <div className="md:hidden pt-6 border-t border-border">
              <Button className="w-full" variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share this {isNewsletter ? 'newsletter' : 'post'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewPanel;