import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SkipLink, VisuallyHidden } from './AccessibilityComponents';
import officialLogo from '@/assets/official-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      
      <header 
        className="shadow-stone relative z-50 border-b border-border/20" 
        style={{backgroundColor: 'hsl(var(--header-background))'}}
        role="banner"
      >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="navigation" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="Baking Great Bread at Home - Home"
            >
              <img 
                src={officialLogo}
                alt="Baking Great Bread at Home - Official Logo"
                className="w-10 h-10 rounded-full object-cover shadow-lg"
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
                 href="/go?u=https%3A%2F%2Fwebsim.ai%2Fc%2F0F908fPvBQKz0z2wj" 
                 target="_self" 
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
                  <Link to="/my-favorites" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    My Favorites
                  </Link>
                  <Link to="/my-reviews" className="text-header-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    My Reviews
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
              className="text-header-foreground hover:text-primary h-11 w-11"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6" aria-hidden="true" /> : 
                <Menu className="h-6 w-6" aria-hidden="true" />
              }
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu" role="menu" aria-label="Mobile navigation menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" role="none">
              <Link to="/recipes" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Recipes
              </Link>
              <Link to="/vitale-starter" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Vitale Starter
              </Link>
               <Link to="/books" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                 Library
               </Link>
              <Link to="/glossary" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Glossary
              </Link>
              <Link to="/recipe-workspace" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Recipe Workspace
              </Link>
              <Link to="/blog" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Blog
              </Link>
              <Link to="/community" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Community
              </Link>
              <Link to="/troubleshooting" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Troubleshooting
              </Link>
               <a 
                 href="/go?u=https%3A%2F%2Fwebsim.ai%2Fc%2F0F908fPvBQKz0z2wj" 
                 target="_self" 
                 rel="noopener noreferrer"
                 className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors"
               >
                 Crust & Crumb
               </a>
              <Link to="/legal" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                Legal Information
              </Link>
              {user && (
                <>
                  <Link to="/my-recipes" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                    My Recipes
                  </Link>
                  <Link to="/dashboard" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors">
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
        </nav>
      </header>
    </>
  );
};

export default Header;