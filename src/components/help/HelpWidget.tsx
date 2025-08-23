import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface HelpWidgetProps {
  currentPage?: string;
}

export const HelpWidget: React.FC<HelpWidgetProps> = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getContextualHelp = () => {
    switch (currentPage) {
      case '/workspace':
      case '/recipe-workspace':
        return [
          { title: 'Upload a Recipe Photo', description: 'Learn how to format recipes from images', link: '/help#recipe-upload' },
          { title: 'Edit Recipe Details', description: 'Customize ingredients and instructions', link: '/help#recipe-editing' },
          { title: 'Voice Input Guide', description: 'Use voice commands to dictate recipes', link: '/help#voice-input' }
        ];
      case '/troubleshooting':
        return [
          { title: 'Recipe Analysis Tool', description: 'Detect issues in your bread recipes', link: '/help#recipe-analysis' },
          { title: 'Crust & Crumb Diagnostic', description: 'Analyze finished bread photos', link: '/help#crust-crumb' },
          { title: 'Understanding Results', description: 'Interpret troubleshooting feedback', link: '/help#interpreting-results' }
        ];
      case '/tools/crust-and-crumb':
        return [
          { title: 'Photo Upload Tips', description: 'Best practices for bread photography', link: '/help#photo-tips' },
          { title: 'Diagnostic Process', description: 'How the AI analyzes your bread', link: '/help#diagnostic-process' },
          { title: 'Implementing Solutions', description: 'Apply recommendations effectively', link: '/help#solutions' }
        ];
      case '/books':
        return [
          { title: 'Preview Content', description: 'Explore chapters and audio samples', link: '/help#book-previews' },
          { title: 'Purchase Options', description: 'Digital vs physical book formats', link: '/help#purchase-options' },
          { title: 'Access Your Library', description: 'Find and organize purchased books', link: '/help#book-library' }
        ];
      default:
        return [
          { title: 'Getting Started', description: 'New user onboarding guide', link: '/help#getting-started' },
          { title: 'Recipe Workspace', description: 'Upload and format your recipes', link: '/help#workspace' },
          { title: 'Troubleshooting Tools', description: 'Diagnose and fix bread problems', link: '/help#troubleshooting' }
        ];
    }
  };

  const contextualHelp = getContextualHelp();

  const quickActions = [
    { title: 'Search All Help', action: () => window.open('/help', '_blank') },
    { title: 'Contact Support', action: () => window.open('mailto:support@henryhunter.com', '_blank') },
    { title: 'Join Community', action: () => window.open('https://discord.gg/breadbaking', '_blank') }
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
          aria-label="Open help"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Help & Support</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>

          {/* Contextual Help */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-sm">For This Page</h4>
              <Badge variant="secondary" className="text-xs">
                {contextualHelp.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {contextualHelp.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-accent text-sm transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div>
                    <div className="font-medium group-hover:text-primary">
                      {item.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
            <div className="grid gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className="justify-start h-8 text-xs"
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </div>

          {/* View Full Help Center */}
          <Link to="/help" onClick={() => setIsOpen(false)}>
            <Button className="w-full" size="sm">
              View Full Help Center
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};