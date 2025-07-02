import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-stone-800 shadow-stone">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              Baking Great Bread at Home
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/recipes" className="text-stone-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Recipes
              </Link>
              <Link to="/books" className="text-stone-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Books
              </Link>
              <Link to="/tools" className="text-stone-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Tools
              </Link>
              <Link to="/blog" className="text-stone-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Blog
              </Link>
              <Link to="/community" className="text-stone-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Community
              </Link>
              <Button variant="warm" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-300 hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/recipes" className="text-stone-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Recipes
              </Link>
              <Link to="/books" className="text-stone-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Books
              </Link>
              <Link to="/tools" className="text-stone-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Tools
              </Link>
              <Link to="/blog" className="text-stone-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Blog
              </Link>
              <Link to="/community" className="text-stone-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Community
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;