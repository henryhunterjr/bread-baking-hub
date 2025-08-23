import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HelpTip {
  id: string;
  title: string;
  content: string;
  type: 'tip' | 'warning' | 'info';
  learnMoreLink?: string;
}

interface ContextualHelpProps {
  tips: HelpTip[];
  className?: string;
  showByDefault?: boolean;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({ 
  tips, 
  className = '',
  showByDefault = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(showByDefault);

  if (!tips.length) return null;

  const getTypeStyles = (type: HelpTip['type']) => {
    switch (type) {
      case 'warning':
        return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'tip':
        return 'border-l-4 border-l-primary bg-primary/5';
      default:
        return 'border-l-4 border-l-accent bg-accent/5';
    }
  };

  const getTypeBadge = (type: HelpTip['type']) => {
    switch (type) {
      case 'warning':
        return <Badge variant="destructive" className="text-xs">Warning</Badge>;
      case 'tip':
        return <Badge variant="default" className="text-xs">Tip</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Info</Badge>;
    }
  };

  return (
    <Card className={`${className}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium">
                Help & Tips ({tips.length})
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className={`p-3 rounded-md ${getTypeStyles(tip.type)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    {getTypeBadge(tip.type)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {tip.content}
                  </p>
                  {tip.learnMoreLink && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 p-0 text-xs text-primary hover:text-primary/80"
                      onClick={() => window.open(tip.learnMoreLink, '_blank')}
                    >
                      Learn more <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};