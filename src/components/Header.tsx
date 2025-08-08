import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Info, Wheat } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="shadow-stone relative z-50 border-b border-border/20" style={{backgroundColor: 'hsl(var(--header-background))'}}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <Wheat className="w-6 h-6 text-white" />
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/recipes" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Recipes
              </Link>
              <Link to="/vitale-starter" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Vitale Starter
              </Link>
               <Link to="/books" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                 Library
               </Link>
              <Link to="/glossary" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Glossary
              </Link>
              <Link to="/recipe-workspace" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Recipe Workspace
              </Link>
              <Link to="/blog" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Blog
              </Link>
              <Link to="/community" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Community
              </Link>
              <Link to="/troubleshooting" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Troubleshooting
              </Link>
               <a 
                 href="https://websim.ai/c/0F908fPvBQKz0z2wj" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
               >
                 Crust & Crumb
               </a>
              <Link 
                to="/legal" 
                className="text-header-foreground hover:text-primary px-2 py-2 rounded-md transition-colors"
                title="Legal Information"
              >
                <Info className="h-4 w-4" />
              </Link>
              {user ? (
                <>
                  <Link to="/my-recipes" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    My Recipes
                  </Link>
                  <Link to="/dashboard" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Button variant="warm" size="sm" onClick={signOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="warm" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-header-foreground hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/recipes" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Recipes
              </Link>
              <Link to="/vitale-starter" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Vitale Starter
              </Link>
               <Link to="/books" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                 Library
               </Link>
              <Link to="/glossary" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Glossary
              </Link>
              <Link to="/recipe-workspace" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Recipe Workspace
              </Link>
              <Link to="/blog" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Blog
              </Link>
              <Link to="/community" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Community
              </Link>
              <Link to="/troubleshooting" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Troubleshooting
              </Link>
               <a 
                 href="https://websim.ai/c/0F908fPvBQKz0z2wj" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
               >
                 Crust & Crumb
               </a>
              <Link to="/legal" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Legal Information
              </Link>
              {user && (
                <>
                  <Link to="/my-recipes" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                    My Recipes
                  </Link>
                  <Link to="/dashboard" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;