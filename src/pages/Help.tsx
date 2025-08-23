import React, { useState } from 'react';
import { Search, ChevronRight, Book, Wrench, Users, Lightbulb, Settings, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Hero } from '@/components/ui/Hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Lightbulb,
      description: 'New to the platform? Start here for the basics',
      color: 'bg-primary/10 text-primary'
    },
    {
      id: 'recipe-workspace',
      title: 'Recipe & Workspace',
      icon: Book,
      description: 'Upload, format, edit, and manage your recipes',
      color: 'bg-accent/10 text-accent-foreground'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Tools',
      icon: Wrench,
      description: 'Diagnostic tools and bread problem solving',
      color: 'bg-destructive/10 text-destructive'
    },
    {
      id: 'community',
      title: 'Community & Social',
      icon: Users,
      description: 'Connect with other bakers and share recipes',
      color: 'bg-secondary/10 text-secondary-foreground'
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: Settings,
      description: 'AI assistant, calculators, and professional tools',
      color: 'bg-muted text-muted-foreground'
    }
  ];

  const quickStartGuides = [
    {
      title: 'Upload Your First Recipe',
      description: 'Learn how to format recipes using text or photos',
      link: '#recipe-upload',
      time: '3 min read'
    },
    {
      title: 'Troubleshoot Bread Problems',
      description: 'Use our diagnostic tools to fix baking issues',
      link: '#troubleshooting-guide',
      time: '5 min read'
    },
    {
      title: 'Use the AI Assistant (KRUSTY)',
      description: 'Get personalized baking advice and recipe help',
      link: '#ai-assistant',
      time: '4 min read'
    },
    {
      title: 'Save and Organize Recipes',
      description: 'Build your personal recipe collection',
      link: '#recipe-organization',
      time: '2 min read'
    }
  ];

  const faqData = [
    {
      question: 'How do I upload a recipe from a photo?',
      answer: 'Go to the Recipe Workspace, click "Upload Photo", select your image, and our AI will extract and format the recipe text automatically. You can then edit and save it to your collection.'
    },
    {
      question: 'What is the Crust & Crumb diagnostic tool?',
      answer: 'This professional tool analyzes photos of your finished bread to identify texture, crust, and crumb issues. Upload a clear photo and get detailed diagnosis with specific solutions.'
    },
    {
      question: 'How do I use voice commands in the workspace?',
      answer: 'Click the microphone icon in the Recipe Workspace to activate voice input. You can dictate recipes, ingredients, or instructions, and the system will transcribe and format them.'
    },
    {
      question: 'Can I export recipes to PDF?',
      answer: 'Yes! Use the "Save as PDF" button on any recipe page. This opens a print-optimized version that includes all ingredients, instructions, and photos.'
    },
    {
      question: 'How do I access Henry\'s books and premium content?',
      answer: 'Visit the Books section to browse Henry\'s published works. You can preview chapters, listen to audio excerpts, and purchase directly through the platform.'
    }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <Hero 
        imageSrc="/src/assets/help-hero.jpg"
        imageAlt="Help Center - Comprehensive bread baking support and guidance"
        title="Help Center"
        subtitle="Everything you need to master bread baking on our platform"
        variant="overlay"
        textPosition="center"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search help articles, features, or troubleshooting guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
        </div>

        {/* Quick Start Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Start Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {quickStartGuides.map((guide, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {guide.time}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{guide.description}</p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    Read Guide <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Help Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} to={`#${category.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Detailed Help Content */}
        <section className="mb-12">
          <Tabs defaultValue="workspace" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="workspace">Workspace</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="workspace" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Workspace Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Upload Methods</h4>
                    <p className="text-muted-foreground">• Text Input: Paste or type your recipe directly</p>
                    <p className="text-muted-foreground">• Photo Upload: Take or upload photos of recipe cards/books</p>
                    <p className="text-muted-foreground">• Voice Input: Use the microphone to dictate recipes</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Formatting & Editing</h4>
                    <p className="text-muted-foreground">• AI automatically formats ingredients and instructions</p>
                    <p className="text-muted-foreground">• Edit mode allows manual corrections and improvements</p>
                    <p className="text-muted-foreground">• Add photos, notes, and troubleshooting tips</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Saving & Organization</h4>
                    <p className="text-muted-foreground">• Save to your personal recipe collection</p>
                    <p className="text-muted-foreground">• Add tags, difficulty levels, and reviews</p>
                    <p className="text-muted-foreground">• Export as PDF or share with the community</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="troubleshooting" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Troubleshooting Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Recipe Analysis</h4>
                    <p className="text-muted-foreground">• Paste recipe text to detect potential issues</p>
                    <p className="text-muted-foreground">• AI identifies problems with hydration, timing, techniques</p>
                    <p className="text-muted-foreground">• Get specific solutions and preventive measures</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Crust & Crumb Diagnostic</h4>
                    <p className="text-muted-foreground">• Upload photos of finished bread</p>
                    <p className="text-muted-foreground">• Professional analysis of texture and appearance</p>
                    <p className="text-muted-foreground">• Detailed diagnosis with step-by-step fixes</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Scan History</h4>
                    <p className="text-muted-foreground">• Track all previous troubleshooting sessions</p>
                    <p className="text-muted-foreground">• Compare results and monitor improvements</p>
                    <p className="text-muted-foreground">• Re-run analyses with updated algorithms</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="library" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Library & Learning Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Henry's Books</h4>
                    <p className="text-muted-foreground">• Browse comprehensive bread baking guides</p>
                    <p className="text-muted-foreground">• Preview chapters and listen to audio excerpts</p>
                    <p className="text-muted-foreground">• Purchase digital or physical copies</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Blog & Articles</h4>
                    <p className="text-muted-foreground">• Expert techniques and troubleshooting guides</p>
                    <p className="text-muted-foreground">• Filter by categories, tags, and difficulty</p>
                    <p className="text-muted-foreground">• Search across all content for specific topics</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Glossary & Reference</h4>
                    <p className="text-muted-foreground">• Comprehensive bread terminology dictionary</p>
                    <p className="text-muted-foreground">• Visual guides for techniques and equipment</p>
                    <p className="text-muted-foreground">• Quick reference for measurements and conversions</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Account & Profile</h4>
                    <p className="text-muted-foreground">• Create and customize your baker profile</p>
                    <p className="text-muted-foreground">• Track your baking progress and achievements</p>
                    <p className="text-muted-foreground">• Manage privacy and sharing preferences</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Recipe Sharing</h4>
                    <p className="text-muted-foreground">• Share your successful recipes with the community</p>
                    <p className="text-muted-foreground">• Rate and review recipes from other bakers</p>
                    <p className="text-muted-foreground">• Follow your favorite recipe creators</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Newsletter & Updates</h4>
                    <p className="text-muted-foreground">• Subscribe to weekly baking tips and recipes</p>
                    <p className="text-muted-foreground">• Get notified about new content and features</p>
                    <p className="text-muted-foreground">• Join seasonal challenges and competitions</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">AI Assistant (KRUSTY)</h4>
                    <p className="text-muted-foreground">• Multiple chat modes: general, tips, substitutions, scaling</p>
                    <p className="text-muted-foreground">• Recipe-aware conversations with context</p>
                    <p className="text-muted-foreground">• Voice interaction and audio responses</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Bread Calculator</h4>
                    <p className="text-muted-foreground">• Calculate baker's percentages automatically</p>
                    <p className="text-muted-foreground">• Scale recipes up or down for any batch size</p>
                    <p className="text-muted-foreground">• Convert between metric and imperial units</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Vitale Starter Management</h4>
                    <p className="text-muted-foreground">• Track sourdough starter health and feeding schedules</p>
                    <p className="text-muted-foreground">• Get personalized maintenance recommendations</p>
                    <p className="text-muted-foreground">• Monitor fermentation timing and environment</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Collapsible key={index}>
                <CollapsibleTrigger
                  onClick={() => toggleSection(`faq-${index}`)}
                  className="flex w-full items-center justify-between p-4 text-left bg-card rounded-lg border hover:bg-accent transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${
                      expandedSections.has(`faq-${index}`) ? 'rotate-90' : ''
                    }`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="text-center">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our team is here to help!
              </p>
              <div className="space-y-2">
                <Button className="w-full">Contact Support</Button>
                <Button variant="outline" className="w-full">
                  Join Discord Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Help;