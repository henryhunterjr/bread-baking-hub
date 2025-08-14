import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SkipLink, VisuallyHidden } from './AccessibilityComponents';
import GlobalSearch from './GlobalSearch';
const officialLogo = '/lovable-uploads/82d8e259-f73d-4691-958e-1dd4d0bf240d.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

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
                className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/20"
                onError={(e) => {
                  console.error('Logo failed to load:', officialLogo);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Link>
          </div>
          
          
          <div className="hidden md:flex items-center space-x-6">
            {/* Global Search */}
            <div className="w-80">
              <GlobalSearch />
            </div>
            
            <div className="flex items-baseline space-x-4">
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
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden" 
              onClick={closeMenu}
              aria-hidden="true"
            />
            {/* Mobile menu */}
            <div className="fixed inset-x-0 top-16 z-50 md:hidden bg-background border-b border-border shadow-warm" id="mobile-menu" role="menu" aria-label="Mobile navigation menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[calc(100vh-4rem)] overflow-y-auto" role="none">
              <Link to="/recipes" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Recipes
              </Link>
              <Link to="/vitale-starter" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Vitale Starter
              </Link>
               <Link to="/books" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                 Library
               </Link>
              <Link to="/glossary" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Glossary
              </Link>
              <Link to="/recipe-workspace" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Recipe Workspace
              </Link>
              <Link to="/blog" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Blog
              </Link>
              <Link to="/community" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Community
              </Link>
              <Link to="/troubleshooting" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Troubleshooting
              </Link>
               <a 
                 href="/go?u=https%3A%2F%2Fwebsim.ai%2Fc%2F0F908fPvBQKz0z2wj" 
                 target="_self" 
                 rel="noopener noreferrer"
                 className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors"
                 onClick={closeMenu}
               >
                 Crust & Crumb
               </a>
              <Link to="/legal" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Legal Information
              </Link>
              {user && (
                <>
                  <Link to="/my-recipes" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                    My Recipes
                  </Link>
                  <Link to="/dashboard" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                    Dashboard
                  </Link>
                </>
              )}
            </div>
            </div>
          </>
        )}
        </nav>
      </header>
    </>
  );
};

export default Header;