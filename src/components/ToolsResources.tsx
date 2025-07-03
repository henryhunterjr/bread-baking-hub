import { ArrowRight } from 'lucide-react';

const ToolsResources = () => {
  const tools = [
    {
      title: "Bread Baker's Glossary",
      description: "Comprehensive guide to bread baking terminology and techniques",
      icon: "📖",
      link: "/glossary",
      type: "reference"
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
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-3">{tool.title}</h3>
              <p className="text-stone-300 text-sm mb-4 line-clamp-3">{tool.description}</p>
              <a 
                href={tool.link}
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm group-hover:underline transition-colors"
              >
                Try it out
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsResources;