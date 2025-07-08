import { Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RSSFeedLinkProps {
  className?: string;
}

export const RSSFeedLink = ({ className }: RSSFeedLinkProps) => {
  const rssUrl = 'https://ojyckskucneljvuqzrsw.supabase.co/functions/v1/rss-feed';

  const handleRSSClick = () => {
    window.open(rssUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Rss className="h-5 w-5 text-orange-500" />
          RSS Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Subscribe to our RSS feed to get the latest baking tips and recipes in your feed reader.
        </p>
        <Button 
          onClick={handleRSSClick}
          variant="outline" 
          size="sm"
          className="w-full"
        >
          <Rss className="h-4 w-4 mr-2" />
          Subscribe to RSS
        </Button>
      </CardContent>
    </Card>
  );
};

export default RSSFeedLink;