import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="bg-header shadow-stone">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/aff774b5-ec68-415b-b096-50a160fc1c53.png" 
                alt="Baking Great Bread at Home" 
                className="h-16 w-16 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
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
                Books
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
              <Link to="/crust-and-crumb" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Crust & Crumb
              </Link>
              {user ? (
                <>
                  <Link to="/my-recipes" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    My Recipes
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
                Books
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
              <Link to="/crust-and-crumb" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Crust & Crumb
              </Link>
              {user && (
                <Link to="/my-recipes" className="text-header-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  My Recipes
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;