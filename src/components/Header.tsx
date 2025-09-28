import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Info, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { SkipLink, VisuallyHidden } from './AccessibilityComponents';
import GlobalSearch from './GlobalSearch';
import { useScrollLock } from '@/hooks/useScrollLock';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
const officialLogo = '/lovable-uploads/82d8e259-f73d-4691-958e-1dd4d0bf240d.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Use the scroll lock hook for mobile menu
  useScrollLock(isMenuOpen, 'mobile-menu');

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      
      <header 
        className="shadow-stone relative z-50 border-b border-border/20 h-16 md:h-20" 
        style={{backgroundColor: 'hsl(var(--header-background))'}}
        role="banner"
      >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="navigation" role="navigation" aria-label="Main navigation">
        <div className="flex items-center h-16 gap-4">
          {/* Logo - Far Left */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="Baking Great Bread at Home - Home"
            >
               <SafeImage
                 src={officialLogo}
                 alt="Baking Great Bread at Home - Official Logo"
                 width={48}
                 height={48}
                 fit="cover"
                 className="w-12 h-12 rounded-full shadow-lg border-2 border-white/20"
                 onError={(e) => {
                   e.currentTarget.src = '/placeholder.svg';
                 }}
               />
            </Link>
          </div>

          {/* Search Bar - Center Left (Desktop Only) */}
          <div className="hidden lg:flex flex-shrink-0">
            <div className="w-80">
              <GlobalSearch />
            </div>
          </div>
          
          {/* Navigation Links - Compact for all desktop screens */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/recipes" className="text-header-foreground hover:text-primary px-2 py-2 rounded-md text-sm font-medium transition-colors">
                      Recipes
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/vitale-starter" className="text-header-foreground hover:text-primary px-2 py-2 rounded-md text-sm font-medium transition-colors">
                      Vitale Starter
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/books" 
                      className="text-header-foreground hover:text-primary px-2 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Library
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/recipe-workspace" className="text-header-foreground hover:text-primary px-2 py-2 rounded-md text-sm font-medium transition-colors">
                      Workspace
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/crust-and-crumb" className="text-header-foreground hover:text-primary px-2 py-2 rounded-md text-sm font-medium transition-colors">
                      Crust & Crumb
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/blog" className="text-header-foreground hover:text-primary px-2 py-2 rounded-md text-sm font-medium transition-colors">
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="text-header-foreground hover:text-primary text-sm font-medium px-2 py-2 h-auto"
                      >
                        More
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="bottom" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/glossary" className="w-full cursor-pointer">
                          Glossary
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/troubleshooting" className="w-full cursor-pointer">
                          Troubleshooting
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/help" className="w-full cursor-pointer">
                          Help
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/salt-converter" className="w-full cursor-pointer">
                          Salt Converter
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/community" className="w-full cursor-pointer">
                          Community
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/legal" className="w-full cursor-pointer">
                          Legal Information
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Actions - Far Right */}
          <div className="hidden md:flex items-center flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-header-foreground hover:text-primary text-xs font-medium px-1 py-2 h-auto"
                  >
                    Account
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-36">
                  <DropdownMenuItem asChild>
                    <Link to="/my-recipes" className="w-full cursor-pointer">
                      My Recipes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-favorites" className="w-full cursor-pointer">
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-reviews" className="w-full cursor-pointer">
                      Reviews
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={signOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="warm" size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button - Far Right (Mobile Only) */}
          <div className="md:hidden ml-auto">
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
              
              {/* Search in mobile menu */}
              <div className="px-3 py-2">
                <GlobalSearch />
              </div>
              
              <div className="border-t border-border my-2"></div>
              
              <Link to="/recipes" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Recipes
              </Link>
              <Link to="/vitale-starter" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Vitale Starter
              </Link>
              <Link 
                to="/books" 
                className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" 
                onClick={closeMenu}
              >
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
               <Link to="/help" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                 Help
               </Link>
               <Link to="/salt-converter" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                 Salt Converter
               </Link>
              <Link to="/crust-and-crumb" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Crust & Crumb
              </Link>
              <Link to="/legal" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                Legal Information
              </Link>
              {user ? (
                <>
                  <div className="border-t border-border my-2"></div>
                  <Link to="/my-recipes" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                    My Recipes
                  </Link>
                  <Link to="/my-favorites" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                    My Favorites
                  </Link>
                  <Link to="/my-reviews" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                    My Reviews
                  </Link>
                  <Link to="/dashboard" className="text-header-foreground hover:text-primary block px-3 py-3 min-h-11 rounded-md text-base font-medium transition-colors" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Button 
                    variant="warm" 
                    size="sm" 
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="mx-3 mt-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <div className="border-t border-border my-2"></div>
                  <div className="px-3 py-2">
                    <Button variant="warm" size="sm" asChild className="w-full">
                      <Link to="/auth" onClick={closeMenu}>Login</Link>
                    </Button>
                  </div>
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