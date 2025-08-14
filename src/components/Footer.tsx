import { Link } from 'react-router-dom';
import EnhancedNewsletterSignup from './enhanced/EnhancedNewsletterSignup';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-stone-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Baking Great Bread</h3>
            <p className="text-muted-foreground text-sm">
              Helping home bakers create artisan-quality bread with confidence and community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348S9.746 16.988 8.449 16.988z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@henryhunterjr" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recipes" className="text-muted-foreground hover:text-primary transition-colors">Recipes</Link></li>
              <li><Link to="/tools" className="text-muted-foreground hover:text-primary transition-colors">Recommended Tools</Link></li>
              <li><Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors">Baking Guides</Link></li>
              <li><Link to="/troubleshooting" className="text-muted-foreground hover:text-primary transition-colors">Troubleshooting</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">Join Our Group</Link></li>
              <li><Link to="/challenges" className="text-muted-foreground hover:text-primary transition-colors">Monthly Challenges</Link></li>
              <li><Link to="/coaching" className="text-muted-foreground hover:text-primary transition-colors">Personal Coaching</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Henry</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Connected</h4>
            <EnhancedNewsletterSignup 
              variant="inline"
              className="mb-4"
            />
          </div>
        </div>
        
        <div className="border-t border-stone-700 mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            © 2025 Henry Hunter. All rights reserved. Powered by Vitale Sourdough Co. and the Baking Great Bread at Home Facebook Group.
          </p>
          <p className="text-muted-foreground text-sm">
            <Link to="/legal" className="hover:text-primary transition-colors">Legal Information</Link> | 
            Contact us at <a href="mailto:vitalesourdough@gmail.com" className="hover:text-primary transition-colors">vitalesourdough@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;