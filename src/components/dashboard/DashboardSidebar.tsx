import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FileText, Plus, Settings, Home, PenTool } from 'lucide-react';

const DashboardSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      title: 'All Posts',
      href: '/dashboard?tab=posts',
      icon: FileText,
      active: location.search.includes('tab=posts') || (!location.search.includes('tab=') && !location.search.includes('new='))
    },
    {
      title: 'Create New',
      href: '/dashboard?tab=blog',
      icon: Plus,
      active: location.search.includes('tab=blog')
    },
    {
      title: 'Inbox',
      href: '/dashboard?tab=inbox',
      icon: FileText,
      active: location.search.includes('tab=inbox')
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      active: location.pathname === '/dashboard/settings'
    }
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Home className="w-5 h-5" />
          <span className="font-semibold">Back to Site</span>
        </Link>
      </div>

      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-amber rounded-lg flex items-center justify-center">
            <PenTool className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Content Hub</h2>
            <p className="text-sm text-muted-foreground">Baking Great Bread</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Dashboard v1.0
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;