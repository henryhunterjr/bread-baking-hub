import { ArrowRight, Info } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ToolsResources = () => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const tools = [
    {
      title: "Bread Baker's Glossary",
      description: "Comprehensive guide to bread baking terminology and techniques",
      icon: "📖",
      link: "/glossary",
      type: "reference"
    },
    {
      title: "Professional Bread Calculator",
      description: "Scientific precision for perfect dough ratios and baker's percentages",
      icon: "🧮",
      link: "/bread-calculator",
      type: "calculator",
      hasInfo: true,
      infoContent: "Perfect Your Dough with Scientific Precision. Stop guessing and start calculating. This professional-grade bread calculator takes the mystery out of bread formulation, giving you the tools to create consistent, delicious results every single time."
    },
    {
      title: "Troubleshooting Guide",
      description: "Diagnose and fix common bread baking problems",
      icon: "🔧",
      link: "/troubleshooting", 
      type: "guide"
    },
    {
      title: "Community Welcome",
      description: "New to our Facebook group? Start here for the best experience",
      icon: "👋",
      link: "https://bit.ly/3srdSYS",
      type: "community"
    },
    {
      title: "Crust & Crumb App",
      description: "AI-powered recipe assistant and progress tracker (coming soon)",
      icon: "📱",
      link: "https://websim.ai/c/0F908fPvBQKz0z2wj",
      type: "app"
    }
  ];

  return (
    <section className="py-20 px-4 bg-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Tools & Resources</h2>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Interactive tools and guides to accelerate your bread baking journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div key={index} className="bg-stone-700 rounded-xl p-6 hover:bg-stone-600 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{tool.icon}</div>
                {tool.hasInfo && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-stone-400 hover:text-primary"
                    onClick={() => {
                      setSelectedTool(tool);
                      setShowInfoDialog(true);
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{tool.title}</h3>
              <p className="text-stone-300 text-sm mb-4 line-clamp-3">{tool.description}</p>
              <a 
                href={tool.link.startsWith('http') ? `/go?u=${encodeURIComponent(tool.link)}` : tool.link}
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm group-hover:underline transition-colors"
              >
                Try it out
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Info Dialog */}
        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogContent className="max-w-2xl" aria-describedby="tool-desc">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTool?.icon} {selectedTool?.title}
              </DialogTitle>
              <DialogDescription id="tool-desc" className="sr-only">
                Information and details about the {selectedTool?.title} tool
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {selectedTool?.infoContent}
              </p>
              <Button asChild className="w-full">
                <a href={selectedTool?.link ? (selectedTool.link.startsWith('http') ? `/go?u=${encodeURIComponent(selectedTool.link)}` : selectedTool.link) : '#'}>
                  Try the Calculator
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ToolsResources;